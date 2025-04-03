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
        //
        Schema::create('sales_returns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sale_id')->constrained('sales')->onDelete('cascade'); // link to Sale
            $table->foreignId('account_ledger_id')->constrained('account_ledgers')->onDelete('cascade');
            $table->string('voucher_no')->nullable();
            $table->date('return_date');
            $table->decimal('total_qty', 15, 2)->default(0);
            $table->decimal('total_return_amount', 15, 2)->default(0);
            $table->text('reason')->nullable();
            $table->unsignedBigInteger('created_by');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //  
        Schema::dropIfExists('sales_returns');
    }
};
