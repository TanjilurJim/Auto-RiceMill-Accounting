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
        Schema::table('contra_adds', function (Blueprint $table) {
            //
            $table->unsignedBigInteger('mode_from_id')->after('voucher_no');
            $table->unsignedBigInteger('mode_to_id')->after('mode_from_id');

            $table->foreign('mode_from_id')->references('id')->on('received_modes')->onDelete('cascade');
            $table->foreign('mode_to_id')->references('id')->on('received_modes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contra_adds', function (Blueprint $table) {
            //
            $table->dropForeign(['mode_from_id']);
            $table->dropForeign(['mode_to_id']);
            $table->dropColumn(['mode_from_id', 'mode_to_id']);
        });
    }
};
