"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTimerSocket = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerTimerSocket = (io) => {
    io.use((socket, next) => {
        var _a;
        try {
            const token = (_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token;
            if (!token) {
                console.log('Socket connection rejected: No token provided');
                return next(new Error('Unauthorized: No token provided'));
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            socket.userId = decoded.id;
            console.log(`Socket authenticated for user: ${decoded.id}`);
            next();
        }
        catch (error) {
            console.log('Socket connection rejected: Invalid token', error);
            next(new Error('Unauthorized: Invalid token'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.userId;
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
        // Join user-specific room
        socket.join(`user:${userId}`);
        console.log(`Socket ${socket.id} joined room: user:${userId}`);
        // Handle custom join event from client (optional but recommended)
        socket.on('join', (room) => {
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
exports.registerTimerSocket = registerTimerSocket;
