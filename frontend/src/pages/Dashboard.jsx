import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SummaryCard from '../components/SummaryCard';
import Calendar from '../components/Calendar';

const Dashboard = () => {
    const [analytics, setAnalytics] = useState(null);
    const [calendarData, setCalendarData] = useState({ tasks: [], events: [], moods: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Load analytics
            const analyticsResponse = await fetch('http://localhost:5000/api/analytics/dashboard', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const analyticsData = await analyticsResponse.json();
            setAnalytics(analyticsData);

            // Load calendar data
            const [tasksRes, eventsRes, moodsRes] = await Promise.all([
                fetch('http://localhost:5000/api/tasks', { headers: { 'Authorization': `Bearer ${token}` }}),
                fetch('http://localhost:5000/api/events', { headers: { 'Authorization': `Bearer ${token}` }}),
                fetch('http://localhost:5000/api/mood', { headers: { 'Authorization': `Bearer ${token}` }})
            ]);

            const tasks = await tasksRes.json();
            const events = await eventsRes.json();
            const moods = await moodsRes.json();

            setCalendarData({ tasks, events, moods });
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-200 rounded"></div>)}
                    </div>
                </div>
            </div>
        );
    }

    if (!analytics) {
        return <div className="p-8">Failed to load dashboard data</div>;
    }

    return (
        <div className="p-4 lg:p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back! Here's your overview.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <SummaryCard icon="📋" title="Total Tasks" count={analytics.tasks.total} color="indigo" />
                <SummaryCard icon="📅" title="Total Events" count={analytics.events.total} color="green" />
                <SummaryCard icon="📝" title="Journal Entries" count={analytics.journal.total} color="purple" />
                <SummaryCard icon="😊" title="Mood Logs" count={analytics.mood.recentLogs} color="yellow" />
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Task Progress</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Completed:</span>
                            <span className="font-semibold text-green-600">{analytics.tasks.completed}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Overdue:</span>
                            <span className="font-semibold text-red-600">{analytics.tasks.overdue}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span>Due Today:</span>
                            <span className="font-semibold text-blue-600">{analytics.tasks.today}</span>
                        </div>
                        <div className="mt-4 pt-4 border-t">
                            <div className="flex justify-between text-sm">
                                <span>Completion Rate:</span>
                                <span className="font-semibold">{analytics.tasks.completionRate.toFixed(1)}%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Recent Mood</h3>
                    <div className="text-center">
                        <div className="text-5xl mb-2">
                            {analytics.mood.averageMood === 'great' && '😄'}
                            {analytics.mood.averageMood === 'good' && '😊'}
                            {analytics.mood.averageMood === 'okay' && '😐'}
                            {analytics.mood.averageMood === 'bad' && '😔'}
                            {analytics.mood.averageMood === 'terrible' && '😢'}
                        </div>
                        <p className="text-gray-600 capitalize">Average: {analytics.mood.averageMood}</p>
                        <p className="text-sm text-gray-500 mt-2">{analytics.mood.recentLogs} logs this week</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Activity Streak</h3>
                    <div className="text-center">
                        <div className="text-5xl mb-2">🔥</div>
                        <p className="text-3xl font-bold text-orange-600">{analytics.productivity.streak}</p>
                        <p className="text-gray-600">day{analytics.productivity.streak !== 1 ? 's' : ''}</p>
                    </div>
                </div>
            </div>

            {/* Calendar View */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Activity Calendar</h2>
                <Calendar 
                    tasks={calendarData.tasks}
                    events={calendarData.events}
                    moods={calendarData.moods}
                />
            </div>

            {/* Upcoming Events */}
            {analytics.events.upcoming.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>
                        <Link to="/events" className="text-indigo-600 hover:underline text-sm">
                            View all →
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {analytics.events.upcoming.map(event => (
                            <div key={event._id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <span className="font-medium text-gray-800">{event.title}</span>
                                    <span className="text-sm text-gray-600">
                                        📅 {new Date(event.date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
