import app from './app';
import http from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db';
import { registerTimerSocket } from './sockets/timerSocket';

const PORT = process.env.PORT || 4000;
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.set('io', io);
registerTimerSocket(io);

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
