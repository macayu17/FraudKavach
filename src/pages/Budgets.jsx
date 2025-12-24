import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PieChart, Plus, AlertTriangle, CheckCircle } from 'lucide-react';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [category, setCategory] = useState('Shopping');
    const [amount, setAmount] = useState('');

    const fetchBudgets = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/budgets', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setBudgets(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSetBudget = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await fetch('/api/budgets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ category, amount_limit: parseFloat(amount) })
            });
            setShowForm(false);
            fetchBudgets();
            setAmount('');
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchBudgets();
    }, []);

    const getProgressColor = (spent, limit) => {
        const percentage = (spent / limit) * 100;
        if (percentage >= 100) return 'bg-red-500';
        if (percentage >= 80) return 'bg-orange-500';
        return 'bg-green-500';
    };

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Smart Budgets</h1>
                    <p className="text-gray-500 dark:text-gray-400">Track your spending limits per category.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)} className="shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700">
                    <Plus size={20} className="mr-2" />
                    Set Budget
                </Button>
            </div>

            {showForm && (
                <div className="mb-8 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 animate-in slide-in-from-top-4">
                    <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white">New Budget Goal</h3>
                    <form onSubmit={handleSetBudget} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                            <select
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            >
                                {['Shopping', 'Food', 'Travel', 'Entertainment', 'Utilities', 'Other'].map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <Input
                                label="Monthly Limit (₹)"
                                type="number"
                                placeholder="200.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                required
                                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                        </div>
                        <Button type="submit" className="mb-[2px]">Save Goal</Button>
                    </form>
                </div>
            )}

            {loading ? (
                <div className="p-20 text-center text-gray-500 dark:text-gray-400">Loading budgets...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {budgets.map(budget => {
                        const percentage = Math.min((budget.spent / budget.amount_limit) * 100, 100);
                        const isOver = budget.spent > budget.amount_limit;

                        return (
                            <div key={budget.id} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{budget.category}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            ₹{budget.spent.toFixed(2)} spent of ₹{budget.amount_limit.toFixed(2)}
                                        </p>
                                    </div>
                                    {isOver ? (
                                        <div className="bg-red-100 text-red-600 p-2 rounded-full">
                                            <AlertTriangle size={20} />
                                        </div>
                                    ) : (
                                        <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 p-2 rounded-full">
                                            <PieChart size={20} />
                                        </div>
                                    )}
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 mb-2 overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${getProgressColor(budget.spent, budget.amount_limit)}`}
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>

                                <div className="flex justify-between text-xs font-medium">
                                    <span className={`${isOver ? 'text-red-600' : 'text-green-600'}`}>
                                        {percentage.toFixed(0)}% Used
                                    </span>
                                    <span className="text-gray-500 dark:text-gray-400">
                                        ₹{Math.max(budget.remaining, 0).toFixed(2)} remaining
                                    </span>
                                </div>
                            </div>
                        );
                    })}

                    {budgets.length === 0 && !showForm && (
                        <div className="col-span-full py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                            <Button onClick={() => setShowForm(true)} variant="ghost">Start budgeting now</Button>
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default Budgets;
