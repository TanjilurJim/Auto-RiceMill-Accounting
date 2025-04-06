<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payment_adds', function (Blueprint $table) {
            $table->dropUnique('payment_adds_voucher_no_unique'); // Drop the unique constraint
            $table->index('voucher_no'); // Add a normal index
        });
    }

    public function down(): void
    {
        Schema::table('payment_adds', function (Blueprint $table) {
            $table->dropIndex(['voucher_no']); // Drop the index
            $table->unique('voucher_no'); // Restore the unique constraint
        });
    }
};
