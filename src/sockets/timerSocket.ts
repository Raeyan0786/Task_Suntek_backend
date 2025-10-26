import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export const registerTimerSocket = (io: Server) => {
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      
      if (!token) {
        console.log('Socket connection rejected: No token provided');
        return next(new Error('Unauthorized: No token provided'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
      (socket as any).userId = decoded.id;
      
      console.log(`Socket authenticated for user: ${decoded.id}`);
      next();
    } catch (error) {
      console.log('Socket connection rejected: Invalid token', error);
      next(new Error('Unauthorized: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const userId = (socket as any).userId;
    
    console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    
    // Join user-specific room
    socket.join(`user:${userId}`);
    console.log(`Socket ${socket.id} joined room: user:${userId}`);
    
    // Handle custom join event from client (optional but recommended)
    socket.on('join', (room: string) => {
      socket.join(room);
      console.log(`Socket ${socket.id} joined room: ${room}`);
    });

    socket.on('disconnect', (reason) => {
      console.log(`User ${userId} disconnected. Reason: ${reason}`);
    });

    socket.on('error', (error) => {
      console.error(`Socket error for user ${userId}:`, error);
    });
  });
};

// import { Server } from 'socket.io';
// import jwt from 'jsonwebtoken';

// export const registerTimerSocket = (io: Server) => {
//   io.use((socket, next) => {
//     const token = socket.handshake.auth?.token;
//     if (!token) return next(new Error('Unauthorized'));
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
//       (socket as any).userId = decoded.id;
//       next();
//     } catch {
//       next(new Error('Unauthorized'));
//     }
//   });

//   io.on('connection', (socket) => {
//     const userId = (socket as any).userId;
//     socket.join(`user:${userId}`);
//     socket.on('disconnect', () => {});
//   });
// };
