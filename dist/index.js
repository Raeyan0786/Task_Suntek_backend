"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const db_1 = __importDefault(require("./config/db"));
const timerSocket_1 = require("./sockets/timerSocket");
const PORT = process.env.PORT || 4000;
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, { cors: { origin: '*' } });
app_1.default.set('io', io);
(0, timerSocket_1.registerTimerSocket)(io);
(0, db_1.default)().then(() => {
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
