<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('payment_adds', function (Blueprint $table) {
            $table->unsignedBigInteger('payment_mode_id')->change(); // make sure it's unsigned
            $table->foreign('payment_mode_id')
                ->references('id')
                ->on('received_modes')
                ->onDelete('restrict'); // prevent deleting a mode that's in use
        });
    }

    public function down(): void
    {
        Schema::table('payment_adds', function (Blueprint $table) {
            $table->dropForeign(['payment_mode_id']);
        });
    }
};
