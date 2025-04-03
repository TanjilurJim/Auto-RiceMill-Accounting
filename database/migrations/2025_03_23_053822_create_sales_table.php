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
        Schema::create('sales', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('voucher_no')->unique()->nullable();
            $table->foreignId('godown_id')->constrained()->onDelete('cascade');
            $table->foreignId('salesman_id')->constrained()->onDelete('cascade');
            $table->foreignId('account_ledger_id')->constrained()->onDelete('cascade');
            $table->string('phone')->nullable();
            $table->string('address')->nullable();
        
            $table->decimal('total_qty', 15, 2)->default(0);
            $table->decimal('total_discount', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2)->default(0);
            
            // placeholders
            $table->foreignId('other_expense_ledger_id')->nullable()->constrained('account_ledgers')->onDelete('cascade');
            $table->decimal('other_amount', 15, 2)->default(0);
            $table->text('shipping_details')->nullable();
            $table->text('delivered_to')->nullable();
        
            // truck fields
            $table->decimal('truck_rent', 15, 2)->nullable();
            $table->decimal('rent_advance', 15, 2)->nullable();
            $table->decimal('net_rent', 15, 2)->nullable();
            $table->string('truck_driver_name')->nullable();
            $table->string('driver_address')->nullable();
            $table->string('driver_mobile')->nullable();
        
            // financial placeholders
            $table->string('receive_mode')->nullable();
            $table->decimal('receive_amount', 15, 2)->nullable();
            $table->decimal('total_due', 15, 2)->nullable();
            $table->decimal('closing_balance', 15, 2)->nullable();
        
            $table->unsignedBigInteger('created_by');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sales');
    }
};
