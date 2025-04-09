<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSalarySlipEmployeesTable extends Migration
{
    public function up()
    {
        Schema::create('salary_slip_employees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('salary_slip_id')->constrained('salary_slips')->onDelete('cascade');
            $table->foreignId('employee_id')->constrained('employees')->onDelete('cascade');
            $table->decimal('basic_salary', 15, 2);
            $table->decimal('additional_amount', 15, 2);
            $table->decimal('total_amount', 15, 2);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('salary_slip_employees');
    }
}
