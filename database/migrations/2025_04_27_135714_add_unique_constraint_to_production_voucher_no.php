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
        Schema::table('finished_products', function (Blueprint $table) {
            $table->unique(['production_voucher_no', 'created_by']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('finished_products', function (Blueprint $table) {
            $table->dropUnique(['production_voucher_no', 'created_by']);
        });
    }
};
