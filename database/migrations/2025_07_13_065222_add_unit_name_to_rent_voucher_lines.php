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
        Schema::table('rent_voucher_lines', function (Blueprint $table) {
            $table->string('unit_name', 50)->after('party_item_id');
        });
    }
    public function down()
    {
        Schema::table('rent_voucher_lines', function (Blueprint $table) {
            $table->dropColumn('unit_name');
        });
    }
};
