<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('party_job_stocks', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('party_ledger_id');
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('godown_id');
            $table->decimal('qty', 12, 3)->default(0);
            $table->unsignedBigInteger('created_by')->nullable(); // ← optional for audit
            $table->timestamps();

            $table->unique(['party_ledger_id', 'item_id', 'godown_id'], 'unique_party_stock');
        });

        Schema::create('party_stock_moves', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->unsignedBigInteger('party_ledger_id');
            $table->unsignedBigInteger('item_id');
            $table->unsignedBigInteger('godown_id_from')->nullable();
            $table->unsignedBigInteger('godown_id_to')->nullable();
            $table->decimal('qty', 12, 3);
            $table->enum('move_type', ['deposit', 'withdraw', 'transfer']);
            $table->string('ref_no')->nullable();
            $table->text('remarks')->nullable();
            $table->unsignedBigInteger('created_by')->nullable(); // ← required for filter/scopes
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('party_stock_moves');
        Schema::dropIfExists('party_job_stocks');
    }
};