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
        //
        Schema::table('stock_moves', function (Blueprint $table){
            $table->decimal('weight', 12,3
            )->nullable()->after('qty');
        });

        Schema::table('party_stock_moves', function (Blueprint $table) {
            $table->decimal('weight', 12, 3)->nullable()->after('qty'); // total kg for this move
        });

        Schema::table('lots', function (Blueprint $table) {
            $table->decimal('unit_weight', 12, 3)->nullable()->after('lot_no'); // per-unit kg (e.g., per bosta)
        });

        Schema::table('conversion_lines', function (Blueprint $table) {
            $table->decimal('weight', 12, 3)->nullable()->after('qty'); // total kg for this line
        });


    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('stock_moves', function (Blueprint $table) {
            $table->dropColumn('weight');
        });
        Schema::table('party_stock_moves', function (Blueprint $table) {
            $table->dropColumn('weight');
        });
        Schema::table('lots', function (Blueprint $table) {
            $table->dropColumn('unit_weight');
        });
        Schema::table('conversion_lines', function (Blueprint $table) {
            $table->dropColumn('weight');
        });
    }
};
