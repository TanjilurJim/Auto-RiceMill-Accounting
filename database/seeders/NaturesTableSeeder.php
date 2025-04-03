<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class NaturesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        DB::table('natures')->insert([
            ['name' => 'Assets'],
            ['name' => 'Liabilities'],
            ['name' => 'Income'],
            ['name' => 'Expenses'],
        ]);
    }
}
