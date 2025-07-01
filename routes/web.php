<?php

use App\Models\Transaction;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Api\TransactionController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/transactions', [TransactionController::class, 'index'])
    ->name('transactions.index');

Route::get('/transactions-view', function () {
    // Ensure we get transactions in the correct format
    $transactions = Transaction::orderByDesc('timestamp')
        ->get()
        ->map(function($transaction) {
            // Return only the needed fields
            return [
                'id' => $transaction->id,
                'timestamp' => $transaction->timestamp,
                'amount' => (float)$transaction->amount, // Convert to float
                'description' => $transaction->description,
                'accountType' => $transaction->accountType,
            ];
        });

    // Debug what's being passed
    Log::info('Passing transactions to view: ' . count($transactions));

    return Inertia::render('Transactions', [
        'transactions' => $transactions,
    ]);
})->name('transactions.view');

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
