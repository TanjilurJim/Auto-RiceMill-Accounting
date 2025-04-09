<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('working_order_items', function (Blueprint $table) {
            $table->id();

            // ——— FK to header ———
            $table->foreignId('working_order_id')
                  ->constrained('working_orders')
                  ->onDelete('cascade');             // delete items when header is deleted

            // ——— line‑item data ———
            $table->foreignId('product_id')
                  ->constrained('items');
            $table->foreignId('godown_id')
                  ->constrained('godowns');

            $table->decimal('quantity',       15, 2);
            $table->decimal('purchase_price', 15, 2);
            $table->decimal('subtotal',       15, 2);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('working_order_items');
    }
};
