<?php

namespace App\Traits;

use App\Models\FinancialYear;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

/**
 * Trait EnsuresWithinFinancialYear
 *
 * Behavior:
 *  - If the model defines override properties (see below), they are used.
 *  - Otherwise sensible defaults are used.
 *
 * Optional model properties you can define:
 *  protected $financialYearDateColumn = 'date';
 *  protected $financialYearIdColumn   = 'financial_year_id';
 *  protected $financialYearValidateBy = 'date'; // or 'period'
 *  protected $financialYearPeriodMonthColumn = 'month';
 *  protected $financialYearPeriodYearColumn  = 'year';
 *
 * The trait intentionally does NOT declare those properties to avoid
 * property-composition conflicts with models that declare them.
 */
trait EnsuresWithinFinancialYear
{
    public static function bootEnsuresWithinFinancialYear()
    {
        static::creating(function ($model) {
            static::validateAndAssignFinancialYear($model, 'creating');
        });

        static::updating(function ($model) {
            static::validateAndAssignFinancialYear($model, 'updating');
        });
    }

    protected static function validateAndAssignFinancialYear($model, string $context = 'creating')
    {
        // find current open financial year
        $fy = FinancialYear::where('is_closed', false)->orderByDesc('start_date')->first();

        if (! $fy) {
            throw ValidationException::withMessages([
                'financial_year' => 'No open financial year found. Contact the administrator.',
            ]);
        }

        // Resolve model overrides (no trait-level property declarations to avoid collisions)
        $dateCol = property_exists($model, 'financialYearDateColumn') ? $model->financialYearDateColumn : 'date';
        $fyIdCol = property_exists($model, 'financialYearIdColumn') ? $model->financialYearIdColumn : 'financial_year_id';
        $strategy = property_exists($model, 'financialYearValidateBy') ? $model->financialYearValidateBy : 'date';

        if ($strategy === 'period') {
            $monthCol = property_exists($model, 'financialYearPeriodMonthColumn') ? $model->financialYearPeriodMonthColumn : 'month';
            $yearCol  = property_exists($model, 'financialYearPeriodYearColumn') ? $model->financialYearPeriodYearColumn : 'year';

            $month = $model->getAttribute($monthCol) ?? $model->getOriginal($monthCol);
            $year  = $model->getAttribute($yearCol) ?? $model->getOriginal($yearCol);

            if (empty($month) || empty($year)) {
                throw ValidationException::withMessages([
                    $monthCol => 'Period month and year are required to validate the financial year.',
                ]);
            }

            try {
                $periodDate = Carbon::create((int)$year, (int)$month, 1)->startOfDay();
            } catch (\Exception $e) {
                throw ValidationException::withMessages([
                    $monthCol => 'Invalid period month/year.',
                ]);
            }

            $fyStart = Carbon::parse($fy->start_date)->startOfDay();
            $fyEnd   = Carbon::parse($fy->end_date)->endOfDay();

            if (! $periodDate->between($fyStart, $fyEnd)) {
                throw ValidationException::withMessages([
                    $monthCol => "The selected period ({$periodDate->toDateString()}) is outside the open financial year ({$fyStart->toDateString()} - {$fyEnd->toDateString()}).",
                ]);
            }

            $providedFyId = $model->getAttribute($fyIdCol) ?? null;
            if (! empty($providedFyId) && ((int)$providedFyId !== (int)$fy->id)) {
                throw ValidationException::withMessages([
                    $fyIdCol => 'Provided financial_year_id does not match the currently open financial year.',
                ]);
            }

            if (empty($providedFyId)) {
                $model->setAttribute($fyIdCol, $fy->id);
            }

            return;
        }

        // Default: validate by date column
        $dateValue = $model->getAttribute($dateCol) ?? $model->getOriginal($dateCol);

        if (empty($dateValue)) {
            throw ValidationException::withMessages([
                $dateCol => 'Date is required to validate financial year.',
            ]);
        }

        if ($dateValue instanceof Carbon) {
            $d = $dateValue->copy()->startOfDay();
        } else {
            try {
                $d = Carbon::parse($dateValue)->startOfDay();
            } catch (\Exception $e) {
                throw ValidationException::withMessages([
                    $dateCol => 'Invalid date format.',
                ]);
            }
        }

        $fyStart = Carbon::parse($fy->start_date)->startOfDay();
        $fyEnd   = Carbon::parse($fy->end_date)->endOfDay();

        if (! $d->between($fyStart, $fyEnd)) {
            throw ValidationException::withMessages([
                $dateCol => "The {$dateCol} ({$d->toDateString()}) must be within the open financial year ({$fyStart->toDateString()} - {$fyEnd->toDateString()}).",
            ]);
        }

        $providedFyId = $model->getAttribute($fyIdCol) ?? null;
        if (! empty($providedFyId) && ((int)$providedFyId !== (int)$fy->id)) {
            throw ValidationException::withMessages([
                $fyIdCol => 'Provided financial_year_id does not match the currently open financial year.',
            ]);
        }

        if (empty($providedFyId)) {
            $model->setAttribute($fyIdCol, $fy->id);
        }
    }
}
