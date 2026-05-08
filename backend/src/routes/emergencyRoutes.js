import { Router } from 'express';
import { trigger } from '../controllers/emergencyController.js';

const r = Router();
r.post('/trigger', trigger);

export default r;
