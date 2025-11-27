import Journal from '../models/Journal.js';

export const getJournals = async (req, res) => {
    try {
        const journals = await Journal.find({ user: req.userId }).sort({ createdAt: -1 });
        res.json(journals);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch journals', error: error.message });
    }
};

export const getJournal = async (req, res) => {
    try {
        const journal = await Journal.findOne({ _id: req.params.id, user: req.userId });
        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }
        res.json(journal);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch journal', error: error.message });
    }
};

export const createJournal = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        const journal = new Journal({
            user: req.userId,
            title,
            content
        });

        await journal.save();
        res.status(201).json(journal);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create journal', error: error.message });
    }
};

export const updateJournal = async (req, res) => {
    try {
        const { title, content } = req.body;
        
        const journal = await Journal.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { title, content },
            { new: true, runValidators: true }
        );

        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        res.json(journal);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update journal', error: error.message });
    }
};

export const deleteJournal = async (req, res) => {
    try {
        const journal = await Journal.findOneAndDelete({ _id: req.params.id, user: req.userId });
        
        if (!journal) {
            return res.status(404).json({ message: 'Journal not found' });
        }

        res.json({ message: 'Journal deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete journal', error: error.message });
    }
};
