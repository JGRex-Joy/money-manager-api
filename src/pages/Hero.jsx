import { Link } from 'react-router-dom';
import {
    Wallet,
    TrendingUp,
    PieChart,
    Shield,
    Zap,
    BarChart3,
    ArrowRight,
    CheckCircle,
    Smartphone,
    Globe,
    Lock
} from 'lucide-react';

const Hero = () => {
    const features = [
        {
            icon: PieChart,
            title: 'Visual Analytics',
            description: 'Beautiful charts and graphs to visualize your spending patterns'
        },
        {
            icon: TrendingUp,
            title: 'Income Tracking',
            description: 'Monitor all your income sources in one place'
        },
        {
            icon: BarChart3,
            title: 'Expense Management',
            description: 'Categorize and track every expense effortlessly'
        },
        {
            icon: Shield,
            title: 'Secure & Private',
            description: 'Your financial data is encrypted and protected'
        },
        {
            icon: Zap,
            title: 'Real-time Updates',
            description: 'Get instant insights into your financial health'
        },
        {
            icon: Smartphone,
            title: 'Responsive Design',
            description: 'Access your finances from any device, anywhere'
        }
    ];

    const stats = [
        { value: '1K', label: 'Active Users' },
        { value: '50K+ KGS', label: 'Managed Funds' },
        { value: '99.9%', label: 'Uptime' },
        { value: '24/7', label: 'Support' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Wallet className="text-white" size={24} />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                MoneyManager
                            </span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition shadow-lg"
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
                            <Lock size={16} />
                            <span className="text-sm font-semibold">Secure & Private</span>
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                            Take Control of Your
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Finances</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Track income, manage expenses, and visualize your financial journey with beautiful analytics. All in one place.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                to="/signup"
                                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition shadow-xl text-lg font-semibold"
                            >
                                <span>Start Free Today</span>
                                <ArrowRight size={20} />
                            </Link>
                            <Link
                                to="/login"
                                className="flex items-center justify-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-xl hover:bg-gray-50 transition border-2 border-gray-200 text-lg font-semibold"
                            >
                                <span>Sign In</span>
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl p-8 shadow-2xl">
                            <div className="bg-white rounded-2xl p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-bold text-gray-800">Financial Overview</h3>
                                    <Globe className="text-blue-600" size={24} />
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                                        <div className="flex items-center space-x-3">
                                            <TrendingUp className="text-green-600" size={24} />
                                            <span className="font-semibold text-gray-700">Income</span>
                                        </div>
                                        <span className="text-xl font-bold text-green-600">12,450 KGS</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
                                        <div className="flex items-center space-x-3">
                                            <BarChart3 className="text-red-600" size={24} />
                                            <span className="font-semibold text-gray-700">Expenses</span>
                                        </div>
                                        <span className="text-xl font-bold text-red-600">8,230 KGS</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                                        <div className="flex items-center space-x-3">
                                            <Wallet className="text-blue-600" size={24} />
                                            <span className="font-semibold text-gray-700">Balance</span>
                                        </div>
                                        <span className="text-xl font-bold text-blue-600">4,220 KGS</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-blue-100 text-lg">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                        Everything You Need to Manage Money
                    </h2>
                    <p className="text-xl text-gray-600">
                        Powerful features to help you take control of your finances
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition border border-gray-100 hover:border-blue-200"
                            >
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                                    <Icon className="text-white" size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-gray-900 mb-6">
                        Ready to Transform Your Financial Life?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Join thousands of users who have taken control of their finances
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <div className="flex items-center space-x-2 text-gray-700">
                            <CheckCircle className="text-green-500" size={20} />
                            <span>No credit card required</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                            <CheckCircle className="text-green-500" size={20} />
                            <span>Free forever</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-700">
                            <CheckCircle className="text-green-500" size={20} />
                            <span>Cancel anytime</span>
                        </div>
                    </div>
                    <Link
                        to="/signup"
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-10 py-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition shadow-xl text-lg font-semibold mt-8"
                    >
                        <span>Get Started Now</span>
                        <ArrowRight size={20} />
                    </Link>
                </div>
            </div>

            <footer className="bg-gray-900 text-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div className="col-span-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Wallet className="text-white" size={18} />
                                </div>
                                <span className="text-xl font-bold">MoneyManager</span>
                            </div>
                            <p className="text-gray-400">
                                Take control of your finances with ease
                            </p>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Product</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Features</a></li>
                                <li><a href="#" className="hover:text-white">Pricing</a></li>
                                <li><a href="#" className="hover:text-white">Security</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Company</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">About</a></li>
                                <li><a href="#" className="hover:text-white">Blog</a></li>
                                <li><a href="#" className="hover:text-white">Careers</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold mb-4">Legal</h4>
                            <ul className="space-y-2 text-gray-400">
                                <li><a href="#" className="hover:text-white">Privacy</a></li>
                                <li><a href="#" className="hover:text-white">Terms</a></li>
                                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                        <p>&copy; 2026. Money Manager. Amir Omurkulov</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Hero;