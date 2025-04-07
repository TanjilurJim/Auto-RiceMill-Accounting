<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('contra_adds', function (Blueprint $table) {
            $table->id();
            $table->string('voucher_no')->index(); // Not unique, since vouchers can have multiple details
            $table->date('date');
            $table->text('note')->nullable();
            $table->unsignedBigInteger('created_by');
            $table->timestamps();

            // If you want: Add foreign key to users table
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contra_adds');
    }
};
