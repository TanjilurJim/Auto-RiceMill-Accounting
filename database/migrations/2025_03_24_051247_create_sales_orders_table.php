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
        Schema::create('sales_orders', function (Blueprint $table) {
            $table->id();
            $table->string('voucher_no')->unique();
            $table->date('date');
            $table->foreignId('account_ledger_id')->constrained('account_ledgers')->onDelete('cascade');
            $table->foreignId('salesman_id')->nullable()->constrained()->onDelete('set null');
            $table->text('shipping_details')->nullable();
            $table->string('delivered_to')->nullable();
            $table->decimal('total_qty', 10, 2)->default(0);
            $table->decimal('total_amount', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales_orders');
    }
};
