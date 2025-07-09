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
            $table->foreignId('party_item_id')
                ->nullable()          // set nullable so you can backfill row-by-row
                ->after('party_ledger_id')
                ->constrained('party_items');
            // optional: drop old item_id after data migration
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('party_job_stocks', function (Blueprint $table) {
            //
        });
    }
};
