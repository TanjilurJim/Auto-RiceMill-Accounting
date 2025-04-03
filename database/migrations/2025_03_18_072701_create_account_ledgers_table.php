<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('account_ledgers', function (Blueprint $table) {
            $table->id();
            $table->string('account_ledger_name');
            $table->string('phone_number');
            $table->string('email')->nullable();
            $table->decimal('opening_balance', 15, 2)->default(0);
            $table->enum('debit_credit', ['debit', 'credit']);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->foreignId('account_group_id')->constrained('account_groups')->onDelete('cascade');
            $table->text('address')->nullable();
            $table->boolean('for_transition_mode')->default(false);
            $table->boolean('mark_for_user')->default(false);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('account_ledgers');
    }
};
