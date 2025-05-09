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
        Schema::table('received_adds', function (Blueprint $table) {
            $table->foreignId('created_by')->nullable()->after('send_sms')->constrained('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('received_adds', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropColumn('created_by');
        });
    }
};
