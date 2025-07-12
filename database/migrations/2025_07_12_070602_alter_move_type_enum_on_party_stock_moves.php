<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Note: Laravel doesn't have native ENUM modification, so use raw
        DB::statement("ALTER TABLE party_stock_moves 
            MODIFY move_type ENUM('deposit','withdraw','transfer','convert-in','convert-out') 
            DEFAULT NULL");
    }

    public function down()
    {
        DB::statement("ALTER TABLE party_stock_moves 
            MODIFY move_type ENUM('deposit','withdraw','transfer') 
            DEFAULT NULL");
    }
};
