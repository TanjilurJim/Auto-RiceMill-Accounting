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
        Schema::create('received_modes', function (Blueprint $table) {
            $table->id();
            $table->string('mode_name');
            $table->decimal('opening_balance', 15, 2)->nullable()->default(0);
            $table->decimal('closing_balance', 15, 2)->nullable()->default(0);
            $table->string('phone_number',20)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('received_modes');
    }
};
