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
        Schema::create('lots', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('godown_id');
            $table->unsignedBigInteger('item_id');
            $table->string('lot_no');
            $table->date('received_at')->nullable();
            $table->unsignedBigInteger('created_by');
            
            $table->timestamps();
            $table->unique(['godown_id','item_id','lot_no']);   // no dup lots
            $table->foreign('godown_id')->references('id')->on('godowns');
            $table->foreign('item_id')->references('id')->on('items');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lots');
    }
};
