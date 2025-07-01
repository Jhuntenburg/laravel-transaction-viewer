<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;

class GenerateTransactionsLoop extends Command
{
    protected $signature = 'app:generate-transactions-loop {seconds=30 : Interval in seconds}'; 
    protected $description = 'Generate random transactions in a continuous loop';

    public function handle()
    {
        $seconds = (int) $this->argument('seconds');
        
        $this->info("Starting transaction generator loop every {$seconds} seconds. Press Ctrl+C to stop.");
        
        while (true) {
            $accountTypes = ['checking', 'savings', 'credit'];
            
            $transaction = Transaction::create([
                'timestamp' => now(),
                'amount' => round((rand(0, 1) ? 1 : -1) * rand(100, 10000) / 100, 2), // 50% chance of negative amount
                'description' => 'Auto Transaction #' . uniqid(),
                'accountType' => $accountTypes[array_rand($accountTypes)],
            ]);
            
            $this->info("Generated transaction #{$transaction->id} at " . now()->format('H:i:s'));
            
            // Sleep for the specified interval
            sleep($seconds);
        }
    }
}
