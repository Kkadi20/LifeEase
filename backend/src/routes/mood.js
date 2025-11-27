import express from 'express';
import auth from '../middleware/auth.js';
import { getMoods, getMood, createMood, updateMood, deleteMood } from '../controllers/moodController.js';

const router = express.Router();

router.get('/', auth, getMoods);
router.get('/:id', auth, getMood);
router.post('/', auth, createMood);
router.put('/:id', auth, updateMood);
router.delete('/:id', auth, deleteMood);

export default router;
