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
        Schema::table('salary_receives', function (Blueprint $table) {
            $table->foreignId('salary_slip_employee_id')->nullable()->constrained('salary_slip_employees')->nullOnDelete()->after('employee_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('salary_receives', function (Blueprint $table) {
            //
        });
    }
};
