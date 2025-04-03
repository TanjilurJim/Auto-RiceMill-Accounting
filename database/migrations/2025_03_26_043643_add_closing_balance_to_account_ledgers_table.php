<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('account_ledgers', function (Blueprint $table) {
            $table->decimal('closing_balance', 12, 2)->nullable()->after('opening_balance');
        });
    }

    public function down()
    {
        Schema::table('account_ledgers', function (Blueprint $table) {
            $table->dropColumn('closing_balance');
        });
    }
};
