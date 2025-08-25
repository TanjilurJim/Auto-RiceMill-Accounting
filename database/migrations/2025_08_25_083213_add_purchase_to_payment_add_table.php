<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('payment_adds', function (Blueprint $table) {
            //
            $table->foreignId('purchase_id')->nullable()->after('voucher_no')->constrained()->cascadeOnDelete();
            $table->index(['purchase_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_adds', function (Blueprint $table) {
            //
        });
    }
};
