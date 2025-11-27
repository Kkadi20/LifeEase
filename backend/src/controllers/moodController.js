import Mood from '../models/Mood.js';

export const getMoods = async (req, res) => {
    try {
        const moods = await Mood.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(moods);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch moods', error: error.message });
    }
};

export const getMood = async (req, res) => {
    try {
        const mood = await Mood.findOne({ _id: req.params.id, user: req.userId });
        if (!mood) {
            return res.status(404).json({ message: 'Mood not found' });
        }
        res.json(mood);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch mood', error: error.message });
    }
};

export const createMood = async (req, res) => {
    try {
        const { mood, note } = req.body;
        
        const moodEntry = new Mood({
            user: req.userId,
            mood,
            note
        });

        await moodEntry.save();
        res.status(201).json(moodEntry);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create mood', error: error.message });
    }
};

export const updateMood = async (req, res) => {
    try {
        const { mood, note } = req.body;
        
        const moodEntry = await Mood.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { mood, note },
            { new: true, runValidators: true }
        );

        if (!moodEntry) {
            return res.status(404).json({ message: 'Mood not found' });
        }

        res.json(moodEntry);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update mood', error: error.message });
    }
};

export const deleteMood = async (req, res) => {
    try {
        const mood = await Mood.findOneAndDelete({ _id: req.params.id, user: req.userId });
        
        if (!mood) {
            return res.status(404).json({ message: 'Mood not found' });
        }

        res.json({ message: 'Mood deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete mood', error: error.message });
    }
};
