<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;

/**
 * PRESENTATION FILE #3: TRANSACTION GENERATOR
 * 
 * This command creates an infinite loop that generates random transactions
 * at regular intervals. It's perfect for simulating real-world activity
 * in our transaction viewer for demo purposes.
 */
class GenerateTransactionsLoop extends Command
{
    protected $signature = 'app:generate-transactions-loop {seconds=30 : Interval in seconds}'; 
    protected $description = 'Generate random transactions in a continuous loop';

    /**
     * PRESENTATION POINT: Simulated Data Generation
     * 
     * This method runs a continuous loop to generate random transaction data
     * at specified intervals, simulating a live transaction feed.
     */
    public function handle()
    {
        $seconds = (int) $this->argument('seconds');
        
        $this->info("Starting transaction generator loop every {$seconds} seconds. Press Ctrl+C to stop.");
        
        while (true) {
            // PRESENTATION POINT: Random Transaction Creation
            // We create transactions with randomized data including:
            // - Random account types (checking, savings, credit)
            // - Random positive or negative amounts between $1.00 and $100.00
            // - Unique identifier in the description
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
