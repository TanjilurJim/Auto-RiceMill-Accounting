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
        Schema::create('payment_adds', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('voucher_no')->unique();
            $table->unsignedBigInteger('payment_mode_id');
            $table->unsignedBigInteger('account_ledger_id');
            $table->decimal('amount', 15, 2);
            $table->text('description')->nullable();
            $table->boolean('send_sms')->default(false);
            $table->unsignedBigInteger('created_by')->nullable(); // to track user if needed
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_adds');
    }
};
