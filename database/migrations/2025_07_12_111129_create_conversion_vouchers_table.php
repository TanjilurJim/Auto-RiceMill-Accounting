<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversion_vouchers', function (Blueprint $table) {
            $table->id();

            $table->date('date');
            $table->string('ref_no', 50)->unique();

            // Foreign keys
            $table->unsignedBigInteger('party_ledger_id');
            $table->unsignedBigInteger('godown_id');
            $table->unsignedBigInteger('created_by');

            $table->text('remarks')->nullable();

            $table->decimal('total_consumed_qty', 16, 3)->default(0);
            $table->decimal('total_generated_qty', 16, 3)->default(0);

            $table->timestamps();

            /* --- Constraints --- */
            $table->foreign('party_ledger_id')
                  ->references('id')->on('account_ledgers')
                  ->cascadeOnUpdate()->restrictOnDelete();

            $table->foreign('godown_id')
                  ->references('id')->on('godowns')
                  ->cascadeOnUpdate()->restrictOnDelete();

            $table->foreign('created_by')
                  ->references('id')->on('users')
                  ->cascadeOnUpdate()->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversion_vouchers');
    }
};
