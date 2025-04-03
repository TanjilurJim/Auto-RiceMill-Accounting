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
        Schema::table('account_ledgers', function (Blueprint $table) {
            if (!Schema::hasColumn('account_ledgers', 'group_under_id')) {
                $table->foreignId('group_under_id')->nullable()->constrained('group_unders')->onDelete('set null');
            }
        });
    }


    public function down(): void
    {
        Schema::table('account_ledgers', function (Blueprint $table) {
            $table->dropForeign(['group_under_id']);
            $table->dropColumn('group_under_id');
        });
    }

    /**
     * Reverse the migrations.
     */
};
