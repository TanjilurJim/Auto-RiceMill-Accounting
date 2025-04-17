<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->unsignedBigInteger('journal_id')->nullable()->after('voucher_no');
            $table->foreign('journal_id')->references('id')->on('journals')->nullOnDelete();

            $table->unsignedBigInteger('received_mode_id')->nullable()->after('account_ledger_id');
            $table->foreign('received_mode_id')->references('id')->on('received_modes')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            //
        });
    }
};
