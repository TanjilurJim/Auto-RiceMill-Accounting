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
        Schema::table('contra_adds', function (Blueprint $table) {
            $table->decimal('amount', 14, 2)->after('mode_to_id');
        });
    }

    public function down()
    {
        Schema::table('contra_adds', function (Blueprint $table) {
            $table->dropColumn('amount');
        });
    }
};
