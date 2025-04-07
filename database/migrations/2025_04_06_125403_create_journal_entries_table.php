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
        Schema::create('journal_entries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('journal_id');
            $table->unsignedBigInteger('account_ledger_id');
            $table->enum('type', ['debit', 'credit']);
            $table->decimal('amount', 14, 2);
            $table->string('note')->nullable();
            $table->timestamps();

            $table->foreign('journal_id')->references('id')->on('journals')->onDelete('cascade');
            $table->foreign('account_ledger_id')->references('id')->on('account_ledgers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('journal_entries');
    }
};
