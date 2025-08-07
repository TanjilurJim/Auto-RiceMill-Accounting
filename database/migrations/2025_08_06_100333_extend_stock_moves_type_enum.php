<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
         DB::statement(
            "ALTER TABLE stock_moves
             MODIFY COLUMN type ENUM(
                 'in',            -- generic IN  (keep for backward compat)
                 'out',           -- generic OUT
                 'adjust',        -- manual adjust
                 'purchase',      -- 👈 new
                 'transfer_in',   -- optional
                 'transfer_out',  -- optional
                 'opening'        -- optional
             ) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL"
        );
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement(
            "ALTER TABLE stock_moves
             MODIFY COLUMN type ENUM('in','out','adjust')
             CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL"
        );
    }
};
