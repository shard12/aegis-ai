import { Router } from 'express';
import { save, getProfile, history } from '../controllers/contextController.js';

const r = Router();
r.post('/save', save);
r.get('/profile', getProfile);
r.get('/history', history);

export default r;
