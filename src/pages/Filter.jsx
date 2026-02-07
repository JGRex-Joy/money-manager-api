import { useState } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import { toast } from '../components/Toaster';
import { Search, Calendar, SortAsc, SortDesc } from 'lucide-react';

const Filter = () => {
    const [filterData, setFilterData] = useState({
        type: 'expense',
        startDate: '',
        endDate: '',
        keyword: '',
        sortField: 'date',
        sortOrder: 'desc',
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        setHasSearched(true);

        try {
            const response = await api.post('/filter', filterData);
            setResults(response.data);
            toast.success(`Найдено ${response.data.length} результатов`);
        } catch (error) {
            toast.error('Ошибка поиска');
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const totalAmount = results.reduce((sum, item) => sum + Number(item.amount), 0);

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Фильтр транзакций</h1>
                    <p className="text-gray-500 mt-1">Поиск и фильтрация доходов и расходов</p>
                </div>

                {/* Filter Form */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                    <form onSubmit={handleSearch} className="space-y-6">
                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                                Тип транзакции
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setFilterData({ ...filterData, type: 'income' })}
                                    className={`py-3 px-4 rounded-lg font-medium transition ${
                                        filterData.type === 'income'
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Доходы
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFilterData({ ...filterData, type: 'expense' })}
                                    className={`py-3 px-4 rounded-lg font-medium transition ${
                                        filterData.type === 'expense'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                                >
                                    Расходы
                                </button>
                            </div>
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Дата начала
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="date"
                                        value={filterData.startDate}
                                        onChange={(e) => setFilterData({ ...filterData, startDate: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Дата окончания
                                </label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                    <input
                                        type="date"
                                        value={filterData.endDate}
                                        onChange={(e) => setFilterData({ ...filterData, endDate: e.target.value })}
                                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Keyword Search */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Поиск по названию
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    value={filterData.keyword}
                                    onChange={(e) => setFilterData({ ...filterData, keyword: e.target.value })}
                                    placeholder="Введите название..."
                                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Sort Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Сортировать по
                                </label>
                                <select
                                    value={filterData.sortField}
                                    onChange={(e) => setFilterData({ ...filterData, sortField: e.target.value })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="date">Дате</option>
                                    <option value="amount">Сумме</option>
                                    <option value="name">Названию</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Порядок
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setFilterData({ ...filterData, sortOrder: 'asc' })}
                                        className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition ${
                                            filterData.sortOrder === 'asc'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <SortAsc size={18} />
                                        <span>Возр.</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFilterData({ ...filterData, sortOrder: 'desc' })}
                                        className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition ${
                                            filterData.sortOrder === 'desc'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        <SortDesc size={18} />
                                        <span>Убыв.</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            <Search size={20} />
                            <span>{loading ? 'Поиск...' : 'Применить фильтр'}</span>
                        </button>
                    </form>
                </div>

                {/* Results */}
                {hasSearched && (
                    <div className="bg-white rounded-xl shadow-md border border-gray-100">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-800">
                                    Результаты поиска ({results.length})
                                </h2>
                                {results.length > 0 && (
                                    <div className={`text-xl font-bold ${
                                        filterData.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        Всего: {formatCurrency(totalAmount)}
                                    </div>
                                )}
                            </div>

                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Название</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Категория</th>
                                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Дата</th>
                                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-600">Сумма</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {results.map((item) => (
                                            <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-2xl">{item.icon || '💰'}</span>
                                                        <span className="font-medium text-gray-800">{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-gray-600">{item.categoryName}</td>
                                                <td className="py-4 px-4 text-gray-600">{formatDate(item.date)}</td>
                                                <td className={`py-4 px-4 text-right font-bold ${
                                                    filterData.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {formatCurrency(item.amount)}
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500 text-lg">Нет результатов по вашему запросу</p>
                                    <p className="text-gray-400 text-sm mt-2">Попробуйте изменить параметры фильтра</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Filter;