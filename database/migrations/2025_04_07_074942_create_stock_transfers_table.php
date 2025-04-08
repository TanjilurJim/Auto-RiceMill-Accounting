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
        Schema::create('stock_transfers', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('voucher_no')->unique();
            $table->string('reference_no')->nullable();
            $table->foreignId('from_godown_id')->constrained('godowns');
            $table->foreignId('to_godown_id')->constrained('godowns');
            $table->decimal('total_quantity', 15, 2);
            $table->decimal('total_amount', 15, 2);
            $table->text('note')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_transfers');
    }
};
