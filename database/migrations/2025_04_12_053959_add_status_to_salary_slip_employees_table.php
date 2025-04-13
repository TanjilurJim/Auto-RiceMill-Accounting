<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('salary_slip_employees', function (Blueprint $table) {
            $table->string('status')->default('Unpaid')->after('paid_amount'); // Logical position
        });
    }

    public function down()
    {
        Schema::table('salary_slip_employees', function (Blueprint $table) {
            $table->dropColumn('status');
        });
    }
};
