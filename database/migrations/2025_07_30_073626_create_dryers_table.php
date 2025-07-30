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
        Schema::create('dryers', function (Blueprint $table) {
            $table->id();
            $table->string('dryer_name', 120);
            $table->string('dryer_type', 60)->nullable();
            $table->decimal('capacity', 8,2);
            $table->unsignedSmallInteger('batch_time')->nullable();
            $table->string('manufacturer', 100)->nullable();
            $table->string('model_number', 80)->nullable();
            $table->decimal('power_kw', 8,2)->nullable();
            $table->string('fuel_type', 40)->nullable();
            $table->unsignedInteger('length_mm')->nullable();
            $table->unsignedInteger('width_mm')->nullable();
            $table->unsignedInteger('height_mm')->nullable();

            // multi-tenant bookkeeping
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('updated_by')->nullable();

            $table->unique(['dryer_name', 'created_by']);
            $table->foreign('created_by')->references('id')->on('users');
            $table->foreign('updated_by')->references('id')->on('users');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dryers');
    }
};
