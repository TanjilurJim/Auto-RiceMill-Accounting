<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddAmountPaidToReceivedModesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('received_modes', function (Blueprint $table) {
            // Add the amount_paid column to track paid amounts
            $table->decimal('amount_paid', 15, 2)->default(0);  // Amount paid (defaults to 0)
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
            // Remove the amount_paid column if rolling back the migration
            $table->dropColumn('amount_paid');
        });
    }
}