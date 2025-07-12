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
        Schema::create('rent_voucher_lines', function (Blueprint $t) {
            $t->id();
            $t->unsignedBigInteger('voucher_id');
            $t->unsignedBigInteger('party_item_id');
            $t->decimal('qty', 16, 3);
            $t->decimal('mon', 16, 3)->nullable();   // local weight measure
            $t->decimal('rate', 16, 2);
            $t->decimal('amount', 16, 2);
            $t->timestamps();

            $t->foreign('voucher_id')->references('id')->on('rent_vouchers')
                ->cascadeOnUpdate()->cascadeOnDelete();
            $t->foreign('party_item_id')->references('id')->on('party_items')
                ->cascadeOnUpdate()->restrictOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rent_voucher_lines');
    }
};
