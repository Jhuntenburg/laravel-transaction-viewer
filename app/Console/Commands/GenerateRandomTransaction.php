<?php

namespace App\Console\Commands;

use App\Models\Transaction;
use Illuminate\Console\Command;

class GenerateRandomTransaction extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-random-transaction {--count=1 : Number of transactions to generate}'; 

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate random transactions for the transaction viewer';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $count = $this->option('count');
        $accountTypes = ['checking', 'savings', 'credit'];
        
        $this->info("Generating {$count} random transactions...");
        
        $generated = 0;
        
        for ($i = 0; $i < $count; $i++) {
            $transaction = Transaction::create([
                'timestamp' => now(),
                'amount' => round(rand(100, 10000) / 100, 2), // Random amount between $1 and $100
                'description' => 'Transaction #' . uniqid(),
                'accountType' => $accountTypes[array_rand($accountTypes)],
            ]);
            
            $generated++;
        }
        
        $this->info("Successfully generated {$generated} transactions");
        return Command::SUCCESS;
    }
}
