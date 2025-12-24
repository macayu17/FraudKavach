import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import CreditCard from '../components/Cards/CreditCard';
import { Button } from '../components/ui/Button';
import { Plus, Snowflake, Trash2, Power } from 'lucide-react';

const Cards = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newCard, setNewCard] = useState({
        color: 'visa-blue',
        card_holder: '',
        spending_limit: 1000
    });

    const fetchCards = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/cards', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setCards(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const createCard = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newCard)
            });

            if (!res.ok) {
                const text = await res.text();
                try {
                    const errData = JSON.parse(text);
                    throw new Error(errData.error || 'Failed to create card');
                } catch (parseErr) {
                    throw new Error(text || `Server Error: ${res.status} ${res.statusText}`);
                }
            }

            fetchCards();
        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        }
    };

    const toggleFreeze = async (id, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const newStatus = currentStatus === 'Active' ? 'Frozen' : 'Active';
            await fetch(`/api/cards/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            fetchCards();
        } catch (err) {
            console.error(err);
        }
    };

    const deleteCard = async (id) => {
        if (!window.confirm('Are you sure you want to delete this card?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`/api/cards/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchCards();
        } catch (err) {
            console.error(err);
            alert('Failed to delete card');
        }
    };

    useEffect(() => {
        fetchCards();
    }, []);

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Virtual Cards</h1>
                    <p className="text-gray-500 dark:text-gray-400">Manage your secure virtual payment cards.</p>
                </div>
                <Button onClick={() => setShowForm(true)} className="shadow-lg shadow-blue-500/20">
                    <Plus size={20} className="mr-2" />
                    Create New Card
                </Button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create Virtual Card</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Design</label>
                                <div className="flex gap-2">
                                    {['visa-blue', 'visa-gold', 'visa-black'].map(c => (
                                        <button
                                            key={c}
                                            type="button"
                                            onClick={() => setNewCard({ ...newCard, color: c })}
                                            className={`w-10 h-10 rounded-full bg-gradient-to-br ${c === 'visa-blue' ? 'from-blue-900 to-blue-600' :
                                                c === 'visa-gold' ? 'from-yellow-600 to-yellow-400' : 'from-gray-900 to-gray-700'
                                                } ${newCard.color === c ? 'ring-2 ring-offset-2 ring-primary-500' : ''}`}
                                        />
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Card Holder Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    value={newCard.card_holder}
                                    onChange={e => setNewCard({ ...newCard, card_holder: e.target.value })}
                                    placeholder="Enter name"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Spending Limit (₹)</label>
                                <input
                                    type="number"
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                    value={newCard.spending_limit}
                                    onChange={e => setNewCard({ ...newCard, spending_limit: e.target.value })}
                                    placeholder="1000"
                                />
                            </div>

                            <div className="flex gap-3 mt-6">
                                <Button variant="secondary" onClick={() => setShowForm(false)} className="flex-1">Cancel</Button>
                                <Button onClick={createCard} className="flex-1">Create Card</Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="p-20 text-center text-gray-500 dark:text-gray-400">Loading cards...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {cards.map(card => (
                        <div key={card.id} className="flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                            <CreditCard card={card} frozen={card.status === 'Frozen'} />

                            <div className="flex gap-2 w-full max-w-sm justify-center">
                                <Button
                                    variant={card.status === 'Frozen' ? 'primary' : 'secondary'}
                                    onClick={() => toggleFreeze(card.id, card.status)}
                                    className={`flex-1 ${card.status === 'Active' && 'dark:bg-gray-800 dark:text-white dark:border-gray-700'}`}
                                >
                                    {card.status === 'Active' ? (
                                        <><Snowflake size={18} className="mr-2" /> Freeze</>
                                    ) : (
                                        <><Power size={18} className="mr-2" /> Unfreeze</>
                                    )}
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={() => deleteCard(card.id)}
                                    className="dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/50 hover:dark:bg-red-900/40"
                                >
                                    <Trash2 size={18} />
                                </Button>
                            </div>
                        </div>
                    ))}

                    {cards.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                            <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <Plus size={32} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Virtual Cards</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">Create your first disposable card for safe shopping.</p>
                            <Button onClick={createCard}>Create Now</Button>
                        </div>
                    )}
                </div>
            )}
        </Layout>
    );
};

export default Cards;
