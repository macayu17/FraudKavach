import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, History, PieChart, LogOut, CreditCard, PiggyBank, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();

    const navItems = [
        { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
        { icon: CreditCard, label: 'Cards', path: '/cards' },
        { icon: PiggyBank, label: 'Budgets', path: '/budgets' },
        { icon: History, label: 'Transactions', path: '/history' },
        { icon: PieChart, label: 'Analytics', path: '/analytics' },
    ];

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 glass dark:bg-gray-900/60 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 z-50 backdrop-blur-xl">
            <div className="p-6 flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-tr from-emerald-500 to-cyan-500 rounded-lg shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white">
                    <Shield size={20} />
                </div>
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                    FraudKavach
                </span>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-visa-blue text-white shadow-lg shadow-blue-500/25 translate-x-1'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:translate-x-1'
                            }`
                        }
                    >
                        <item.icon size={20} className="transition-transform group-hover:scale-110" />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-800/50">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
