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
        Schema::create('crushing_job_consumptions', function (Blueprint $t) {
            $t->id();
            $t->foreignId('crushing_job_id')->constrained()->cascadeOnDelete();

            // either company or party source
            $t->enum('source', ['company','party']);

            // company-side
            $t->foreignId('item_id')->nullable()->constrained('items')->nullOnDelete();
            $t->foreignId('lot_id')->nullable()->constrained('lots')->nullOnDelete();

            // party-side
            $t->foreignId('party_item_id')->nullable()->constrained('party_items')->nullOnDelete();

            $t->decimal('qty', 14, 3);
            $t->string('unit_name', 50)->nullable();

            $t->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $t->timestamps();

            $t->index(['crushing_job_id','source']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('crushing_job_consumptions');
    }
};
