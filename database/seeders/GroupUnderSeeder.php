<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class GroupUnderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('group_unders')->insert([
            ['name' => 'Fixed Assets'],
            ['name' => 'Current Assets'],
            ['name' => 'Misc. Expenses (Asset)'],
            ['name' => 'Capital Account'],
            ['name' => 'Loans (Liability)'],
            ['name' => 'Current Liabilities'],
            ['name' => 'Sundry Debtors'],
            ['name' => 'Sundry Creditors'],
            ['name' => 'Direct Expenses'],
            ['name' => 'Direct Income'],
            ['name' => 'Indirect Expenses'],
            ['name' => 'Indirect Income'],
            ['name' => 'Vehicles & Transportation'],
            ['name' => 'Machinery & Tools'],
            ['name' => 'Deposit (Assets)'],
            ['name' => 'Loan & Advance (Asset)'],
            ['name' => 'Cash-in-Hand'],
            ['name' => 'Bank Account'],
            ['name' => 'Secured Loans'],
            ['name' => 'Supplier Summary'],
            ['name' => 'Customer Summary'],
            ['name' => 'Wastage Party'],
            ['name' => 'Transportation'],
            ['name' => 'Land & Land Development'],
            ['name' => 'Long Term Loan'],
            ['name' => 'Non Current Liabilities'],
            ['name' => 'Inter Company Transaction'],
            ['name' => 'Advance Deposit and Pre-Payment'],
            ['name' => 'Short Term Loan'],
            ['name' => 'Selling & Distribution Exp'],
            ['name' => 'Administrative Overhead'],
            ['name' => 'Non Operating Income'],
            ['name' => 'Financial Expenses'],
            ['name' => 'ERT'],
        ]);
    }
}
