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
        Schema::create('salary_structures', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g., "Manager Grade A"
            $table->decimal('basic_salary', 10, 2);
            $table->decimal('house_rent', 10, 2)->default(0);
            $table->decimal('medical', 10, 2)->default(0);
            $table->decimal('transport', 10, 2)->default(0);
            $table->decimal('bonus', 10, 2)->default(0);
            $table->decimal('tax', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('salary_strctures');
    }
};
