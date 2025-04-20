<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->foreignId('cogs_ledger_id')->nullable()->after('inventory_ledger_id')->constrained('account_ledgers');
        });

        Schema::table('sales_returns', function (Blueprint $table) {
            $table->foreignId('cogs_ledger_id')->nullable()->after('inventory_ledger_id')->constrained('account_ledgers');
        });
    }

    public function down(): void
    {
        Schema::table('sales', function (Blueprint $table) {
            $table->dropForeign(['cogs_ledger_id']);
            $table->dropColumn('cogs_ledger_id');
        });

        Schema::table('sales_returns', function (Blueprint $table) {
            $table->dropForeign(['cogs_ledger_id']);
            $table->dropColumn('cogs_ledger_id');
        });
    }
};
