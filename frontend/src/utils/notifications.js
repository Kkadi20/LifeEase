// Browser notification utility for task reminders

export const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
        console.log('Browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
};

export const showNotification = (title, options = {}) => {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            icon: '/icon.png',
            badge: '/badge.png',
            ...options
        });
    }
};

export const checkUpcomingTasks = (tasks) => {
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    tasks.forEach(task => {
        if (task.completed) return;

        const taskDate = new Date(task.date);
        const timeDiff = taskDate.getTime() - now.getTime();

        // Notify for tasks due within 1 hour
        if (timeDiff > 0 && timeDiff <= 60 * 60 * 1000) {
            showNotification('Task Due Soon! ⏰', {
                body: `"${task.title}" is due in less than 1 hour`,
                tag: `task-${task._id}`,
                requireInteraction: true
            });
        }

        // Notify for tasks due tomorrow
        if (taskDate >= tomorrow && taskDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)) {
            const lastNotified = localStorage.getItem(`task-notified-${task._id}`);
            const today = now.toDateString();

            if (lastNotified !== today) {
                showNotification('Task Due Tomorrow 📅', {
                    body: `Don't forget: "${task.title}" is due tomorrow`,
                    tag: `task-tomorrow-${task._id}`
                });
                localStorage.setItem(`task-notified-${task._id}`, today);
            }
        }

        // Notify for overdue tasks
        if (taskDate < now) {
            const lastNotified = localStorage.getItem(`task-overdue-${task._id}`);
            const today = now.toDateString();

            if (lastNotified !== today) {
                showNotification('Overdue Task! ⚠️', {
                    body: `"${task.title}" is overdue`,
                    tag: `task-overdue-${task._id}`,
                    requireInteraction: true
                });
                localStorage.setItem(`task-overdue-${task._id}`, today);
            }
        }
    });
};

export const checkUpcomingEvents = (events) => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    events.forEach(event => {
        const eventDate = new Date(event.date);

        // Notify for events tomorrow
        if (eventDate >= tomorrow && eventDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000)) {
            const lastNotified = localStorage.getItem(`event-notified-${event._id}`);
            const today = now.toDateString();

            if (lastNotified !== today) {
                showNotification('Event Tomorrow 🎉', {
                    body: `"${event.title}" is scheduled for tomorrow`,
                    tag: `event-tomorrow-${event._id}`
                });
                localStorage.setItem(`event-notified-${event._id}`, today);
            }
        }
    });
};

// Start checking for upcoming tasks/events every 15 minutes
export const startNotificationService = (tasks, events) => {
    // Check immediately
    checkUpcomingTasks(tasks);
    checkUpcomingEvents(events);

    // Then check every 15 minutes
    setInterval(() => {
        checkUpcomingTasks(tasks);
        checkUpcomingEvents(events);
    }, 15 * 60 * 1000);
};
