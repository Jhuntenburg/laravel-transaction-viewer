<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Carbon\Carbon;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $types = ['checking', 'savings', 'credit'];
        foreach (range(1, 10) as $i) {
            DB::table('transactions')->insert([
                'timestamp' => Carbon::now()->subMinutes(rand(0, 500)),
                'amount' => rand(100, 10000) / 100,
                'description' => 'Sample transaction ' . $i,
                'accountType' => $types[array_rand($types)],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
