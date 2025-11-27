import express from 'express';
import auth from '../middleware/auth.js';
import { getJournals, getJournal, createJournal, updateJournal, deleteJournal } from '../controllers/journalController.js';

const router = express.Router();

router.get('/', auth, getJournals);
router.get('/:id', auth, getJournal);
router.post('/', auth, createJournal);
router.put('/:id', auth, updateJournal);
router.delete('/:id', auth, deleteJournal);

export default router;
