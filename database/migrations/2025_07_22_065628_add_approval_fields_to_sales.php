<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('sales', function (Blueprint $t) {
            $t->enum('status', [
                'draft',          // form not submitted yet
                'pending_sub',    // waiting for sub-approval
                'pending_resp',   // waiting for final approval
                'approved',       // stock & books posted
                'rejected',
            ])->default('draft');

            $t->foreignId('sub_responsible_id')->nullable()
                ->constrained('users')->nullOnDelete();
            $t->foreignId('responsible_id')->nullable()
                ->constrained('users')->nullOnDelete();

            $t->timestamp('approved_at')->nullable()->index();
        });
    }

    public function down()
    {
        Schema::table('sales', function (Blueprint $t) {
            $t->dropColumn([
                'status',
                'sub_responsible_id',
                'responsible_id',
                'approved_at',
            ]);
        });
    }
    /**
     * Reverse the migrations.
     */
    
};
