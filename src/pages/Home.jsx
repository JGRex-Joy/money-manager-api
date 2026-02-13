import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import DateRangeFilter from '../components/DateRangeFilter';
import api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { toast } from '../components/Toaster';
import { Wallet, TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Home = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (dashboardData) {
            fetchFilteredData();
        }
    }, [dateRange, dashboardData]);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            toast.error('Error loading dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredData = async () => {
        try {
            const incomeResponse = await api.post('/filter', {
                type: 'income',
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                keyword: '',
                sortField: 'date',
                sortOrder: 'desc'
            });

            const expenseResponse = await api.post('/filter', {
                type: 'expense',
                startDate: dateRange.startDate,
                endDate: dateRange.endDate,
                keyword: '',
                sortField: 'date',
                sortOrder: 'desc'
            });

            setFilteredData({
                incomes: incomeResponse.data || [],
                expenses: expenseResponse.data || []
            });
        } catch (error) {
            console.error('Error fetching filtered data:', error);
            toast.error('Error loading filtered data');
        }
    };

    const handleDateRangeChange = (start, end) => {
        setDateRange({ startDate: start, endDate: end });
    };

    // Функция для форматирования больших чисел с сокращениями
    const formatCompactNumber = (amount) => {
        const absAmount = Math.abs(amount);
        const sign = amount < 0 ? '-' : '';

        if (absAmount >= 1000000000) {
            return sign + (absAmount / 1000000000).toFixed(1) + 'B';
        }

        if (absAmount >= 1000000) {
            return sign + (absAmount / 1000000).toFixed(1) + 'M';
        }

        if (absAmount >= 100000) {
            return sign + (absAmount / 1000).toFixed(0) + 'K';
        }

        return sign + new Intl.NumberFormat('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(absAmount);
    };

    if (loading || !filteredData) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    const filteredIncome = filteredData?.incomes?.reduce((sum, i) => sum + Number(i.amount), 0) || 0;
    const filteredExpense = filteredData?.expenses?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
    const filteredBalance = filteredIncome - filteredExpense;

    const stats = [
        {
            title: 'Total Balance',
            value: filteredBalance,
            icon: Wallet,
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
            iconColor: 'text-blue-600'
        },
        {
            title: 'Total Income',
            value: filteredIncome,
            icon: TrendingUp,
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
            iconColor: 'text-green-600'
        },
        {
            title: 'Total Expenses',
            value: filteredExpense,
            icon: TrendingDown,
            bgColor: 'bg-red-50',
            textColor: 'text-red-600',
            iconColor: 'text-red-600'
        },
        {
            title: 'Savings Rate',
            value: filteredIncome > 0 ? ((filteredBalance / filteredIncome) * 100).toFixed(1) + '%' : '0%',
            icon: DollarSign,
            bgColor: 'bg-purple-50',
            textColor: 'text-purple-600',
            iconColor: 'text-purple-600',
            isPercentage: true
        }
    ];

    const pieData = [
        { name: 'Income', value: filteredIncome, color: '#10b981' },
        { name: 'Expenses', value: filteredExpense, color: '#ef4444' },
    ].filter(item => item.value > 0);

    const getCategoryData = () => {
        const expensesByCategory = {};
        const incomesByCategory = {};

        filteredData?.expenses?.forEach(exp => {
            const category = exp.categoryName || 'Uncategorized';
            expensesByCategory[category] = (expensesByCategory[category] || 0) + Number(exp.amount);
        });

        filteredData?.incomes?.forEach(inc => {
            const category = inc.categoryName || 'Uncategorized';
            incomesByCategory[category] = (incomesByCategory[category] || 0) + Number(inc.amount);
        });

        const categories = [...new Set([...Object.keys(expensesByCategory), ...Object.keys(incomesByCategory)])];

        return categories.map(category => ({
            category,
            expenses: expensesByCategory[category] || 0,
            income: incomesByCategory[category] || 0,
        }));
    };

    const getDailyTrend = () => {
        const dailyData = {};

        filteredData?.incomes?.forEach(inc => {
            const date = inc.date;
            if (!dailyData[date]) dailyData[date] = { date, income: 0, expenses: 0 };
            dailyData[date].income += Number(inc.amount);
        });

        filteredData?.expenses?.forEach(exp => {
            const date = exp.date;
            if (!dailyData[date]) dailyData[date] = { date, income: 0, expenses: 0 };
            dailyData[date].expenses += Number(exp.amount);
        });

        const result = Object.values(dailyData)
            .sort((a, b) => new Date(a.date) - new Date(b.date))
            .map(item => ({
                ...item,
                date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            }));

        return result.length > 0 ? result : [];
    };

    const getTopExpenseCategories = () => {
        const categoryTotals = {};

        filteredData?.expenses?.forEach(exp => {
            const category = exp.categoryName || 'Uncategorized';
            categoryTotals[category] = (categoryTotals[category] || 0) + Number(exp.amount);
        });

        return Object.entries(categoryTotals)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    };

    const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];

    const dailyTrendData = getDailyTrend();
    const categoryData = getCategoryData();
    const topExpenseCategories = getTopExpenseCategories();

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-2">Dashboard</h1>
                        <p className="text-lg text-gray-500">Financial overview and analytics</p>
                    </div>
                    <div className="lg:w-80">
                        <DateRangeFilter onFilterChange={handleDateRangeChange} />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div key={stat.title} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition">
                                <div className="flex items-center space-x-2 mb-3">
                                    <Icon className={stat.iconColor} size={16} />
                                    <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                                </div>
                                <div className="relative group">
                                    {stat.isPercentage ? (
                                        <p className={`text-3xl font-bold ${stat.textColor} transition-all`}>
                                            {stat.value}
                                        </p>
                                    ) : (
                                        <>
                                            <div className="flex items-baseline space-x-2">
                                                <p className={`text-3xl font-bold ${stat.textColor} transition-all`}>
                                                    {formatCompactNumber(stat.value)}
                                                </p>
                                                <span className={`text-base font-medium ${stat.textColor} opacity-70`}>
                                                    KGS
                                                </span>
                                            </div>
                                            {/* Tooltip для полного значения при наведении */}
                                            {Math.abs(stat.value) >= 100000 && (
                                                <div className="absolute left-0 top-full mt-2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                                                    {formatCurrency(stat.value)}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Trend</h2>
                        {dailyTrendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={dailyTrendData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} name="Income" />
                                    <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} name="Expenses" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-400">
                                No data for selected period
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Income vs Expenses</h2>
                        {pieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-400">
                                No data for selected period
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">By Category</h2>
                        {categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={categoryData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="category" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="income" fill="#10b981" name="Income" />
                                    <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-400">
                                No data for selected period
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Top Expense Categories</h2>
                        {topExpenseCategories.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={topExpenseCategories}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {topExpenseCategories.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[300px] flex items-center justify-center text-gray-400">
                                No expense data for selected period
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Recent Transactions</h2>
                        <Activity className="text-gray-400" size={24} />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Type</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dashboardData?.recentTransactions?.length > 0 ? (
                                dashboardData.recentTransactions.slice(0, 10).map((transaction) => (
                                    <tr key={`${transaction.type}-${transaction.id}`} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center space-x-3">
                                                <span className="text-2xl">{transaction.icon || '💰'}</span>
                                                <span className="font-medium text-gray-800">{transaction.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                                    transaction.type === 'income'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                    {transaction.type === 'income' ? 'Income' : 'Expense'}
                                                </span>
                                        </td>
                                        <td className="py-4 px-4 text-gray-600">{formatDate(transaction.date)}</td>
                                        <td className={`py-4 px-4 text-right font-bold ${
                                            transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-8 text-center text-gray-500">
                                        No transactions found
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Home;