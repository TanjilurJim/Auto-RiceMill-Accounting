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
        Schema::table('account_ledgers', function (Blueprint $table) {
            $table->string('ledger_type')->nullable()->after('account_group_id'); // or wherever you prefer
        });
    }

    public function down()
    {
        Schema::table('account_ledgers', function (Blueprint $table) {
            $table->dropColumn('ledger_type');
        });
    }
};
