<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stock_moves', function (Blueprint $table) {
            $table->string('ref_no')->nullable()->index()->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::table('stock_moves', function (Blueprint $table) {
            $table->dropColumn('ref_no');
        });
    }
};
