import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    TrendingUp,
    TrendingDown,
    FolderOpen,
    Filter,
    LogOut,
    Wallet,
    Menu,
    X
} from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const navItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/income', icon: TrendingUp, label: 'Income' },
        { path: '/expense', icon: TrendingDown, label: 'Expenses' },
        { path: '/category', icon: FolderOpen, label: 'Categories' },
        { path: '/filter', icon: Filter, label: 'Filter' },
    ];

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
                <Link to="/dashboard" className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Wallet className="text-white" size={24} />
                    </div>
                    <div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            MoneyManager
                        </span>
                    </div>
                </Link>
            </div>

            {/* User Profile */}
            <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col">
                    <p className="text-sm font-bold text-gray-900 truncate">
                        {user.fullName || 'User'}
                    </p>
                    <p className="text-xs text-gray-600 truncate mt-1">{user.email}</p>
                </div>
            </div>

            <nav className="flex-1 p-4">
                <div className="space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                                    isActive(item.path)
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <Icon size={20} />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                    <LogOut size={20} />
                    <span className="font-medium">Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200 z-50">
                {SidebarContent()}
            </div>

            <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
                <div className="flex items-center justify-between p-4">
                    <Link to="/dashboard" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Wallet className="text-white" size={18} />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            MoneyManager
                        </span>
                    </Link>
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl flex flex-col" onClick={(e) => e.stopPropagation()}>
                        {SidebarContent()}
                    </div>
                </div>
            )}

            <div className="lg:hidden h-16" />
        </>
    );
};

export default Sidebar;