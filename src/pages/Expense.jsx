import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { toast } from '../components/Toaster';
import { Plus, Trash2, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Expense = () => {
    const [expenses, setExpenses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        icon: '🛒',
        categoryId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
    }, []);

    const fetchExpenses = async () => {
        try {
            const response = await api.get('/expenses');
            setExpenses(response.data);
        } catch (error) {
            toast.error('Expense loading error');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories/expense');
            setCategories(response.data);
        } catch (error) {
            toast.error('Categories loading error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/expenses', {
                ...formData,
                amount: parseFloat(formData.amount),
            });
            toast.success('Expense added successfully');
            setShowModal(false);
            setFormData({
                name: '',
                icon: '🛒',
                categoryId: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
            });
            fetchExpenses();
        } catch (error) {
            toast.error('Expense adding error');
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Delete this expense?')) {
            try {
                await api.delete(`/expenses/${id}`);
                toast.success('Expense deleted');
                fetchExpenses();
            } catch (error) {
                toast.error('Expense delete error');
            }
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setShowEmojiPicker(false);
        setFormData({
            name: '',
            icon: '🛒',
            categoryId: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    const totalExpense = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

    // Prepare chart data
    const getChartData = () => {
        const sortedExpenses = [...expenses].sort((a, b) => new Date(a.date) - new Date(b.date));

        return sortedExpenses.map(expense => ({
            date: new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: formatDate(expense.date),
            amount: Number(expense.amount),
            name: expense.name,
            category: expense.categoryName,
            icon: expense.icon
        }));
    };

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4">
                    <p className="font-semibold text-gray-800 flex items-center space-x-2">
                        <span className="text-2xl">{data.icon}</span>
                        <span>{data.name}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Category: {data.category}</p>
                    <p className="text-sm text-gray-600">Date: {data.fullDate}</p>
                    <p className="text-lg font-bold text-red-600 mt-2">{formatCurrency(data.amount)}</p>
                </div>
            );
        }
        return null;
    };

    const chartData = getChartData();

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Expenses</h1>
                        <p className="text-gray-500 mt-1">Managing your expenses</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
                    >
                        <Plus size={20} />
                        <span>Add expense</span>
                    </button>
                </div>

                {/* Total Expense Card */}
                <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg p-6 text-white">
                    <p className="text-red-100 text-sm font-medium">Total expenses this month</p>
                    <p className="text-4xl font-bold mt-2">{formatCurrency(totalExpense)}</p>
                </div>

                {/* Expense Chart */}
                {chartData.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">Expense Trend</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#ef4444"
                                    strokeWidth={2}
                                    dot={{ fill: '#ef4444', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* Expenses List */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100">
                    <div className="p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">List of expenses</h2>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                            </div>
                        ) : expenses.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Name</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Amount</th>
                                        <th className="text-center py-3 px-4 text-sm font-semibold text-gray-600">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {expenses.map((expense) => (
                                        <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl">{expense.icon || '🛒'}</span>
                                                    <span className="font-medium text-gray-800">{expense.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-gray-600">{expense.categoryName}</td>
                                            <td className="py-4 px-4 text-gray-600">{formatDate(expense.date)}</td>
                                            <td className="py-4 px-4 text-right font-bold text-red-600">
                                                {formatCurrency(expense.amount)}
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500">No expenses for this month</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Expense Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Add expense</h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Groceries"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Icon
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg text-left flex items-center space-x-2"
                                    >
                                        <span className="text-2xl">{formData.icon}</span>
                                        <span className="text-gray-500">Choose icon</span>
                                    </button>
                                    {showEmojiPicker && (
                                        <div className="absolute z-10 mt-2">
                                            <EmojiPicker
                                                onEmojiClick={(emojiData) => {
                                                    setFormData({ ...formData, icon: emojiData.emoji });
                                                    setShowEmojiPicker(false);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    <option value="">Choose category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Amount
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                            >
                                Add expense
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Expense;