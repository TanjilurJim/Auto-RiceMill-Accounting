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
        Schema::table('party_stock_moves', function (Blueprint $table) {
            $table->json('meta')->nullable()->after('remarks');
        });
        Schema::table('stock_moves', function (Blueprint $table) {
            $table->json('meta')->nullable()->after('reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('party_stock_moves', function (Blueprint $table) {
            $table->dropColumn('meta');
        });
        Schema::table('stock_moves', function (Blueprint $table) {
            $table->dropColumn('meta');
        });
    }
};
