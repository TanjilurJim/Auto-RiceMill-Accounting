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
        Schema::create('party_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('party_ledger_id')->constrained('account_ledgers');
            $table->string('item_name');
            $table->foreignId('unit_id')->nullable()->constrained('units');
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();

            $table->unique(['party_ledger_id', 'item_name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('party_items');
    }
};
