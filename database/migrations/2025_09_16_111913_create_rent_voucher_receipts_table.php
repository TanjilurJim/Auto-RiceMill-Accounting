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
         Schema::create('rent_voucher_receipts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('rent_voucher_id')->constrained()->cascadeOnDelete();
            $t->foreignId('received_add_id')->constrained()->cascadeOnDelete();
            $t->decimal('amount', 14, 2);
            $t->timestamps();

            $t->unique(['rent_voucher_id', 'received_add_id']); // one allocation row per pair
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rent_voucher_receipts');
    }
};
