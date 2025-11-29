<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('rent_voucher_receipts', function (Blueprint $table) {
            // add indexes if not present
            $table->index(['rent_voucher_id'], 'rvr_voucher_idx');
            $table->index(['received_add_id'], 'rvr_received_idx');

            // add FK for rent_voucher_id
            try {
                $table->foreign('rent_voucher_id', 'rvr_voucher_fk')
                      ->references('id')->on('rent_vouchers')
                      ->cascadeOnDelete();
            } catch (\Throwable $e) {
                // ignore if already exists
            }

            // ensure FK for received_add_id exists (might already)
            try {
                $table->foreign('received_add_id', 'rvr_received_fk')
                      ->references('id')->on('received_adds')
                      ->cascadeOnDelete();
            } catch (\Throwable $e) {
                // ignore if already exists
            }
        });
    }

    public function down(): void
    {
        Schema::table('rent_voucher_receipts', function (Blueprint $table) {
            foreach (['rvr_voucher_fk','rvr_received_fk'] as $fk) {
                try { $table->dropForeign($fk); } catch (\Throwable $e) {}
            }
            foreach (['rvr_voucher_idx','rvr_received_idx'] as $idx) {
                try { $table->dropIndex($idx); } catch (\Throwable $e) {}
            }
        });
    }
};
