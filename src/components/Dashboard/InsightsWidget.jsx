import React from 'react';
import { Lightbulb, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export const InsightsWidget = ({ insights = [] }) => {
    if (!insights.length) return null;

    const getIcon = (type) => {
        switch (type) {
            case 'warning': return <TrendingUp size={24} className="text-orange-500" />;
            case 'success': return <TrendingDown size={24} className="text-green-500" />;
            case 'alert': return <AlertCircle size={24} className="text-red-500" />;
            default: return <Lightbulb size={24} className="text-blue-500" />;
        }
    };

    const getBgColor = (type) => {
        switch (type) {
            case 'warning': return 'bg-orange-500/10 border-orange-500/20 text-orange-200';
            case 'success': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200';
            case 'alert': return 'bg-rose-500/10 border-rose-500/20 text-rose-200';
            default: return 'bg-blue-500/10 border-blue-500/20 text-blue-200';
        }
    };

    return (
        <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-violet-500 to-fuchsia-500 p-2 rounded-lg text-white shadow-lg shadow-purple-500/20">
                    <Lightbulb size={20} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Smart Insights</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {insights.map((insight, index) => (
                    <div
                        key={index}
                        className={`p-4 rounded-xl border backdrop-blur-sm ${getBgColor(insight.type)} flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 hover:scale-[1.02] transition-transform`}
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        <div className="mt-1">{getIcon(insight.type)}</div>
                        <div>
                            <p className="font-medium mb-1 dark:text-gray-100">{insight.message}</p>
                            <p className="text-sm opacity-80">{insight.tip}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

