<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('account_ledgers', function (Blueprint $table) {
            try { $table->index(['ledger_type','created_by'], 'al_type_created_idx'); } catch (\Throwable $e) {}
            try { $table->index(['group_under_id','created_by'], 'al_group_created_idx'); } catch (\Throwable $e) {}
        });
    }

    public function down(): void
    {
        Schema::table('account_ledgers', function (Blueprint $table) {
            foreach (['al_type_created_idx','al_group_created_idx'] as $idx) {
                try { $table->dropIndex($idx); } catch (\Throwable $e) {}
            }
        });
    }
};
