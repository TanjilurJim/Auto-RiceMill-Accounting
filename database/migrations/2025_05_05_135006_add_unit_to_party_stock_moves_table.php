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
        Schema::table('party_stock_moves', function (Blueprint $table) {
            $table->unsignedBigInteger('unit_id')->nullable()->after('item_id');
            $table->string('unit_name')->nullable()->after('unit_id');
        });
    }

    public function down()
    {
        Schema::table('party_stock_moves', function (Blueprint $table) {
            $table->dropColumn(['unit_id', 'unit_name']);
        });
    }
};
