import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import { toast } from '../components/Toaster';
import { Plus, Edit2, Trash2, X, FolderOpen, AlertTriangle } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

const Category = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showDeleteWarning, setShowDeleteWarning] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        icon: '📁',
        type: 'expense',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            toast.error('Expense loading error');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode && currentCategory) {
                await api.put(`/categories/${currentCategory.id}`, formData);
                toast.success('Category updated');
            } else {
                await api.post('/categories', formData);
                toast.success('Category created successfully');
            }
            closeModal();
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Category saving failed');
        }
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setShowDeleteWarning(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete) return;

        try {
            await api.delete(`/categories/${categoryToDelete.id}`);
            toast.success('Category and all related transactions deleted');
            setShowDeleteWarning(false);
            setCategoryToDelete(null);
            fetchCategories();
        } catch (error) {
            const message = error.response?.data?.message || 'Failed to delete category';
            toast.error(message);
            setShowDeleteWarning(false);
            setCategoryToDelete(null);
        }
    };

    const openEditModal = (category) => {
        setEditMode(true);
        setCurrentCategory(category);
        setFormData({
            name: category.name,
            icon: category.icon,
            type: category.type,
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setCurrentCategory(null);
        setShowEmojiPicker(false);
        setFormData({
            name: '',
            icon: '📁',
            type: 'expense',
        });
    };

    const incomeCategories = categories.filter(cat => cat.type === 'income');
    const expenseCategories = categories.filter(cat => cat.type === 'expense');

    return (
        <Layout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
                        <p className="text-gray-500 mt-1">
                            Management of income and expense categories</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
                    >
                        <Plus size={20} />
                        <span>Create category</span>
                    </button>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Income Categories */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <FolderOpen className="text-green-600" size={18} />
                            </div>
                            <span>Income categories</span>
                            <span className="text-sm text-gray-500">({incomeCategories.length})</span>
                        </h2>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                            </div>
                        ) : incomeCategories.length > 0 ? (
                            <div className="space-y-2">
                                {incomeCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-3xl">{category.icon}</span>
                                            <p className="font-semibold text-gray-800">{category.name}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="p-2 text-green-600 hover:bg-green-200 rounded-lg transition"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(category)}
                                                className="p-2 text-red-600 hover:bg-red-200 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Income category not found
                            </div>
                        )}
                    </div>

                    {/* Expense Categories */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                <FolderOpen className="text-red-600" size={18} />
                            </div>
                            <span>Expense categories</span>
                            <span className="text-sm text-gray-500">({expenseCategories.length})</span>
                        </h2>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                            </div>
                        ) : expenseCategories.length > 0 ? (
                            <div className="space-y-2">
                                {expenseCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="flex items-center justify-between p-4 bg-red-50 rounded-lg hover:bg-red-100 transition"
                                    >
                                        <div className="flex items-center space-x-3">
                                            <span className="text-3xl">{category.icon}</span>
                                            <p className="font-semibold text-gray-800">{category.name}</p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                className="p-2 text-red-600 hover:bg-red-200 rounded-lg transition"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(category)}
                                                className="p-2 text-red-600 hover:bg-red-200 rounded-lg transition"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                Expense categories not found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Warning Modal */}
            {showDeleteWarning && categoryToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="text-red-600" size={24} />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800">Warning!</h2>
                        </div>

                        <div className="space-y-4">
                            <p className="text-gray-700">
                                You are about to delete the category{' '}
                                <span className="font-bold">"{categoryToDelete.name}"</span>
                            </p>

                            <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
                                <p className="text-red-800 font-semibold mb-2">
                                    ⚠️ This will permanently delete:
                                </p>
                                <ul className="text-red-700 space-y-1 ml-4">
                                    <li>• The category itself</li>
                                    <li>• ALL {categoryToDelete.type === 'income' ? 'income' : 'expense'} records using this category</li>
                                    <li className="font-bold mt-2">• This action CANNOT be undone!</li>
                                </ul>
                            </div>

                            <p className="text-gray-600 text-sm">
                                Are you absolutely sure you want to continue?
                            </p>
                        </div>

                        <div className="flex space-x-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowDeleteWarning(false);
                                    setCategoryToDelete(null);
                                }}
                                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition"
                            >
                                Yes, Delete Everything
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">
                                {editMode ? 'Edit category' : 'Create category'}
                            </h2>
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Category name"
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
                                        <span className="text-3xl">{formData.icon}</span>
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
                                    Category type
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'income' })}
                                        className={`py-3 px-4 rounded-lg font-medium transition ${
                                            formData.type === 'income'
                                                ? 'bg-green-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Income
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'expense' })}
                                        className={`py-3 px-4 rounded-lg font-medium transition ${
                                            formData.type === 'expense'
                                                ? 'bg-red-600 text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    >
                                        Expense
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                            >
                                {editMode ? 'Update category' : 'Create category'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Category;