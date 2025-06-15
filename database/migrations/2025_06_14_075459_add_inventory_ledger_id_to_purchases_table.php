<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            // make it nullable so old rows still work
            $table->unsignedBigInteger('inventory_ledger_id')->nullable()->after('account_ledger_id');

            // FK (optional but recommended)
            $table
                ->foreign('inventory_ledger_id')
                ->references('id')
                ->on('account_ledgers')
                ->cascadeOnUpdate()
                ->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropForeign(['inventory_ledger_id']);
            $table->dropColumn('inventory_ledger_id');
        });
    }
};