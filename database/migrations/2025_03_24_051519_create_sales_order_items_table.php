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
        Schema::create('sales_order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sales_order_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_id')->constrained('items')->onDelete('cascade'); // <- important fix
            $table->decimal('quantity', 10, 2);
            $table->foreignId('unit_id')->constrained()->onDelete('cascade');
            $table->decimal('rate', 10, 2);
            $table->string('discount_type')->nullable(); // 'percentage' or 'flat'
            $table->decimal('discount_value', 10, 2)->default(0);
            $table->decimal('subtotal', 15, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_order_items');
    }
};
