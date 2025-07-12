<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('rent_vouchers', function (Blueprint $table) {
            // 1️⃣  add new column (nullable until all code uses it)
            $table->unsignedBigInteger('received_mode_id')->nullable()
                  ->after('previous_balance');

            // 2️⃣  add FK constraint
            $table->foreign('received_mode_id')
                  ->references('id')->on('received_modes')
                  ->cascadeOnUpdate()->restrictOnDelete();

            // 3️⃣  (optional) drop old string column
            if (Schema::hasColumn('rent_vouchers', 'received_mode')) {
                $table->dropColumn('received_mode');
            }
        });
    }

    public function down(): void
    {
        Schema::table('rent_vouchers', function (Blueprint $table) {
            // reverse the changes
            if (Schema::hasColumn('rent_vouchers', 'received_mode_id')) {
                $table->dropForeign(['received_mode_id']);
                $table->dropColumn('received_mode_id');
            }

            // (optional) restore old received_mode column
            // $table->string('received_mode', 30)->nullable();
        });
    }
};
