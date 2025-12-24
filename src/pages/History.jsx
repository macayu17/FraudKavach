import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import TransactionTable from '../components/Transactions/TransactionTable';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Filter, Download, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const History = () => {
    const { user } = useAuth();
    const [allTransactions, setAllTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem('token');
            // Fetch more to allow client-side filtering for demo purposes
            const res = await fetch('/api/transactions?limit=100', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setAllTransactions(data);
            setFilteredTransactions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        let filtered = [...allTransactions];

        if (search) {
            const lower = search.toLowerCase();
            filtered = filtered.filter(t =>
                t.merchant.toLowerCase().includes(lower) ||
                t.category.toLowerCase().includes(lower)
            );
        }

        if (category) {
            filtered = filtered.filter(t => t.category === category);
        }

        if (startDate) {
            filtered = filtered.filter(t => new Date(t.date) >= new Date(startDate));
        }

        if (endDate) {
            filtered = filtered.filter(t => new Date(t.date) <= new Date(endDate + 'T23:59:59'));
        }

        setFilteredTransactions(filtered);
    }, [search, category, startDate, endDate, allTransactions]);

    const handleExport = () => {
        if (!filteredTransactions.length) return;

        const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Currency', 'Status', 'Risk Level', 'Location'];
        const csvContent = [
            headers.join(','),
            ...filteredTransactions.map(t => [
                `"${new Date(t.date).toISOString()}"`,
                `"${t.merchant}"`,
                `"${t.category}"`,
                t.amount,
                t.currency,
                t.status,
                t.risk_level,
                `"${t.location}"`
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'transactions.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const categories = ['Shopping', 'Food', 'Travel', 'Entertainment', 'Utilities', 'Other'];

    return (
        <Layout>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transaction History</h1>
                    <p className="text-gray-500 dark:text-gray-400">View and manage all your past payments.</p>
                </div>
                <Button variant="secondary" onClick={handleExport} className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                    <Download size={20} className="mr-2" />
                    Export CSV
                </Button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search merchant..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-visa-blue dark:bg-gray-800 dark:text-white"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                <select
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-visa-blue dark:bg-gray-800 dark:text-white"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>

                <input
                    type="date"
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-visa-blue dark:bg-gray-800 dark:text-white"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                />

                <input
                    type="date"
                    className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg outline-none focus:ring-2 focus:ring-visa-blue dark:bg-gray-800 dark:text-white"
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                {loading ? (
                    <div className="p-20 text-center text-gray-500 dark:text-gray-400">Loading history...</div>
                ) : (
                    <TransactionTable transactions={filteredTransactions} />
                )}
                {!loading && filteredTransactions.length === 0 && (
                    <div className="p-20 text-center text-gray-500 dark:text-gray-400">No transactions found.</div>
                )}
            </div>
        </Layout>
    );
};

export default History;
