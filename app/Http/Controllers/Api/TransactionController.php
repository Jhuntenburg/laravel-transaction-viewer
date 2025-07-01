<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $since = $request->query('since');
        
        $query = Transaction::query()->orderByDesc('timestamp');

        if ($since) {
            $query->where('timestamp', '>', $since);
        }
        
        // Get the transactions
        $transactions = $query->get()
            ->map(function($transaction) {
                // Return only the needed fields with consistent formatting
                return [
                    'id' => $transaction->id,
                    'timestamp' => $transaction->timestamp,
                    'amount' => (float)$transaction->amount,
                    'description' => $transaction->description,
                    'accountType' => $transaction->accountType,
                ];
            });
        
        // Log the number of new transactions found
        if ($since) {
            Log::info("Polling found {$transactions->count()} new transactions since {$since}");
        }

        return response()->json([
            'data' => $transactions,
        ]);
    }
}
