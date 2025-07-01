import React, { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';

type Transaction = {
    id: number;
    timestamp: string;
    amount: number;
    description: string;
    accountType: string;
};

export default function Transactions() {
    const { transactions: initialTransactions = [] } = usePage().props as any;

    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions || []);
    const [filter, setFilter] = useState<string>('all');
    const [lastTimestamp, setLastTimestamp] = useState<string | null>(
        initialTransactions?.length ? initialTransactions[0].timestamp : null
    );

    // Add state for new transaction notification
    const [newTransactionCount, setNewTransactionCount] = useState<number>(0);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    
    useEffect(() => {
        const interval = setInterval(() => {
            if (!lastTimestamp) return;

            console.log("Polling for new transactions since", lastTimestamp);
            fetch(`/transactions?since=${lastTimestamp}`)
                .then((res) => res.json())
                .then(({ data }: { data: Transaction[] }) => {
                    console.log("Poll response:", data);
                    if (data.length > 0) {
                        setTransactions((prev) => [...data, ...prev]);
                        setLastTimestamp(data[0].timestamp);
                        setNewTransactionCount(data.length);
                        setShowNotification(true);
                        
                        // Hide notification after 3 seconds
                        setTimeout(() => {
                            setShowNotification(false);
                        }, 3000);
                    }
                })
                .catch((err) => console.error('Polling error:', err));
        }, 5000); // Reduced to 5 seconds for testing (change back to 30000 later)

        return () => clearInterval(interval);
    }, [lastTimestamp]);

    const filteredTransactions = filter === 'all'
        ? transactions
        : transactions.filter((t) => t.accountType === filter);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Transaction Viewer</h1>
            
            {/* New transaction notification banner */}
            {showNotification && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative animate-pulse">
                    <strong className="font-bold">New transactions!</strong>
                    <span className="block sm:inline"> {newTransactionCount} new transaction(s) have been added.</span>
                </div>
            )}

            <div className="mb-4">
                <label className="mr-2">Filter by Account Type:</label>
                <select
                    className="border px-2 py-1"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="credit">Credit</option>
                </select>
            </div>

            <table className="w-full border">
                <thead>
                <tr className="bg-gray-200 text-left">
                    <th className="p-2 border">Timestamp</th>
                    <th className="p-2 border">Amount</th>
                    <th className="p-2 border">Description</th>
                    <th className="p-2 border">Account Type</th>
                </tr>
                </thead>
                <tbody>
                {filteredTransactions.map((t) => (
                    <tr key={t.id}>
                        <td className="p-2 border">{new Date(t.timestamp).toLocaleString()}</td>
                        <td className="p-2 border">${t.amount.toFixed(2)}</td>
                        <td className="p-2 border">{t.description}</td>
                        <td className="p-2 border">{t.accountType}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
