<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('conversion_lines', function (Blueprint $table) {
            $table->id();

            // FK to voucher header
            $table->unsignedBigInteger('voucher_id');

            // FK to party_items
            $table->unsignedBigInteger('party_item_id');

            $table->enum('line_type', ['consumed', 'generated']);

            $table->decimal('qty', 16, 3);
            $table->string('unit_name', 30)->nullable();

            $table->timestamps();

            /* --- Constraints --- */
            $table->foreign('voucher_id')
                  ->references('id')->on('conversion_vouchers')
                  ->cascadeOnUpdate()->cascadeOnDelete();

            $table->foreign('party_item_id')
                  ->references('id')->on('party_items')
                  ->cascadeOnUpdate()->restrictOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('conversion_lines');
    }
};
