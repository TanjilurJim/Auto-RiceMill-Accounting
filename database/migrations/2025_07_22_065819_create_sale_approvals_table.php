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
        Schema::create('sale_approvals', function (Blueprint $t) {
            $t->id();
            $t->foreignId('sale_id')->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $t->enum('action', ['approved', 'rejected']);
            $t->text('note')->nullable();
            $t->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('sale_approvals');
    }
};
