import Task from '../models/Task.js';

export const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId }).sort({ date: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks', error: error.message });
    }
};

export const getTask = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.userId });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch task', error: error.message });
    }
};

export const createTask = async (req, res) => {
    try {
        const { title, date, priority, category, notes } = req.body;
        
        const task = new Task({
            user: req.userId,
            title,
            date,
            priority,
            category,
            notes
        });

        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create task', error: error.message });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { title, date, priority, category, notes, completed } = req.body;
        
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { title, date, priority, category, notes, completed },
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update task', error: error.message });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
        
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete task', error: error.message });
    }
};
