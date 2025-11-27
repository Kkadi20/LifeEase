import Task from '../models/Task.js';
import Event from '../models/Event.js';
import Journal from '../models/Journal.js';
import Mood from '../models/Mood.js';

export const getDashboardAnalytics = async (req, res) => {
    try {
        const userId = req.userId;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Task Statistics
        const allTasks = await Task.find({ user: userId });
        const completedTasks = allTasks.filter(t => t.completed);
        const overdueTasks = allTasks.filter(t => !t.completed && new Date(t.date) < today);
        const todayTasks = allTasks.filter(t => {
            const taskDate = new Date(t.date);
            taskDate.setHours(0, 0, 0, 0);
            return taskDate.getTime() === today.getTime();
        });

        // Task completion rate by priority
        const tasksByPriority = {
            high: allTasks.filter(t => t.priority === 'high'),
            medium: allTasks.filter(t => t.priority === 'medium'),
            low: allTasks.filter(t => t.priority === 'low')
        };

        const completionByPriority = {
            high: (tasksByPriority.high.filter(t => t.completed).length / tasksByPriority.high.length * 100) || 0,
            medium: (tasksByPriority.medium.filter(t => t.completed).length / tasksByPriority.medium.length * 100) || 0,
            low: (tasksByPriority.low.filter(t => t.completed).length / tasksByPriority.low.length * 100) || 0
        };

        // Task completion rate by category
        const tasksByCategory = {
            academic: allTasks.filter(t => t.category === 'academic'),
            personal: allTasks.filter(t => t.category === 'personal'),
            wellness: allTasks.filter(t => t.category === 'wellness'),
            work: allTasks.filter(t => t.category === 'work'),
            other: allTasks.filter(t => t.category === 'other')
        };

        // Mood trends (last 7 days)
        const recentMoods = await Mood.find({
            user: userId,
            createdAt: { $gte: sevenDaysAgo }
        }).sort({ createdAt: 1 });

        const moodTrend = recentMoods.map(m => ({
            date: m.createdAt.toISOString().split('T')[0],
            mood: m.mood
        }));

        // Mood distribution
        const moodCounts = {
            great: recentMoods.filter(m => m.mood === 'great').length,
            good: recentMoods.filter(m => m.mood === 'good').length,
            okay: recentMoods.filter(m => m.mood === 'okay').length,
            bad: recentMoods.filter(m => m.mood === 'bad').length,
            terrible: recentMoods.filter(m => m.mood === 'terrible').length
        };

        // Journal activity
        const journalCount = await Journal.countDocuments({ user: userId });
        const recentJournals = await Journal.countDocuments({
            user: userId,
            createdAt: { $gte: sevenDaysAgo }
        });

        // Events
        const eventCount = await Event.countDocuments({ user: userId });
        const upcomingEvents = await Event.find({
            user: userId,
            date: { $gte: today }
        }).sort({ date: 1 }).limit(5);

        res.json({
            tasks: {
                total: allTasks.length,
                completed: completedTasks.length,
                overdue: overdueTasks.length,
                today: todayTasks.length,
                completionRate: (completedTasks.length / allTasks.length * 100) || 0,
                byPriority: completionByPriority,
                byCategory: {
                    academic: tasksByCategory.academic.length,
                    personal: tasksByCategory.personal.length,
                    wellness: tasksByCategory.wellness.length,
                    work: tasksByCategory.work.length,
                    other: tasksByCategory.other.length
                }
            },
            mood: {
                recentLogs: recentMoods.length,
                trend: moodTrend,
                distribution: moodCounts,
                averageMood: calculateAverageMood(recentMoods)
            },
            journal: {
                total: journalCount,
                thisWeek: recentJournals
            },
            events: {
                total: eventCount,
                upcoming: upcomingEvents
            },
            productivity: {
                streak: await calculateStreakDays(userId),
                weeklyActivity: await getWeeklyActivity(userId, sevenDaysAgo)
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
    }
};

// Helper function to calculate average mood
const calculateAverageMood = (moods) => {
    if (moods.length === 0) return 'N/A';
    
    const moodValues = {
        terrible: 1,
        bad: 2,
        okay: 3,
        good: 4,
        great: 5
    };
    
    const sum = moods.reduce((acc, m) => acc + moodValues[m.mood], 0);
    const avg = sum / moods.length;
    
    if (avg >= 4.5) return 'great';
    if (avg >= 3.5) return 'good';
    if (avg >= 2.5) return 'okay';
    if (avg >= 1.5) return 'bad';
    return 'terrible';
};

// Helper function to calculate streak days
const calculateStreakDays = async (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = new Date(today);
    
    while (streak < 365) { // Max 1 year
        const nextDay = new Date(currentDate);
        nextDay.setDate(nextDay.getDate() + 1);
        
        const hasActivity = await Task.exists({
            user: userId,
            createdAt: { $gte: currentDate, $lt: nextDay }
        }) || await Mood.exists({
            user: userId,
            createdAt: { $gte: currentDate, $lt: nextDay }
        });
        
        if (!hasActivity) break;
        
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
};

// Helper function to get weekly activity
const getWeeklyActivity = async (userId, startDate) => {
    const activity = [];
    
    for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        
        const taskCount = await Task.countDocuments({
            user: userId,
            createdAt: { $gte: date, $lt: nextDay }
        });
        
        const moodLogged = await Mood.exists({
            user: userId,
            createdAt: { $gte: date, $lt: nextDay }
        });
        
        activity.push({
            date: date.toISOString().split('T')[0],
            tasks: taskCount,
            moodLogged: !!moodLogged
        });
    }
    
    return activity;
};
