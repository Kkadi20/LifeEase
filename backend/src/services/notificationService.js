import cron from 'node-cron';
import Task from '../models/Task.js';
import User from '../models/User.js';

// Check for tasks due within 24 hours and send reminders
export const scheduleTaskReminders = () => {
    // Run every day at 9:00 AM
    cron.schedule('0 9 * * *', async () => {
        try {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            tomorrow.setHours(23, 59, 59, 999);

            // Find all tasks due within next 24 hours
            const upcomingTasks = await Task.find({
                date: {
                    $gte: today,
                    $lte: tomorrow
                },
                completed: false
            }).populate('user');

            // Group tasks by user
            const tasksByUser = {};
            upcomingTasks.forEach(task => {
                const userId = task.user._id.toString();
                if (!tasksByUser[userId]) {
                    tasksByUser[userId] = {
                        user: task.user,
                        tasks: []
                    };
                }
                tasksByUser[userId].tasks.push(task);
            });

            // Send reminder for each user
            for (const userId in tasksByUser) {
                const { user, tasks } = tasksByUser[userId];
                console.log(`📧 Reminder: ${user.email} has ${tasks.length} task(s) due soon`);
                // TODO: Integrate email service (SendGrid, Nodemailer, etc.)
            }

        } catch (error) {
            console.error('Error sending task reminders:', error);
        }
    });
};

// Check for users who haven't logged mood today
export const scheduleMoodReminders = () => {
    // Run every day at 8:00 PM
    cron.schedule('0 20 * * *', async () => {
        try {
            console.log('📊 Sending mood tracker reminders...');
            // TODO: Check users who haven't logged mood today
            // TODO: Send reminder email/notification
        } catch (error) {
            console.error('Error sending mood reminders:', error);
        }
    });
};

// Initialize all scheduled jobs
export const initializeScheduledJobs = () => {
    scheduleTaskReminders();
    scheduleMoodReminders();
    console.log('✅ Scheduled notification jobs initialized');
};
