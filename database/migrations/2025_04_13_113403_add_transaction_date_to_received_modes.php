<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTransactionDateToReceivedModes extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('received_modes', function (Blueprint $table) {
            // Add transaction_date column to track the date of the actual transaction
            $table->timestamp('transaction_date')->nullable();  // Nullable as it might not always be available
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('received_modes', function (Blueprint $table) {
            // Drop the transaction_date column
            $table->dropColumn('transaction_date');
        });
    }
}
