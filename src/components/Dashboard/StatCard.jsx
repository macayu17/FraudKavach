import React from 'react';
import { DollarSign, AlertTriangle, Activity } from 'lucide-react';

export const StatCard = ({ title, value, trend, trendValue, type }) => {
    const getIcon = () => {
        switch (type) {
            case 'balance': return <DollarSign className="text-emerald-400" size={24} />;
            case 'fraud': return <AlertTriangle className="text-rose-400" size={24} />;
            default: return <Activity className="text-violet-400" size={24} />;
        }
    };

    return (
        <div className="glass rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 group">
            <div className="flex justify-between items-start mb-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/10 group-hover:scale-105 transition-transform">
                    {getIcon()}
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                        {trend === 'up' ? '↗' : '↘'} {trendValue}
                    </span>
                )}
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:translate-x-1 transition-transform">{value}</h3>
            </div>
        </div>
    );
};
