import { useState } from 'react';

const Calendar = ({ tasks = [], events = [], moods = [] }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const getActivityForDate = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        
        const hasTasks = tasks.some(t => t.date.split('T')[0] === dateStr);
        const hasEvents = events.some(e => e.date.split('T')[0] === dateStr);
        const hasMoods = moods.some(m => m.createdAt.split('T')[0] === dateStr);

        return { hasTasks, hasEvents, hasMoods };
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
            const { hasTasks, hasEvents, hasMoods } = getActivityForDate(date);

            days.push(
                <div
                    key={day}
                    className={`calendar-day ${isToday ? 'today' : ''} ${
                        hasTasks || hasEvents || hasMoods ? 'has-activity' : ''
                    }`}
                >
                    <div className="day-number">{day}</div>
                    <div className="activity-dots">
                        {hasTasks && <span className="dot task-dot" title="Has tasks">📋</span>}
                        {hasEvents && <span className="dot event-dot" title="Has events">📅</span>}
                        {hasMoods && <span className="dot mood-dot" title="Mood logged">😊</span>}
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

    return (
        <div className="calendar-container bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="calendar-header flex justify-between items-center mb-4">
                <button
                    onClick={previousMonth}
                    className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600"
                >
                    ←
                </button>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                    onClick={nextMonth}
                    className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600"
                >
                    →
                </button>
            </div>

            <div className="calendar-weekdays grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-semibold text-gray-600 dark:text-gray-400 text-sm">
                        {day}
                    </div>
                ))}
            </div>

            <div className="calendar-grid grid grid-cols-7 gap-1">
                {renderCalendar()}
            </div>

            <div className="calendar-legend mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                    <span className="text-gray-600 dark:text-gray-400">Tasks</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-gray-600 dark:text-gray-400">Events</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span className="text-gray-600 dark:text-gray-400">Mood</span>
                </div>
            </div>

            <style jsx>{`
                .calendar-day {
                    aspect-ratio: 1;
                    border: 1px solid #e5e7eb;
                    padding: 4px;
                    border-radius: 8px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-between;
                    min-height: 60px;
                    transition: all 0.2s;
                }

                .dark .calendar-day {
                    border-color: #374151;
                }

                .calendar-day.empty {
                    background: transparent;
                    border: none;
                }

                .calendar-day.today {
                    background: #dbeafe;
                    border-color: #3b82f6;
                    font-weight: bold;
                }

                .dark .calendar-day.today {
                    background: #1e3a8a;
                    border-color: #60a5fa;
                }

                .calendar-day:not(.empty):hover {
                    background: #f3f4f6;
                    transform: scale(1.05);
                }

                .dark .calendar-day:not(.empty):hover {
                    background: #374151;
                }

                .day-number {
                    font-size: 14px;
                    color: #1f2937;
                }

                .dark .day-number {
                    color: #f9fafb;
                }

                .activity-dots {
                    display: flex;
                    gap: 2px;
                    flex-wrap: wrap;
                    justify-content: center;
                }

                .dot {
                    font-size: 12px;
                }
            `}</style>
        </div>
    );
};

export default Calendar;
