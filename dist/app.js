"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const auth_1 = __importDefault(require("./routes/auth"));
const tasks_1 = __importDefault(require("./routes/tasks"));
const summary_1 = __importDefault(require("./routes/summary"));
const timeLogs_1 = __importDefault(require("./routes/timeLogs"));
const errorHandler_1 = require("./middlewares/errorHandler");
const timerSocket_1 = require("./sockets/timerSocket");
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "http://localhost:4000",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ['websocket', 'polling']
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.set('io', io);
(0, timerSocket_1.registerTimerSocket)(io);
app.use('/api/auth', auth_1.default);
app.use('/api/tasks', tasks_1.default);
app.use('/api/time-logs', timeLogs_1.default);
app.use('/api/summary', summary_1.default);
app.use(errorHandler_1.errorHandler);
exports.default = app;
