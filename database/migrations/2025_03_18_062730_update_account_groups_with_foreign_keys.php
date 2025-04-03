<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('account_groups', function (Blueprint $table) {
            // Drop old enum nature if exists
            if (Schema::hasColumn('account_groups', 'nature')) {
                $table->dropColumn('nature');
            }

            // Drop old group_under_id if it was pointing to account_groups
            if (Schema::hasColumn('account_groups', 'group_under_id')) {
                $table->dropForeign(['group_under_id']);
                $table->dropColumn('group_under_id');
            }

            // Add new foreign keys
            $table->foreignId('nature_id')->nullable()->constrained('natures')->onDelete('set null');
            $table->foreignId('group_under_id')->nullable()->constrained('group_unders')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('account_groups', function (Blueprint $table) {
            $table->dropForeign(['nature_id']);
            $table->dropForeign(['group_under_id']);
            $table->dropColumn('nature_id');
            $table->dropColumn('group_under_id');

            $table->enum('nature', ['Assets', 'Liabilities', 'Income', 'Expenses'])->nullable();
            $table->foreignId('group_under_id')->nullable()->constrained('account_groups')->onDelete('set null');
        });
    }
};
