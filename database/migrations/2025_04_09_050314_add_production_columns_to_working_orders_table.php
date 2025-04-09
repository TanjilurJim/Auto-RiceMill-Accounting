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
        Schema::table('working_orders', function (Blueprint $table) {
            $table->string('production_status')->default('not_started')->after('total_amount');
            $table->string('production_voucher_no')->nullable()->after('production_status');
        });
    }

    public function down(): void
    {
        Schema::table('working_orders', function (Blueprint $table) {
            $table->dropColumn(['production_status', 'production_voucher_no']);
        });
    }
};
