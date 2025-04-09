<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmployeesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('employees', function (Blueprint $table) {
            $table->id();  // Primary Key (Auto Increment)
            $table->string('name');  // Employee name
            $table->string('mobile');  // Mobile number
            $table->string('email')->unique();  // Email address
            $table->string('nid')->unique();  // National ID
            $table->string('present_address');  // Present address
            $table->string('permanent_address');  // Permanent address
            $table->decimal('salary', 10, 2);  // Salary (up to 10 digits, 2 decimal points)
            $table->date('joining_date');  // Joining date
            $table->foreignId('reference_by')->nullable()->constrained('employees')->onDelete('set null');  // Employee who referred (nullable)

            // Foreign keys for department, designation, and shift
            $table->foreignId('department_id')->constrained('departments')->onDelete('cascade');  // Foreign key to departments table
            $table->foreignId('designation_id')->constrained('designations')->onDelete('cascade');  // Foreign key to designations table
            $table->foreignId('shift_id')->constrained('shifts')->onDelete('cascade');  // Foreign key to shifts table

            // Status (Active/Inactive)
            $table->enum('status', ['Active', 'Inactive']);

            // Advance amount (nullable)
            $table->decimal('advance_amount', 10, 2)->nullable();  

            // Created by user (referring to users table)
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');  // Assuming user created the Employee

            $table->timestamps();  // Created_at and updated_at timestamps
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('employees');
    }
}
