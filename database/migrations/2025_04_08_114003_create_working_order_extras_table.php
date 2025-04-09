<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('working_order_extras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('working_order_id')
                  ->constrained('working_orders')
                  ->onDelete('cascade');

            $table->string('title');
            $table->decimal('quantity', 15, 2)->nullable();
            $table->decimal('price',     15, 2)->nullable();
            $table->decimal('total',     15, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('working_order_extras');
    }
};
