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
        Schema::create('stock_moves', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('godown_id');
            $table->unsignedBigInteger('lot_id')->nullable();
            $table->unsignedBigInteger('item_id');
            $table->enum('type',['in','out','adjust']);   
            $table->decimal('qty', 14,3);
            $table->decimal('unit_cost', 14, 2)->nullable();      // optional
            $table->string('reason', 120)->nullable();            // write-off, count-adj, etc.
            $table->unsignedBigInteger('created_by');
            $table->timestamps();

            $table->foreign('godown_id')->references('id')->on('godowns');
            $table->foreign('item_id')->references('id')->on('items');
            $table->foreign('lot_id')->references('id')->on('lots');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stock_moves');
    }
};
