import { Router } from 'express';
import { nearby } from '../controllers/hospitalController.js';

const r = Router();
r.post('/nearby', nearby);

export default r;
