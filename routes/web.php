<?php

/**
 * PRESENTATION FILE #4: APPLICATION ROUTES
 * 
 * This file defines all web routes for the application.
 * It demonstrates how Laravel + Inertia + React work together in a full-stack app.
 */

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

// PRESENTATION POINT: API Endpoint Route
// This route handles all transaction data requests from the frontend
// It's used both for initial page loads and for real-time polling updates
Route::get('/transactions', [TransactionController::class, 'index'])
    ->name('transactions.index');

// PRESENTATION POINT: Server-Side Rendered Page Route
// This demonstrates Laravel's server-side rendering with Inertia
// Initial data is loaded server-side and passed to React for enhanced UX
Route::get('/transactions-view', function () {
    // Get initial transactions for first page load
    $transactions = Transaction::orderByDesc('timestamp')
        ->get()
        ->map(function($transaction) {
            // Format transaction data consistently
            return [
                'id' => $transaction->id,
                'timestamp' => $transaction->timestamp,
                'amount' => (float)$transaction->amount, // Convert to float for proper JS handling
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
