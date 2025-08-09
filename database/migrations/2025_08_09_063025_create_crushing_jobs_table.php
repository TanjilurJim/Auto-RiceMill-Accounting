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
        Schema::create('crushing_jobs', function (Blueprint $t) {
            $t->id();
            $t->string('ref_no')->index();                // can reuse your page ref
            $t->date('date');
            $t->enum('owner', ['company','party']);
            $t->foreignId('party_ledger_id')->nullable()->constrained('account_ledgers')->nullOnDelete();
            $t->foreignId('godown_id')->constrained()->cascadeOnDelete();
            $t->foreignId('dryer_id')->constrained()->cascadeOnDelete();

            $t->enum('status', ['running','stopped'])->default('running');
            $t->timestamp('started_at')->nullable();
            $t->timestamp('stopped_at')->nullable();

            // snapshot for utilization
            $t->decimal('dryer_capacity', 12, 3)->nullable(); // from Dryer::capacity at start
            $t->decimal('total_loaded_qty', 14, 3)->default(0); // sum of lines; keep updated

            $t->string('remarks', 500)->nullable();
            $t->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $t->timestamps();

            $t->index(['created_by','status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crushing_jobs');
    }
};
