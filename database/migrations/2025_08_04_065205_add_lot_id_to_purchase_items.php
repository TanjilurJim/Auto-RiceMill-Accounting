<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {
    public function up(): void
    {
        if (!Schema::hasColumn('purchase_items', 'lot_id')) {
            Schema::table('purchase_items', function (Blueprint $table) {
                $table->unsignedBigInteger('lot_id')->nullable()->after('product_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasColumn('purchase_items', 'lot_id')) {
            Schema::table('purchase_items', function (Blueprint $table) {
                $table->dropColumn('lot_id');
            });
        }
    }
};
