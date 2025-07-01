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
        $perPage = $request->query('per_page', 10); // Default to 10 items per page
        $page = $request->query('page', 1); // Default to page 1
        
        $query = Transaction::query()->orderByDesc('timestamp');

        // Apply timestamp filter for polling
        if ($since) {
            $query->where('timestamp', '>', $since);
            // When polling for new data, we don't want to paginate
            $transactions = $query->get()
                ->map(function($transaction) {
                    return $this->formatTransaction($transaction);
                });
            
            // Log the number of new transactions found
            Log::info("Polling found {$transactions->count()} new transactions since {$since}");
            
            return response()->json([
                'data' => $transactions,
            ]);
        } 
        
        // Filter by account type if specified
        if ($request->has('accountType') && $request->accountType !== 'all') {
            $query->where('accountType', $request->accountType);
        }
        
        // Get paginated results
        $paginatedTransactions = $query->paginate($perPage, ['*'], 'page', $page);
        
        // Format the transactions
        $formattedData = $paginatedTransactions->getCollection()
            ->map(function($transaction) {
                return $this->formatTransaction($transaction);
            });
        
        // Return paginated response with metadata
        return response()->json([
            'data' => $formattedData,
            'pagination' => [
                'total' => $paginatedTransactions->total(),
                'per_page' => $paginatedTransactions->perPage(),
                'current_page' => $paginatedTransactions->currentPage(),
                'last_page' => $paginatedTransactions->lastPage(),
                'from' => $paginatedTransactions->firstItem(),
                'to' => $paginatedTransactions->lastItem(),
            ]
        ]);
    }
    
    /**
     * Format a transaction for consistent API response
     */
    private function formatTransaction($transaction)
    {
        return [
            'id' => $transaction->id,
            'timestamp' => $transaction->timestamp,
            'amount' => (float)$transaction->amount,
            'description' => $transaction->description,
            'accountType' => $transaction->accountType,
        ];
    }
}
