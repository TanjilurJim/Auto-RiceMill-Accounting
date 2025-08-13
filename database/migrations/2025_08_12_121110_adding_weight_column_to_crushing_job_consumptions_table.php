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
        Schema::table('crushing_job_consumptions', function (Blueprint $table) {
            //
            $table->decimal('weight', 12, 3)->nullable();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('crushing_job_consumptions', function (Blueprint $table) {
            //
        });
    }
};
