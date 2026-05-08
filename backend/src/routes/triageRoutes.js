import { Router } from 'express';
import { analyze } from '../controllers/triageController.js';

const r = Router();
r.post('/analyze', analyze);

export default r;
