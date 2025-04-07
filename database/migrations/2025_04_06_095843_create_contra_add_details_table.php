<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('contra_add_details', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contra_add_id')->constrained('contra_adds')->onDelete('cascade');
            $table->foreignId('account_ledger_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['Dr', 'Cr']);
            $table->decimal('amount', 15, 2);
            $table->string('note')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contra_add_details');
    }
};