import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './db/connection.js';
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import eventRoutes from './routes/events.js';
import journalRoutes from './routes/journal.js';
import moodRoutes from './routes/mood.js';
import analyticsRoutes from './routes/analytics.js';
import { initializeScheduledJobs } from './services/notificationService.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'LifeEase API is running' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Connect DB and start server
connectDB().then(() => {
    // Initialize scheduled notification jobs
    initializeScheduledJobs();
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});
