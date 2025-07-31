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
        Schema::create('khamals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('godown_id');
            $table->string('khamal_no', 40);          // “1”, “2”, “A-1”…
            $table->decimal('capacity_ton', 8, 2)->nullable();
            $table->unsignedBigInteger('created_by');
            $table->softDeletes();
            $table->timestamps();

            $table->unique(['godown_id', 'khamal_no']);          // no duplicate nos inside same godown
            $table->foreign('godown_id')->references('id')->on('godowns')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('khamals');
    }
};
