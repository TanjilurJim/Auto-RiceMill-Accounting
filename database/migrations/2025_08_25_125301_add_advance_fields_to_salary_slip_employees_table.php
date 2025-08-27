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
        Schema::table('salary_slip_employees', function (Blueprint $table) {
            //
            if (!Schema::hasColumn('salary_slip_employees', 'advance_adjusted')) {
                $table->decimal('advance_adjusted', 12, 2)->default(0)->after('additional_amount');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('salary_slip_employees', function (Blueprint $table) {
            //
        });
    }
};
