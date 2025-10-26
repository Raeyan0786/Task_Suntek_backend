import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import authRoutes from './routes/auth';
import taskRoutes from './routes/tasks';
import summaryRoutes from './routes/summary';
import timeLogRoutes from './routes/timeLogs';
import { errorHandler } from './middlewares/errorHandler';
import { registerTimerSocket } from './sockets/timerSocket';

dotenv.config();
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://suntek-backend.onrender.com",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

app.use(cors());

app.use(express.json());

app.set('io', io);

registerTimerSocket(io);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/time-logs', timeLogRoutes);
app.use('/api/summary', summaryRoutes);
app.use(errorHandler);
export default app;
