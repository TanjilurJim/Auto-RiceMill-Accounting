<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $t) {
            $t->id();
            $t->date('date');
            $t->string('voucher_no')->nullable()->index();
            $t->foreignId('expense_ledger_id')->constrained('account_ledgers');
            $t->decimal('amount', 14, 2);
            $t->text('note')->nullable();
            $t->foreignId('payment_ledger_id')->nullable()->constrained('account_ledgers');
            $t->foreignId('supplier_ledger_id')->nullable()->constrained('account_ledgers');
            $t->foreignId('journal_id')->nullable()->constrained('journals');
            $t->foreignId('created_by')->constrained('users');
            $t->timestamps();
            $t->softDeletes();
            $t->index(['date', 'created_by']);
        });

        // MySQL 8.0.16+ only (MariaDB <10.2 may ignore or error)
        if (DB::getDriverName() === 'mysql') {
            DB::statement("
            ALTER TABLE `expenses`
            ADD CONSTRAINT `chk_expenses_one_side_only`
            CHECK (
                (payment_ledger_id IS NOT NULL AND supplier_ledger_id IS NULL)
             OR (payment_ledger_id IS NULL     AND supplier_ledger_id IS NOT NULL)
            )
        ");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            // MySQL syntax to drop a CHECK
            DB::statement("ALTER TABLE `expenses` DROP CHECK `chk_expenses_one_side_only`");
        }

        Schema::dropIfExists('expenses');
    }
};
