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
            $table->decimal('paid_amount', 12, 2)->default(0); // 👈 Removed "after"
        });
    }

    public function down()
    {
        Schema::table('salary_slip_employees', function (Blueprint $table) {
            $table->dropColumn('paid_amount');
        });
    }
};
