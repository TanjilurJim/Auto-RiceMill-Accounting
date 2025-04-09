<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('working_orders', function (Blueprint $table) {
            $table->id();

            // ——— multitenancy ———
            $table->unsignedBigInteger('tenant_id');

            // ——— order metadata ———
            $table->date('date');
            $table->string('voucher_no');            // auto‑generated, per tenant
            $table->string('reference_no')->nullable();
            $table->decimal('total_amount', 15, 2)->default(0);

            // ——— audit ———
            $table->foreignId('created_by')
                  ->constrained('users')
                  ->onDelete('cascade');

            $table->timestamps();
            $table->softDeletes();

            // ——— indexes ———
            $table->unique(['tenant_id', 'voucher_no']);   // guarantees uniqueness
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('working_orders');
    }
};
