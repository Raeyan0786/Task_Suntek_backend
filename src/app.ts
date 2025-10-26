import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import authRoutes from './routes/auth/auth';
import taskRoutes from './routes/tasks/tasks';
import summaryRoutes from './routes/summary';
import timeLogRoutes from './routes/timeLogs';
import { errorHandler } from './middlewares/errorHandler';
import { registerTimerSocket } from './sockets/timerSocket';

dotenv.config();
const app = express();
const server = createServer(app);

// Socket.io setup with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4000", // Your frontend URL
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling'] // Enable both transports
});


app.use(cors());
app.use(express.json());

// Store io instance in app for use in controllers
app.set('io', io);

// Register socket handlers
registerTimerSocket(io);

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/time-logs', timeLogRoutes);
app.use('/api/summary', summaryRoutes);
app.use(errorHandler);
export default app;
