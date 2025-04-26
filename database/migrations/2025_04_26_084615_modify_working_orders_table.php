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
        //
        Schema::table('working_orders', function (Blueprint $table) {
            // Drop the old unique constraint on tenant_id and voucher_no
            $table->dropUnique(['tenant_id', 'voucher_no']);

            // Create a new unique constraint on created_by and voucher_no
            $table->unique(['created_by', 'voucher_no']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
        Schema::table('working_orders', function (Blueprint $table) {
            // If we need to roll back the migration, drop the new unique constraint
            $table->dropUnique(['created_by', 'voucher_no']);

            // And restore the old unique constraint on tenant_id and voucher_no
            $table->unique(['tenant_id', 'voucher_no']);
        });
    }
};
