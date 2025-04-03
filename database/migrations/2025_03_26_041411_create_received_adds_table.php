<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateReceivedAddsTable extends Migration
{
    public function up()
    {
        Schema::create('received_adds', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('voucher_no')->unique();
            $table->foreignId('received_mode_id')->constrained()->onDelete('cascade');
            $table->foreignId('account_ledger_id')->constrained()->onDelete('cascade');
            $table->decimal('amount', 12, 2);
            $table->text('description')->nullable();
            $table->boolean('send_sms')->default(false);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('received_adds');
    }
}

