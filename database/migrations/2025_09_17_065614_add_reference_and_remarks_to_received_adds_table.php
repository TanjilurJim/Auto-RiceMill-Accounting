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
            // After 'amount' is a good spot; adjust to your schema
            if (!Schema::hasColumn('received_adds', 'reference')) {
                $table->string('reference', 100)->nullable()->after('amount');
            }
            if (!Schema::hasColumn('received_adds', 'remarks')) {
                $table->text('remarks')->nullable()->after('reference');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('received_adds', function (Blueprint $table) {
            //
        });
    }
};
