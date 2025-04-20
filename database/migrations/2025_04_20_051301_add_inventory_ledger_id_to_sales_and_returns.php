<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->unsignedBigInteger('inventory_ledger_id')->nullable()->after('account_ledger_id');
        });

        Schema::table('sales_returns', function (Blueprint $table) {
            $table->unsignedBigInteger('inventory_ledger_id')->nullable()->after('account_ledger_id');
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropColumn('inventory_ledger_id');
        });

        Schema::table('sales_returns', function (Blueprint $table) {
            $table->dropColumn('inventory_ledger_id');
        });
    }
};

