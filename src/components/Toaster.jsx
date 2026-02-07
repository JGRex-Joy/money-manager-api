import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

let addToastFn;

export const toast = {
    success: (message) => addToastFn?.({ type: 'success', message }),
    error: (message) => addToastFn?.({ type: 'error', message }),
    info: (message) => addToastFn?.({ type: 'info', message }),
};

const Toaster = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        addToastFn = (toast) => {
            const id = Date.now();
            setToasts((prev) => [...prev, { ...toast, id }]);
            setTimeout(() => {
                setToasts((prev) => prev.filter((t) => t.id !== id));
            }, 5000);
        };
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="text-green-500" size={24} />;
            case 'error':
                return <XCircle className="text-red-500" size={24} />;
            case 'info':
                return <AlertCircle className="text-blue-500" size={24} />;
            default:
                return null;
        }
    };

    const getStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border-green-200';
            case 'error':
                return 'bg-red-50 border-red-200';
            case 'info':
                return 'bg-blue-50 border-blue-200';
            default:
                return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md animate-slide-in ${getStyles(
                        toast.type
                    )}`}
                >
                    {getIcon(toast.type)}
                    <p className="flex-1 text-sm font-medium text-gray-800">{toast.message}</p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={18} />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default Toaster;