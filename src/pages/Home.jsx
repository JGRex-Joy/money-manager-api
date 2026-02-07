import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { toast } from '../components/Toaster';
import { Wallet, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Home = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            toast.error('Ошибка загрузки данных');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    const stats = [
        {
            title: 'Общий баланс',
            value: dashboardData?.totalBalance || 0,
            icon: Wallet,
            color: 'blue',
            bgColor: 'bg-blue-50',
            textColor: 'text-blue-600',
        },
        {
            title: 'Доходы',
            value: dashboardData?.totalIncome || 0,
            icon: TrendingUp,
            color: 'green',
            bgColor: 'bg-green-50',
            textColor: 'text-green-600',
        },
        {
            title: 'Расходы',
            value: dashboardData?.totalExpense || 0,
            icon: TrendingDown,
            color: 'red',
            bgColor: 'bg-red-50',
            textColor: 'text-red-600',
        },
    ];

    // Подготовка данных для графиков
    const pieData = [
        { name: 'Доходы', value: Number(dashboardData?.totalIncome || 0), color: '#10b981' },
        { name: 'Расходы', value: Number(dashboardData?.totalExpense || 0), color: '#ef4444' },
    ];

    // Группировка транзакций по категориям для bar chart
    const getCategoryData = () => {
        const expensesByCategory = {};
        const incomesByCategory = {};

        dashboardData?.recent5Expenses?.forEach(exp => {
            const category = exp.categoryName;
            expensesByCategory[category] = (expensesByCategory[category] || 0) + Number(exp.amount);
        });

        dashboardData?.recent5Incomes?.forEach(inc => {
            const category = inc.categoryName;
            incomesByCategory[category] = (incomesByCategory[category] || 0) + Number(inc.amount);
        });

        const categories = [...new Set([...Object.keys(expensesByCategory), ...Object.keys(incomesByCategory)])];

        return categories.map(category => ({
            category,
            расходы: expensesByCategory[category] || 0,
            доходы: incomesByCategory[category] || 0,
        }));
    };

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Панель управления</h1>
                    <p className="text-gray-500 mt-1">Обзор ваших финансов</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat) => {
                        const Icon = stat.icon;
                        return (
                            <div key={stat.title} className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                                        <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                                            {formatCurrency(stat.value)}
                                        </p>
                                    </div>
                                    <div className={`${stat.bgColor} p-4 rounded-xl`}>
                                        <Icon className={stat.textColor} size={32} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Pie Chart */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Распределение финансов</h2>
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
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">По категориям</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={getCategoryData()}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" />
                                <YAxis />
                                <Tooltip formatter={(value) => formatCurrency(value)} />
                                <Legend />
                                <Bar dataKey="доходы" fill="#10b981" />
                                <Bar dataKey="расходы" fill="#ef4444" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Последние транзакции</h2>
                        <Activity className="text-gray-400" size={24} />
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Название</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Тип</th>
                                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Дата</th>
                                <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Сумма</th>
                            </tr>
                            </thead>
                            <tbody>
                            {dashboardData?.recentTransactions?.length > 0 ? (
                                dashboardData.recentTransactions.map((transaction) => (
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
                                                    {transaction.type === 'income' ? 'Доход' : 'Расход'}
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
                                        Нет транзакций
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