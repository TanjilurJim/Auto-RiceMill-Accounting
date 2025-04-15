<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SystemLedgerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('system_ledgers')->insert([
            ['key' => 'purchase_account', 'account_ledger_id' => 5],
            ['key' => 'sales_account', 'account_ledger_id' => 6],
            ['key' => 'inventory_account', 'account_ledger_id' => 7],
            ['key' => 'cash_account', 'account_ledger_id' => 8],
            ['key' => 'bank_account', 'account_ledger_id' => 9],
        ]);


    }
}
