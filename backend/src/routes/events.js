import express from 'express';
import auth from '../middleware/auth.js';
import { getEvents, getEvent, createEvent, updateEvent, deleteEvent } from '../controllers/eventController.js';

const router = express.Router();

router.get('/', auth, getEvents);
router.get('/:id', auth, getEvent);
router.post('/', auth, createEvent);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

export default router;
