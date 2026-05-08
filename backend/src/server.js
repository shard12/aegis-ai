import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { errorHandler } from './middleware/errorHandler.js';
import triageRoutes from './routes/triageRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import hospitalRoutes from './routes/hospitalRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import contextRoutes from './routes/contextRoutes.js';
import telegramRoutes from './routes/telegramRoutes.js';
import { history } from './controllers/contextController.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (req, res) => res.json({ ok: true, service: 'aegis-ai-backend' }));

app.use('/api/triage', triageRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/hospitals', hospitalRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/context', contextRoutes);
app.use('/api/telegram', telegramRoutes);
app.get('/api/history', history);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Aegis AI backend http://localhost:${PORT}`);
});
