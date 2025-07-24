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
        Schema::table('purchases', function (Blueprint $table) {
            //
            $table->string('status', 20)->default('draft');          // draft|pending_sub|pending_resp|approved|rejected

            // who *should* sign
            $table->foreignId('sub_responsible_id')->nullable()->constrained('users');
            $table->foreignId('responsible_id')->nullable()->constrained('users');

            // who actually acted + when
            $table->timestamp('sub_approved_at')->nullable();
            $table->foreignId('sub_approved_by')->nullable()->constrained('users');

            $table->timestamp('approved_at')->nullable();
            $table->foreignId('approved_by')->nullable()->constrained('users');

            $table->timestamp('rejected_at')->nullable();
            $table->foreignId('rejected_by')->nullable()->constrained('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            //
        });
    }
};
