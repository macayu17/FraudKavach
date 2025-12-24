import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { StatCard } from '../components/Dashboard/StatCard';
import { InsightsWidget } from '../components/Dashboard/InsightsWidget';
import PaymentModal from '../components/Payment/PaymentModal';
import { DollarSign, Activity, AlertTriangle, CreditCard, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { SpendBarChart, CategoryDoughnutChart } from '../components/Analytics/FinancialCharts';
import TransactionTable from '../components/Transactions/TransactionTable';
// import { Line } from 'react-chartjs-2'; // Will add charts later if time.

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            const headers = { 'Authorization': `Bearer ${token} ` };

            const [statsRes, txRes] = await Promise.all([
                fetch('/api/analytics', { headers }),
                fetch('/api/transactions?limit=5', { headers })
            ]);

            const statsData = await statsRes.json();
            const txData = await txRes.json();

            setStats(statsData);
            setRecentTransactions(txData);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Helpers
    const getTotalSpend = () => {
        if (!stats?.statusData) return 0;
        const success = stats.statusData.find(s => s.status === 'success');
        // We don't have total sum in statusData endpoint, only count. 
        // Wait, Controller sends `status, COUNT(*)`.
        // My Controller `statusData` is just counts.
        // I need SUM in the controller or generic sum.
        // Actually the `dailyData` has sums. I can sum that for "Last 7 days" or just show Counts for now.
        // Let's use `dailyData` sum for "Weekly Spend".
        if (!stats?.dailyData) return 0;
        return stats.dailyData.reduce((acc, curr) => acc + curr.total, 0);
    };

    const getFraudCount = () => stats?.fraudStats?.flagged_count || 0;

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400">Here's what's happening with your payments today.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-primary-500/20">
                    <Plus size={20} className="mr-2" />
                    New Transaction
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading insights...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <StatCard
                        title="7-Day Spend"
                        value={`₹${getTotalSpend().toFixed(2)} `}
                        icon={DollarSign}
                        color="blue"
                        trend="up"
                        change="+12% vs last week"
                    />
                    <StatCard
                        title="Fraud Risks Detected"
                        value={getFraudCount()}
                        icon={AlertTriangle}
                        color={getFraudCount() > 0 ? "orange" : "green"}
                        trend={getFraudCount() > 0 ? "down" : "neutral"}
                        change={getFraudCount() > 0 ? "Action Required" : "Safe & Secure"}
                    />
                    <StatCard
                        title="Total Transactions"
                        value={stats?.statusData?.reduce((acc, curr) => acc + curr.count, 0) || 0}
                        icon={Activity}
                        color="purple"
                    />
                </div>
            )}

            {/* AI Insights */}
            {stats?.insights && <InsightsWidget insights={stats.insights} />}

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <SpendBarChart data={stats?.dailyData || []} />
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col items-center">
                    <h3 className="text-gray-900 dark:text-white font-semibold mb-6 self-start">Spending by Category</h3>
                    <div className="w-full max-w-xs">
                        <CategoryDoughnutChart data={stats?.categoryData || []} />
                    </div>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recent Transactions</h3>
                    <Button variant="ghost" onClick={() => window.location.href = '/history'} className="dark:text-gray-300 dark:hover:bg-gray-800">View All</Button>
                </div>
                <TransactionTable transactions={recentTransactions} />
            </div>

            <PaymentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />
        </Layout>
    );
};

export default Dashboard;
