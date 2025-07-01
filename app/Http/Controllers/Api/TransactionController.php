<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request)
    {
        $since = $request->query('since');

        $query = Transaction::query()->orderByDesc('timestamp');

        if ($since) {
            $query->where('timestamp', '>', $since);
        }

        return response()->json([
            'data' => $query->get(),
        ]);
    }
}
