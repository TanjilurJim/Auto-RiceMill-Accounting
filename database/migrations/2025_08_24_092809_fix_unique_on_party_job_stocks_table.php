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
        Schema::table('party_job_stocks', function (Blueprint $table) {
            // drop old unique if it exists
            try {
                $table->dropUnique('unique_party_stock'); // name from your schema
            } catch (\Throwable $e) {}

            // add a better uniqueness that matches the app logic
            
            $table->unique(['party_ledger_id', 'godown_id', 'created_by'  ], 'unique_party_item_godown_creator');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('party_job_stocks', function (Blueprint $table) {
            // revert to the old one if needed
            try {
                $table->dropUnique('unique_party_item_godown_creator');
            } catch (\Throwable $e) {}

            $table->unique(['party_ledger_id', 'item_id', 'godown_id'], 'unique_party_stock');
        });
    }
};
