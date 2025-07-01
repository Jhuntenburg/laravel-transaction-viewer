import React, { useEffect, useState, useCallback } from 'react';
import { usePage } from '@inertiajs/react';

type Transaction = {
    id: number;
    timestamp: string;
    amount: number;
    description: string;
    accountType: string;
};

type PaginationMeta = {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    from: number;
    to: number;
};

export default function Transactions() {
    const { transactions: initialTransactions = [] } = usePage().props as any;

    // Transactions state
    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions || []);
    const [filter, setFilter] = useState<string>('all');
    const [lastTimestamp, setLastTimestamp] = useState<string | null>(
        initialTransactions?.length ? initialTransactions[0].timestamp : null
    );

    // Pagination state
    const [pagination, setPagination] = useState<PaginationMeta>({
        total: initialTransactions?.length || 0,
        per_page: 10,
        current_page: 1,
        last_page: Math.ceil((initialTransactions?.length || 0) / 10),
        from: 1,
        to: Math.min(10, initialTransactions?.length || 0)
    });
    
    // Transaction notification state
    const [newTransactionCount, setNewTransactionCount] = useState<number>(0);
    const [showNotification, setShowNotification] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // Fetch transactions with pagination and filters
    const fetchTransactions = useCallback(() => {
        setIsLoading(true);
        
        // Build query params
        const params = new URLSearchParams();
        params.append('page', pagination.current_page.toString());
        params.append('per_page', pagination.per_page.toString());
        
        if (filter !== 'all') {
            params.append('accountType', filter);
        }
        
        fetch(`/transactions?${params}`)
            .then(res => res.json())
            .then(({ data, pagination: paginationData }) => {
                setTransactions(data);
                setPagination(paginationData);
                
                // Update last timestamp if we get data and we're on the first page
                if (data.length > 0 && pagination.current_page === 1) {
                    setLastTimestamp(data[0].timestamp);
                }
                
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Error fetching transactions:', err);
                setIsLoading(false);
            });
    }, [filter, pagination.current_page, pagination.per_page]);
    
    // Initial data load when filter or pagination changes
    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);
    
    // Polling for new transactions
    useEffect(() => {
        const interval = setInterval(() => {
            if (!lastTimestamp) return;
            
            // Only poll for new transactions when on first page
            if (pagination.current_page !== 1) return;

            console.log("Polling for new transactions since", lastTimestamp);
            fetch(`/transactions?since=${lastTimestamp}`)
                .then((res) => res.json())
                .then(({ data }: { data: Transaction[] }) => {
                    console.log("Poll response:", data);
                    if (data.length > 0) {
                        // Only add new transactions if they match the current filter
                        const filteredNewTransactions = filter === 'all' 
                            ? data 
                            : data.filter(t => t.accountType === filter);
                            
                        if (filteredNewTransactions.length > 0) {
                            setTransactions(prev => [...filteredNewTransactions, ...prev]);
                            setNewTransactionCount(filteredNewTransactions.length);
                            setShowNotification(true);
                            setLastTimestamp(data[0].timestamp);
                            
                            // Hide notification after 3 seconds
                            setTimeout(() => {
                                setShowNotification(false);
                            }, 3000);
                        }
                    }
                })
                .catch((err) => console.error('Polling error:', err));
        }, 5000); // Reduced to 5 seconds for testing (change back to 30000 later)

        return () => clearInterval(interval);
    }, [lastTimestamp, filter, pagination.current_page]);

    // Change page size handler
    const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newPerPage = parseInt(e.target.value);
        setPagination(prev => ({
            ...prev,
            per_page: newPerPage,
            current_page: 1 // Reset to first page when changing page size
        }));
    };
    
    // Change page handler
    const goToPage = (page: number) => {
        if (page < 1 || page > pagination.last_page) return;
        setPagination(prev => ({ ...prev, current_page: page }));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">Transaction Viewer</h1>
            
            {/* New transaction notification banner */}
            {showNotification && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 relative animate-pulse">
                    <strong className="font-bold">New transactions!</strong>
                    <span className="block sm:inline"> {newTransactionCount} new transaction(s) have been added.</span>
                </div>
            )}

            <div className="flex justify-between items-center mb-4">
                <div>
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
                
                <div>
                    <label className="mr-2">Items per page:</label>
                    <select
                        className="border px-2 py-1"
                        value={pagination.per_page}
                        onChange={handlePerPageChange}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center my-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
            ) : (
                <>
                    <table className="w-full border">
                        <thead>
                        <tr className="bg-gray-200 text-gray-800 font-medium text-left">
                            <th className="p-2 border">Timestamp</th>
                            <th className="p-2 border">Amount</th>
                            <th className="p-2 border">Description</th>
                            <th className="p-2 border">Account Type</th>
                        </tr>
                        </thead>
                        <tbody>
                        {transactions.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-4 text-center">No transactions found</td>
                            </tr>
                        ) : (
                            transactions.map((t) => (
                                <tr key={t.id}>
                                    <td className="p-2 border">{new Date(t.timestamp).toLocaleString()}</td>
                                    <td className="p-2 border">${t.amount.toFixed(2)}</td>
                                    <td className="p-2 border">{t.description}</td>
                                    <td className="p-2 border">{t.accountType}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                    
                    {/* Pagination controls */}
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            Showing {pagination.from || 0} to {pagination.to || 0} of {pagination.total} entries
                        </div>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => goToPage(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className={`px-3 py-1 border rounded ${pagination.current_page === 1 ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-100'}`}
                            >
                                Previous
                            </button>
                            
                            {Array.from({ length: Math.min(5, pagination.last_page) }).map((_, i) => {
                                // Show pages around current page
                                const pageOffset = Math.max(0, pagination.current_page - 3);
                                const pageNum = i + 1 + pageOffset;
                                if (pageNum > pagination.last_page) return null;
                                
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => goToPage(pageNum)}
                                        className={`px-3 py-1 border rounded ${pagination.current_page === pageNum ? 'bg-blue-600 text-white font-bold' : 'bg-white text-black hover:bg-gray-100'}`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                            
                            <button
                                onClick={() => goToPage(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className={`px-3 py-1 border rounded ${pagination.current_page === pagination.last_page ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-black hover:bg-gray-100'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
