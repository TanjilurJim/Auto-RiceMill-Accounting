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
        Schema::table('salary_receives', function (Blueprint $table) {
            //
            if (!Schema::hasColumn('salary_receives', 'is_advance')) {
                $table->boolean('is_advance')->default(false)->after('salary_slip_employee_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('salary_receives', function (Blueprint $table) {
            //
        });
    }
};
