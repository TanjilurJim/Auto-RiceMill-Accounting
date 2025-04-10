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
        //
        Schema::table('salary_slips', function (Blueprint $table) {
            $table->unsignedTinyInteger('month')->after('date'); // 1-12
            $table->year('year')->after('month');
            $table->boolean('is_posted_to_accounts')->default(false)->after('year');
            $table->text('note')->nullable()->after('is_posted_to_accounts');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
