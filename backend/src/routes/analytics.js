import express from 'express';
import auth from '../middleware/auth.js';
import { getDashboardAnalytics } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/dashboard', auth, getDashboardAnalytics);

export default router;
