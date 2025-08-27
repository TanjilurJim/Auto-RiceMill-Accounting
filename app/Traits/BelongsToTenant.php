<?php

namespace App\Traits;

use Illuminate\Support\Facades\Schema;

trait BelongsToTenant
{
    // cache results per connection.table to avoid repeated schema lookups
    protected static array $__tenantHasCreatedBy = [];

    protected static function bootBelongsToTenant()
    {
        static::addGlobalScope('tenant', function ($q) {
            $ids = user_scope_ids();
            if (!$ids) {
                return; // admin or no restriction
            }

            $model      = $q->getModel();
            $table      = $model->getTable();
            $connection = $model->getConnectionName() ?: config('database.default');
            $cacheKey   = $connection.'.'.$table;

            if (!array_key_exists($cacheKey, static::$__tenantHasCreatedBy)) {
                static::$__tenantHasCreatedBy[$cacheKey] =
                    Schema::connection($connection)->hasColumn($table, 'created_by');
            }

            // Only add the filter if this table actually has the column
            if (static::$__tenantHasCreatedBy[$cacheKey]) {
                $q->whereIn("$table.created_by", $ids);
            }
        });
    }
}
