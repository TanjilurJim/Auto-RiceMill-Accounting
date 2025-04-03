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
        Schema::create('purchase_returns', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('return_voucher_no')->unique();
            $table->foreignId('godown_id')->constrained()->onDelete('cascade');
            $table->foreignId('account_ledger_id')->constrained()->onDelete('cascade');
            $table->text('reason')->nullable();
            $table->decimal('total_qty', 15, 2);
            $table->decimal('grand_total', 15, 2);
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
        Schema::dropIfExists('purchase_returns');
    }
};
