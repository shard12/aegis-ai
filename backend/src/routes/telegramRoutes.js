import { Router } from 'express';
import { validate } from '../controllers/telegramController.js';

const r = Router();
r.post('/validate', validate);

export default r;

