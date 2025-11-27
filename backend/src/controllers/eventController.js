import Event from '../models/Event.js';

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ user: req.userId }).sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch events', error: error.message });
    }
};

export const getEvent = async (req, res) => {
    try {
        const event = await Event.findOne({ _id: req.params.id, user: req.userId });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch event', error: error.message });
    }
};

export const createEvent = async (req, res) => {
    try {
        const { title, date, notes } = req.body;
        
        const event = new Event({
            user: req.userId,
            title,
            date,
            notes
        });

        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create event', error: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { title, date, notes } = req.body;
        
        const event = await Event.findOneAndUpdate(
            { _id: req.params.id, user: req.userId },
            { title, date, notes },
            { new: true, runValidators: true }
        );

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update event', error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.userId });
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete event', error: error.message });
    }
};
