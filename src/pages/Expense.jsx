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
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
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
        if (submitting) return;

        setSubmitting(true);
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (deletingId) return;
        if (!confirm('Delete this expense?')) return;

        setDeletingId(id);
        try {
            await api.delete(`/expenses/${id}`);
            toast.success('Expense deleted');
            fetchExpenses();
        } catch (error) {
            toast.error('Expense delete error');
        } finally {
            setDeletingId(null);
        }
    };

    const closeModal = () => {
        if (submitting) return;
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Expenses</h1>
                        <p className="text-gray-500 mt-1 text-sm sm:text-base">Managing your expenses</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={submitting}
                        className="flex items-center justify-center space-x-2 bg-red-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-red-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={20} />
                        <span>Add expense</span>
                    </button>
                </div>

                <div className="bg-gradient-to-r from-red-500 to-pink-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
                    <p className="text-red-100 text-xs sm:text-sm font-medium">Total expenses this month</p>
                    <p className="text-3xl sm:text-4xl font-bold mt-2">{formatCurrency(totalExpense)}</p>
                </div>

                {chartData.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Expense Trend</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
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

                <div className="bg-white rounded-xl shadow-md border border-gray-100">
                    <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">List of expenses</h2>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                            </div>
                        ) : expenses.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-600">Name</th>
                                        <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-600">Category</th>
                                        <th className="text-left py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-600">Date</th>
                                        <th className="text-right py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-600">Amount</th>
                                        <th className="text-center py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-gray-600">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {expenses.map((expense) => (
                                        <tr key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                                                <div className="flex items-center space-x-2 sm:space-x-3">
                                                    <span className="text-xl sm:text-2xl">{expense.icon || '🛒'}</span>
                                                    <span className="font-medium text-gray-800 text-xs sm:text-base">{expense.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-600 text-xs sm:text-base">{expense.categoryName}</td>
                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-600 text-xs sm:text-base">{formatDate(expense.date)}</td>
                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-right font-bold text-red-600 text-xs sm:text-base">
                                                {formatCurrency(expense.amount)}
                                            </td>
                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(expense.id)}
                                                    disabled={deletingId === expense.id}
                                                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deletingId === expense.id ? (
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                                    ) : (
                                                        <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-sm">No expenses for this month</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gradient-to-br from-red-900/20 via-pink-900/20 to-rose-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Add expense</h2>
                            <button
                                onClick={closeModal}
                                disabled={submitting}
                                className="text-gray-400 hover:text-gray-600 p-1 disabled:opacity-50"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    disabled={submitting}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Groceries"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        disabled={submitting}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-left flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="text-xl sm:text-2xl">{formData.icon}</span>
                                        <span className="text-gray-500 text-sm sm:text-base">Choose icon</span>
                                    </button>
                                    {showEmojiPicker && !submitting && (
                                        <div className="absolute z-10 mt-2 left-0 right-0">
                                            <EmojiPicker
                                                onEmojiClick={(emojiData) => {
                                                    setFormData({ ...formData, icon: emojiData.emoji });
                                                    setShowEmojiPicker(false);
                                                }}
                                                width="100%"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    required
                                    disabled={submitting}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <option value="">Choose category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                    disabled={submitting}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    disabled={submitting}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-red-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition text-sm sm:text-base mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <span>Add expense</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Expense;