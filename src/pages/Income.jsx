import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { toast } from '../components/Toaster';
import { Plus, Trash2, X } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Income = () => {
    const [incomes, setIncomes] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: '💰',
        categoryId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        fetchIncomes();
        fetchCategories();
    }, []);

    const fetchIncomes = async () => {
        try {
            const response = await api.get('/incomes');
            setIncomes(response.data);
        } catch (error) {
            toast.error('Error loading incomes');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories/income');
            setCategories(response.data);
        } catch (error) {
            toast.error('Category loading error');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        try {
            await api.post('/incomes', {
                ...formData,
                amount: parseFloat(formData.amount),
            });
            toast.success('Income added successfully');
            setShowModal(false);
            setFormData({
                name: '',
                icon: '💰',
                categoryId: '',
                amount: '',
                date: new Date().toISOString().split('T')[0],
            });
            fetchIncomes();
        } catch (error) {
            toast.error('Income adding error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (deletingId) return;
        if (!confirm('Delete this income?')) return;

        setDeletingId(id);
        try {
            await api.delete(`/incomes/${id}`);
            toast.success('Income deleted successfully');
            fetchIncomes();
        } catch (error) {
            toast.error('Income deleting error');
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
            icon: '💰',
            categoryId: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
        });
    };

    const totalIncome = incomes.reduce((sum, income) => sum + Number(income.amount), 0);

    const getChartData = () => {
        const sortedIncomes = [...incomes].sort((a, b) => new Date(a.date) - new Date(b.date));

        return sortedIncomes.map(income => ({
            date: new Date(income.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            fullDate: formatDate(income.date),
            amount: Number(income.amount),
            name: income.name,
            category: income.categoryName,
            icon: income.icon
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
                    <p className="text-lg font-bold text-green-600 mt-2">{formatCurrency(data.amount)}</p>
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Incomes</h1>
                        <p className="text-gray-500 mt-1 text-sm sm:text-base">Managing your incomes</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={submitting}
                        className="flex items-center justify-center space-x-2 bg-green-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-green-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={20} />
                        <span>Add income</span>
                    </button>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg p-4 sm:p-6 text-white">
                    <p className="text-green-100 text-xs sm:text-sm font-medium">Total income this month</p>
                    <p className="text-3xl sm:text-4xl font-bold mt-2">{formatCurrency(totalIncome)}</p>
                </div>

                {chartData.length > 0 && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Income Trend</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ fill: '#10b981', r: 5 }}
                                    activeDot={{ r: 7 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-md border border-gray-100">
                    <div className="p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Income list</h2>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        ) : incomes.length > 0 ? (
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
                                    {incomes.map((income) => (
                                        <tr key={income.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 sm:py-4 px-2 sm:px-4">
                                                <div className="flex items-center space-x-2 sm:space-x-3">
                                                    <span className="text-xl sm:text-2xl">{income.icon || '💰'}</span>
                                                    <span className="font-medium text-gray-800 text-xs sm:text-base">{income.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-600 text-xs sm:text-base">{income.categoryName}</td>
                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-gray-600 text-xs sm:text-base">{formatDate(income.date)}</td>
                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-right font-bold text-green-600 text-xs sm:text-base">
                                                {formatCurrency(income.amount)}
                                            </td>
                                            <td className="py-3 sm:py-4 px-2 sm:px-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(income.id)}
                                                    disabled={deletingId === income.id}
                                                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {deletingId === income.id ? (
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
                                <p className="text-gray-500 text-sm">No income for this month</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-gradient-to-br from-green-900/20 via-emerald-900/20 to-teal-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Add income</h2>
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    disabled={submitting}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="Salary"
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
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category
                                </label>
                                <select
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    required
                                    disabled={submitting}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    disabled={submitting}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="1000"
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
                                    disabled={submitting}
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-green-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition text-sm sm:text-base mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Adding...</span>
                                    </>
                                ) : (
                                    <span>Add income</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Income;