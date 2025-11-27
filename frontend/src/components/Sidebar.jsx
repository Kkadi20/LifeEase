import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
        { path: '/tasks', icon: '📋', label: 'Tasks' },
        { path: '/events', icon: '📅', label: 'Events' },
        { path: '/journal', icon: '📝', label: 'Journal' },
        { path: '/mood', icon: '😊', label: 'Mood' }
    ];

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-indigo-600 text-white rounded-lg dark:bg-indigo-500"
            >
                {isOpen ? '✕' : '☰'}
            </button>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-200 ease-in-out z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="p-6 border-b dark:border-gray-700">
                        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">LifeEase</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Welcome, {user?.name}</p>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    location.pathname === item.path
                                        ? 'bg-indigo-600 text-white dark:bg-indigo-500'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Theme Toggle & Logout */}
                    <div className="p-4 border-t dark:border-gray-700 space-y-2">
                        <button
                            onClick={toggleTheme}
                            className="w-full px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}
                        </button>
                        <button
                            onClick={logout}
                            className="w-full px-4 py-2 text-red-600 dark:text-red-400 border border-red-600 dark:border-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
