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
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);
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
        if (submitting) return;

        setSubmitting(true);
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteClick = (category) => {
        setCategoryToDelete(category);
        setShowDeleteWarning(true);
    };

    const confirmDelete = async () => {
        if (!categoryToDelete || deleting) return;

        setDeleting(true);
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
        } finally {
            setDeleting(false);
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
        if (submitting) return;
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
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Categories</h1>
                        <p className="text-gray-500 mt-1 text-sm sm:text-base">
                            Management of income and expense categories</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        disabled={submitting}
                        className="flex items-center justify-center space-x-2 bg-purple-600 text-white px-4 sm:px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Plus size={20} />
                        <span>Create category</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
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
                                        className="flex items-center justify-between p-3 sm:p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
                                    >
                                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                            <span className="text-2xl sm:text-3xl flex-shrink-0">{category.icon}</span>
                                            <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{category.name}</p>
                                        </div>
                                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                disabled={submitting}
                                                className="p-2 text-green-600 hover:bg-green-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(category)}
                                                disabled={deleting}
                                                className="p-2 text-red-600 hover:bg-red-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                Income category not found
                            </div>
                        )}
                    </div>

                    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
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
                                        className="flex items-center justify-between p-3 sm:p-4 bg-red-50 rounded-lg hover:bg-red-100 transition"
                                    >
                                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                                            <span className="text-2xl sm:text-3xl flex-shrink-0">{category.icon}</span>
                                            <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">{category.name}</p>
                                        </div>
                                        <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                                            <button
                                                onClick={() => openEditModal(category)}
                                                disabled={submitting}
                                                className="p-2 text-red-600 hover:bg-red-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Edit2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(category)}
                                                disabled={deleting}
                                                className="p-2 text-red-600 hover:bg-red-200 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                Expense categories not found
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showDeleteWarning && categoryToDelete && (
                <div className="fixed inset-0 bg-gradient-to-br from-red-900/20 via-purple-900/20 to-blue-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 animate-scale-in">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertTriangle className="text-red-600" size={20} />
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Warning!</h2>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <p className="text-gray-700 text-sm sm:text-base">
                                You are about to delete the category{' '}
                                <span className="font-bold">"{categoryToDelete.name}"</span>
                            </p>

                            <div className="bg-red-50 border-l-4 border-red-600 p-3 sm:p-4 rounded">
                                <p className="text-red-800 font-semibold mb-2 text-sm sm:text-base">
                                    ⚠️ This will permanently delete:
                                </p>
                                <ul className="text-red-700 space-y-1 ml-4 text-xs sm:text-sm">
                                    <li>• The category itself</li>
                                    <li>• ALL {categoryToDelete.type === 'income' ? 'income' : 'expense'} records using this category</li>
                                    <li className="font-bold mt-2">• This action CANNOT be undone!</li>
                                </ul>
                            </div>

                            <p className="text-gray-600 text-xs sm:text-sm">
                                Are you absolutely sure you want to continue?
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 mt-4 sm:mt-6">
                            <button
                                onClick={() => {
                                    if (!deleting) {
                                        setShowDeleteWarning(false);
                                        setCategoryToDelete(null);
                                    }
                                }}
                                disabled={deleting}
                                className="flex-1 bg-gray-200 text-gray-700 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-300 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                disabled={deleting}
                                className="flex-1 bg-red-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-red-700 transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {deleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Deleting...</span>
                                    </>
                                ) : (
                                    <span>Yes, Delete Everything</span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto animate-scale-in">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                                {editMode ? 'Edit category' : 'Create category'}
                            </h2>
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
                                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
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
                                        disabled={submitting}
                                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-left flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="text-2xl sm:text-3xl">{formData.icon}</span>
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
                                    Category type
                                </label>
                                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, type: 'income' })}
                                        disabled={submitting}
                                        className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
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
                                        disabled={submitting}
                                        className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed ${
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
                                disabled={submitting}
                                className="w-full bg-purple-600 text-white py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-purple-700 transition text-sm sm:text-base mt-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                            >
                                {submitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>{editMode ? 'Updating...' : 'Creating...'}</span>
                                    </>
                                ) : (
                                    <span>{editMode ? 'Update category' : 'Create category'}</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default Category;