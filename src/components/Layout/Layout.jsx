import React from 'react';
import Sidebar from './Sidebar';
// import { Menu } from 'lucide-react'; // For mobile menu (Simulated)

export const Layout = ({ children }) => {
    return (
        <div className="min-h-screen mesh-bg transition-colors">
            <Sidebar />
            <main className="md:ml-64 min-h-screen bg-gray-50/50 dark:bg-black/20 backdrop-blur-sm">
                <div className="p-8 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};
