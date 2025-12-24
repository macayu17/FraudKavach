import React, { useState } from 'react';
import { X, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

const PaymentModal = ({ isOpen, onClose, onSuccess }) => {
    const [amount, setAmount] = useState('');
    const [merchant, setMerchant] = useState('');
    const [category, setCategory] = useState('Shopping');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null); // success | failed | flagged

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        // Simulate "Processing" visual
        await new Promise(r => setTimeout(r, 1500));

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    currency: 'USD',
                    merchant,
                    category,
                    type: 'Online',
                    location: 'US' // Default for now
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            setResult({ status: data.transaction.status, risk: data.transaction.risk_level });

            if (data.transaction.status === 'success' || data.transaction.status === 'flagged') {
                setTimeout(() => {
                    onSuccess();
                    onClose();
                    setAmount('');
                    setMerchant('');
                    setResult(null);
                }, 2000);
            }

        } catch (err) {
            setResult({ status: 'failed', error: err.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 border border-gray-100 dark:border-gray-800">

                {/* Header */}
                <div className="bg-gradient-to-r from-visa-blue to-primary-600 p-6 text-white flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                            <CreditCard size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">New Payment</h3>
                            <p className="text-blue-100 text-sm">Secure Transaction</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* content */}
                <div className="p-6">
                    {!result ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Merchant Name"
                                placeholder="e.g. Amazon, Uber"
                                value={merchant}
                                onChange={e => setMerchant(e.target.value)}
                                required
                                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                            <Input
                                label="Amount (USD)"
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                required
                                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                    <option>Shopping</option>
                                    <option>Food</option>
                                    <option>Travel</option>
                                    <option>Entertainment</option>
                                    <option>Utilities</option>
                                </select>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full py-3 text-lg shadow-lg shadow-primary-500/30" disabled={loading}>
                                    {loading ? 'Processing...' : 'Pay Now'}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-8 space-y-4">
                            {result.status === 'failed' ? (
                                <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
                                    <X size={32} />
                                </div>
                            ) : result.status === 'flagged' ? (
                                <div className="mx-auto w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mb-4">
                                    <AlertTriangle size={32} />
                                </div>
                            ) : (
                                <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle size={32} />
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {result.status === 'success' ? 'Payment Successful' :
                                    result.status === 'flagged' ? 'Payment Flagged' : 'Payment Failed'}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400">
                                {result.status === 'failed' ? result.error :
                                    result.status === 'flagged' ? 'This transaction was flagged for review.' :
                                        'Your transaction has been processed securely.'}
                            </p>

                            {result.status === 'failed' && (
                                <Button variant="secondary" onClick={() => setResult(null)} className="mt-4 dark:bg-gray-800 dark:text-white dark:border-gray-700">
                                    Try Again
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
