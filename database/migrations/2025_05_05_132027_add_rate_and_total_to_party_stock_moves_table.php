<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('party_stock_moves', function (Blueprint $table) {
            $table->decimal('rate', 12, 2)->nullable()->after('qty');
            $table->decimal('total', 14, 2)->nullable()->after('rate');
        });
    }

    public function down(): void {
        Schema::table('party_stock_moves', function (Blueprint $table) {
            $table->dropColumn(['rate', 'total']);
        });
    }
};
