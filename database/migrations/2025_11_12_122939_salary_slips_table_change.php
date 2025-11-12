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
        Schema::table('salary_slips', function (Blueprint $table) {
            $table->unsignedBigInteger('financial_year_id')->nullable()->after('id');
            $table->foreign('financial_year_id')->references('id')->on('financial_years')->onDelete('restrict');
            $table->index('financial_year_id');
        });
    }

    public function down()
    {
        Schema::table('salary_slips', function (Blueprint $table) {
            $table->dropForeign(['financial_year_id']);
            $table->dropIndex(['financial_year_id']);
            $table->dropColumn('financial_year_id');
        });
    }
};
