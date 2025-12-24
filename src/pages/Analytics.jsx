import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { SpendBarChart, CategoryDoughnutChart } from '../components/Analytics/FinancialCharts';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/analytics', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <Layout>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Financial Analytics</h1>
                <p className="text-gray-500 dark:text-gray-400">Deep dive into your spending habits.</p>
            </div>

            {loading ? (
                <div className="p-20 text-center text-gray-500 dark:text-gray-400">Loading analytics...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <SpendBarChart data={data?.dailyData || []} />
                    </div>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800">
                        <h3 className="text-center font-medium mb-4 text-gray-700 dark:text-gray-300">Category Breakdown</h3>
                        <div className="w-full max-w-xs mx-auto">
                            <CategoryDoughnutChart data={data?.categoryData || []} />
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Analytics;
