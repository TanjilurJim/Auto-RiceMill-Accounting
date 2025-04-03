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
        Schema::table('sales_returns', function (Blueprint $table) {
            //
            $table->foreignId('godown_id')->constrained('godowns')->onDelete('cascade');
            $table->foreignId('salesman_id')->constrained('salesmen')->onDelete('cascade');
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('sales_returns', function (Blueprint $table) {
            //
            $table->dropColumn(['godown_id', 'salesman_id', 'phone', 'address']);
        });
    }
};
