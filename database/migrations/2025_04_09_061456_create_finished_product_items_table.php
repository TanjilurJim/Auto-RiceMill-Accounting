<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('finished_product_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('finished_product_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained('items');
            $table->foreignId('godown_id')->constrained();
            $table->decimal('quantity', 15, 2);
            $table->decimal('unit_price', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('finished_product_items');
    }
};