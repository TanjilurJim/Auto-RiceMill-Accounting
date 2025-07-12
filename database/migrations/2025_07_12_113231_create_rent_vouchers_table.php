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
        Schema::create('rent_vouchers', function (Blueprint $t) {
            $t->id();
            $t->date('date');
            $t->string('vch_no', 50)->unique();
            $t->unsignedBigInteger('party_ledger_id');
            $t->decimal('grand_total', 16, 2)->default(0);
            $t->decimal('previous_balance', 16, 2)->default(0);
            $t->string('received_mode', 30)->nullable();   // cash / bank / contra…
            $t->decimal('received_amount', 16, 2)->default(0);
            $t->decimal('balance', 16, 2)->default(0);      // prev + grand_total – received
            $t->text('remarks')->nullable();
            $t->unsignedBigInteger('created_by');
            $t->timestamps();

            $t->foreign('party_ledger_id')->references('id')->on('account_ledgers')
                ->cascadeOnUpdate()->restrictOnDelete();
            $t->foreign('created_by')->references('id')->on('users')
                ->cascadeOnUpdate()->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rent_vouchers');
    }
};
