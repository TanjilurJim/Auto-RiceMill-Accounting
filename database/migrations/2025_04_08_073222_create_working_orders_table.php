<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateWorkingOrdersTable extends Migration
{
    public function up()
    {
        Schema::create('working_orders', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('voucher_no');
            $table->string('reference_no');
            $table->foreignId('product_id')->constrained('items')->onDelete('cascade');
            $table->foreignId('godown_id')->constrained('godowns')->onDelete('cascade');
            $table->decimal('quantity', 15, 2)->default(0);
            $table->decimal('purchase_price', 15, 2)->default(0);
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('total_price', 15, 2)->default(0);
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
            $table->softDeletes(); // For soft deletes
        });
    }

    public function down()
    {
        Schema::dropIfExists('working_orders');
    }
}
