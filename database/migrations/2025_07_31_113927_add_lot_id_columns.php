<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // 🔹 stocks
        Schema::table('stocks', function (Blueprint $t) {
            $t->unsignedBigInteger('lot_id')->nullable()->after('godown_id');
            $t->foreign('lot_id')->references('id')->on('lots');

            // new PK-combo uniqueness
            $t->unique(
                ['godown_id', 'item_id', 'lot_id', 'created_by'],
                'stocks_unique_lot'
            );
        });

        // 🔹 purchase_items
        Schema::table('purchase_items', function (Blueprint $t) {
            $t->unsignedBigInteger('lot_id')->nullable()->after('product_id');
            $t->foreign('lot_id')->references('id')->on('lots');
        });

        // 🔹 sale_items  (if table already exists)
        Schema::table('sale_items', function (Blueprint $t) {
            $t->unsignedBigInteger('lot_id')->nullable()->after('product_id');
            $t->foreign('lot_id')->references('id')->on('lots');
        });
    }

    public function down(): void
    {
        Schema::table('sale_items',   fn(Blueprint $t) => $t->dropColumn('lot_id'));
        Schema::table('purchase_items', fn(Blueprint $t) => $t->dropColumn('lot_id'));
        Schema::table('stocks', function (Blueprint $t) {
            $t->dropUnique('stocks_unique_lot');
            $t->dropColumn('lot_id');
        });
    }
};
