import { useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

const DateRangeFilter = ({ onFilterChange }) => {
    const [selectedRange, setSelectedRange] = useState('this_month');
    const [customStart, setCustomStart] = useState('');
    const [customEnd, setCustomEnd] = useState('');
    const [showCustom, setShowCustom] = useState(false);

    const presetRanges = [
        { value: 'today', label: 'Today' },
        { value: 'yesterday', label: 'Yesterday' },
        { value: 'this_week', label: 'This Week' },
        { value: 'last_week', label: 'Last Week' },
        { value: 'this_month', label: 'This Month' },
        { value: 'last_month', label: 'Last Month' },
        { value: 'this_quarter', label: 'This Quarter' },
        { value: 'this_year', label: 'This Year' },
        { value: 'last_year', label: 'Last Year' },
        { value: 'all_time', label: 'All Time' },
        { value: 'custom', label: 'Custom Range' },
    ];

    const getDateRange = (range) => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const date = today.getDate();
        const day = today.getDay();

        let startDate, endDate;

        switch (range) {
            case 'today':
                startDate = endDate = today;
                break;
            case 'yesterday':
                startDate = endDate = new Date(year, month, date - 1);
                break;
            case 'this_week':
                startDate = new Date(year, month, date - day);
                endDate = today;
                break;
            case 'last_week':
                startDate = new Date(year, month, date - day - 7);
                endDate = new Date(year, month, date - day - 1);
                break;
            case 'this_month':
                startDate = new Date(year, month, 1);
                endDate = today;
                break;
            case 'last_month':
                startDate = new Date(year, month - 1, 1);
                endDate = new Date(year, month, 0);
                break;
            case 'this_quarter':
                const quarter = Math.floor(month / 3);
                startDate = new Date(year, quarter * 3, 1);
                endDate = today;
                break;
            case 'this_year':
                startDate = new Date(year, 0, 1);
                endDate = today;
                break;
            case 'last_year':
                startDate = new Date(year - 1, 0, 1);
                endDate = new Date(year - 1, 11, 31);
                break;
            case 'all_time':
                startDate = new Date(2000, 0, 1);
                endDate = today;
                break;
            default:
                startDate = new Date(year, month, 1);
                endDate = today;
        }

        return {
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0]
        };
    };

    const handleRangeChange = (range) => {
        setSelectedRange(range);
        setShowCustom(range === 'custom');

        if (range !== 'custom') {
            const dates = getDateRange(range);
            onFilterChange(dates.startDate, dates.endDate);
        }
    };

    const handleCustomApply = () => {
        if (customStart && customEnd) {
            onFilterChange(customStart, customEnd);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-4 border border-gray-100">
            <div className="flex items-center space-x-2 mb-3">
                <Calendar className="text-blue-600" size={20} />
                <span className="font-semibold text-gray-800">Date Range</span>
            </div>

            <div className="relative">
                <select
                    value={selectedRange}
                    onChange={(e) => handleRangeChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                    {presetRanges.map((range) => (
                        <option key={range.value} value={range.value}>
                            {range.label}
                        </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
            </div>

            {showCustom && (
                <div className="mt-3 space-y-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={customStart}
                            onChange={(e) => setCustomStart(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={customEnd}
                            onChange={(e) => setCustomEnd(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={handleCustomApply}
                        disabled={!customStart || !customEnd}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Apply Custom Range
                    </button>
                </div>
            )}
        </div>
    );
};

export default DateRangeFilter;