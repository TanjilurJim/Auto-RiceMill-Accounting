<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('conversion_headers', function (Blueprint $t) {
            $t->id();
            $t->string('ref_no', 50)->unique();
            $t->enum('owner', ['company', 'party']);
            $t->date('date')->nullable();              // optional; we can mirror form date
            $t->foreignId('godown_id')->constrained()->cascadeOnUpdate();
            $t->foreignId('party_ledger_id')->nullable()->constrained('account_ledgers')->nullOnDelete();
            $t->string('remarks', 500)->nullable();
            $t->json('costing_json')->nullable();      // overheads + per-line sale_value/proc_cost
            $t->foreignId('created_by')->constrained('users')->cascadeOnUpdate();
            $t->timestamps();
        });
    }
    public function down(): void
    {
        Schema::dropIfExists('conversion_headers');
    }
};
