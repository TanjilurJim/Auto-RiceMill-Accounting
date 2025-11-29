<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('rent_vouchers', function (Blueprint $table) {
            if (!Schema::hasColumn('rent_vouchers', 'journal_id')) {
                $table->unsignedBigInteger('journal_id')->nullable()->after('vch_no');
            }
            if (!Schema::hasColumn('rent_vouchers', 'status')) {
                $table->string('status', 30)->default('approved')->after('journal_id'); // draft|pending_sub|pending_resp|approved|rejected
            }
            if (!Schema::hasColumn('rent_vouchers', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('status');
            }
            if (!Schema::hasColumn('rent_vouchers', 'approved_by')) {
                $table->unsignedBigInteger('approved_by')->nullable()->after('approved_at');
            }
            if (!Schema::hasColumn('rent_vouchers', 'initial_receipt_id')) {
                $table->unsignedBigInteger('initial_receipt_id')->nullable()->after('received_amount');
            }
            if (!Schema::hasColumn('rent_vouchers', 'sub_responsible_id')) {
                $table->unsignedBigInteger('sub_responsible_id')->nullable()->after('initial_receipt_id');
            }
            if (!Schema::hasColumn('rent_vouchers', 'responsible_id')) {
                $table->unsignedBigInteger('responsible_id')->nullable()->after('sub_responsible_id');
            }

            // indexes
            $table->index(['party_ledger_id'], 'rv_party_idx');
            $table->index(['status'], 'rv_status_idx');
            $table->index(['journal_id'], 'rv_journal_idx');
            $table->index(['approved_by'], 'rv_approved_by_idx');
        });

        // FKs (wrapped so re-running is safe)
        Schema::table('rent_vouchers', function (Blueprint $table) {
            if (!app()->runningUnitTests()) {
                try { $table->foreign('journal_id')->references('id')->on('journals')->nullOnDelete(); } catch (\Throwable $e) {}
                try { $table->foreign('approved_by')->references('id')->on('users')->nullOnDelete(); } catch (\Throwable $e) {}
                try { $table->foreign('initial_receipt_id')->references('id')->on('received_adds')->nullOnDelete(); } catch (\Throwable $e) {}
                try { $table->foreign('sub_responsible_id')->references('id')->on('users')->nullOnDelete(); } catch (\Throwable $e) {}
                try { $table->foreign('responsible_id')->references('id')->on('users')->nullOnDelete(); } catch (\Throwable $e) {}
            }
        });

        // Optional backfill: mark existing rows approved with approved_at = created_at (only if null)
        DB::statement("
            UPDATE rent_vouchers
            SET status = COALESCE(status, 'approved'),
                approved_at = COALESCE(approved_at, created_at)
            WHERE approved_at IS NULL
        ");
    }

    public function down(): void
    {
        Schema::table('rent_vouchers', function (Blueprint $table) {
            // drop FKs if present
            foreach (['rent_vouchers_journal_id_foreign','rent_vouchers_approved_by_foreign','rent_vouchers_initial_receipt_id_foreign','rent_vouchers_sub_responsible_id_foreign','rent_vouchers_responsible_id_foreign'] as $fk) {
                try { $table->dropForeign($fk); } catch (\Throwable $e) {}
            }

            // drop indexes
            foreach (['rv_party_idx','rv_status_idx','rv_journal_idx','rv_approved_by_idx'] as $idx) {
                try { $table->dropIndex($idx); } catch (\Throwable $e) {}
            }

            // drop columns if exist
            foreach (['journal_id','status','approved_at','approved_by','initial_receipt_id','sub_responsible_id','responsible_id'] as $col) {
                if (Schema::hasColumn('rent_vouchers', $col)) {
                    $table->dropColumn($col);
                }
            }
        });
    }
};