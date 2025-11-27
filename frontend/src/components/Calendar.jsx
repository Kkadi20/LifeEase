import { useState } from 'react';

const Calendar = ({ tasks = [], events = [], moods = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);
    const [showPreview, setShowPreview] = useState(false);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const getDataForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        
        const dayTasks = tasks.filter(t => t.date.split('T')[0] === dateStr);
        const dayEvents = events.filter(e => e.date.split('T')[0] === dateStr);
        const dayMood = moods.find(m => m.createdAt.split('T')[0] === dateStr);

        return { tasks: dayTasks, events: dayEvents, mood: dayMood };
    };

    const handleDateClick = (date) => {
        const data = getDataForDate(date);
        if (data.tasks.length > 0 || data.events.length > 0 || data.mood) {
            setSelectedDate({ date, data });
            setShowPreview(true);
        }
    };

    const closePreview = () => {
        setShowPreview(false);
        setSelectedDate(null);
    };

    const renderCalendar = () => {
        const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Empty cells before first day
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        // Days of month
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const isToday = date.toDateString() === today.toDateString();
            const { tasks: dayTasks, events: dayEvents, mood: dayMood } = getDataForDate(date);
            
            const hasTasks = dayTasks.length > 0;
            const hasEvents = dayEvents.length > 0;
            const hasMood = !!dayMood;
            const hasActivity = hasTasks || hasEvents || hasMood;

            days.push(
                <div
                    key={day}
                    onClick={() => handleDateClick(date)}
                    className={`calendar-day ${isToday ? 'today' : ''} ${
                        hasActivity ? 'has-activity clickable' : ''
                    }`}
                >
                    <div className="day-number">{day}</div>
                    <div className="activity-indicators">
                        {hasTasks && <span className="indicator task-indicator" title="Tasks">•</span>}
                        {hasEvents && <span className="indicator event-indicator" title="Events">•</span>}
                        {hasMood && (
                            <span className="indicator mood-indicator" title="Mood logged">
                                {dayMood.mood === 'great' && '😄'}
                                {dayMood.mood === 'good' && '😊'}
                                {dayMood.mood === 'okay' && '😐'}
                                {dayMood.mood === 'bad' && '😔'}
                                {dayMood.mood === 'terrible' && '😢'}
                            </span>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const moodEmojis = {
        great: '😄',
        good: '😊',
        okay: '😐',
        bad: '😔',
        terrible: '😢'
    };

    return (
        <div className="calendar-container bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            {/* Calendar Header */}
            <div className="calendar-header flex justify-between items-center mb-6">
                <button
                    onClick={previousMonth}
                    className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                >
                    ◀
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                    onClick={nextMonth}
                    className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                >
                    ▶
                </button>
            </div>

            {/* Weekday Headers */}
            <div className="calendar-weekdays grid grid-cols-7 gap-2 mb-3">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-gray-700 dark:text-gray-300 text-sm py-2">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div className="calendar-grid grid grid-cols-7 gap-2 mb-6">
                {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="calendar-legend flex flex-wrap gap-4 text-sm border-t dark:border-gray-700 pt-4">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-600 dark:text-gray-400">Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-gray-600 dark:text-gray-400">Events</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-lg">😊</span>
                    <span className="text-gray-600 dark:text-gray-400">Mood Logged</span>
                </div>
            </div>

            {/* Date Preview Popup */}
            {showPreview && selectedDate && (
                <div className="preview-overlay fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={closePreview}>
                    <div className="preview-popup bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                        {/* Popup Header */}
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                    📅 {selectedDate.date.toLocaleDateString('en-US', { 
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </h3>
                            </div>
                            <button
                                onClick={closePreview}
                                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-2xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Tasks Section */}
                        {selectedDate.data.tasks.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    📋 Tasks ({selectedDate.data.tasks.length})
                                </h4>
                                <ul className="space-y-2">
                                    {selectedDate.data.tasks.map((task) => (
                                        <li key={task._id} className="flex items-start gap-2 text-sm">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                                task.priority === 'high' ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300' :
                                                task.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' :
                                                'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                                            }`}>
                                                {task.priority}
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300">{task.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Events Section */}
                        {selectedDate.data.events.length > 0 && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    📅 Events ({selectedDate.data.events.length})
                                </h4>
                                <ul className="space-y-2">
                                    {selectedDate.data.events.map((event) => (
                                        <li key={event._id} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                                            <span>•</span>
                                            <span>{event.title}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Mood Section */}
                        {selectedDate.data.mood && (
                            <div className="mb-4">
                                <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Mood
                                </h4>
                                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                                    <span className="text-3xl">{moodEmojis[selectedDate.data.mood.mood]}</span>
                                    <div>
                                        <p className="text-gray-800 dark:text-white font-medium capitalize">
                                            {selectedDate.data.mood.mood}
                                        </p>
                                        {selectedDate.data.mood.note && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {selectedDate.data.mood.note}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Close Button */}
                        <button
                            onClick={closePreview}
                            className="w-full mt-4 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .calendar-day {
                    aspect-ratio: 1;
                    border: 2px solid #e5e7eb;
                    padding: 8px;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    min-height: 80px;
                    transition: all 0.2s;
                    position: relative;
                }

                .dark .calendar-day {
                    border-color: #374151;
                }

                .calendar-day.empty {
                    background: transparent;
                    border: none;
                }

                .calendar-day.today {
                    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
                    border-color: #3b82f6;
                    font-weight: bold;
                    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
                }

                .dark .calendar-day.today {
                    background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
                    border-color: #60a5fa;
                }

                .calendar-day.clickable {
                    cursor: pointer;
                }

                .calendar-day.clickable:hover {
                    background: #f9fafb;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    border-color: #6366f1;
                }

                .dark .calendar-day.clickable:hover {
                    background: #374151;
                    border-color: #818cf8;
                }

                .day-number {
                    font-size: 16px;
                    font-weight: 600;
                    color: #1f2937;
                }

                .dark .day-number {
                    color: #f9fafb;
                }

                .activity-indicators {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                    flex-wrap: wrap;
                    justify-content: center;
                    margin-top: 4px;
                }

                .indicator {
                    font-size: 16px;
                }

                .task-indicator {
                    color: #3b82f6;
                    font-size: 20px;
                }

                .event-indicator {
                    color: #10b981;
                    font-size: 20px;
                }

                .mood-indicator {
                    font-size: 18px;
                }

                .preview-overlay {
                    animation: fadeIn 0.2s ease-out;
                }

                .preview-popup {
                    animation: slideUp 0.3s ease-out;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from {
                        transform: translateY(20px);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
            `}</style>
        </div>
    );
};

export default Calendar;
