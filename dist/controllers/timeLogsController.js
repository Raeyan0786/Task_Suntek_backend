"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopTimer = exports.startTimer = void 0;
const TimeLog_1 = __importDefault(require("../models/TimeLog"));
const Task_1 = __importDefault(require("../models/Task"));
// 🟢 Start Timer
const startTimer = async (req, res) => {
    try {
        const userId = req.user.id;
        const { taskId } = req.body;
        if (!taskId) {
            return res.status(400).json({ message: 'Task ID is required' });
        }
        // Check if this task already has an active timer for this user
        const existingLog = await TimeLog_1.default.findOne({ userId, taskId, isActive: true });
        if (existingLog) {
            return res.status(400).json({ message: 'Timer already running for this task' });
        }
        // Create new active time log
        const log = await TimeLog_1.default.create({
            userId,
            taskId,
            startedAt: new Date(),
            isActive: true,
            durationSeconds: 0
        });
        // Mark the current task as active + attach log
        await Task_1.default.findByIdAndUpdate(taskId, {
            $set: { isActive: true, activeLog: log._id },
            $push: { timeLogs: log._id },
        });
        // Prepare socket payload
        const payload = {
            _id: log._id,
            taskId: log.taskId,
            userId: log.userId,
            startedAt: log.startedAt,
            isActive: log.isActive,
            stoppedAt: log.stoppedAt,
            durationSeconds: log.durationSeconds
        };
        const io = req.app.get('io');
        io.to(`user:${userId}`).emit('timer:started', payload);
        // Emit only to the specific user's room for real-time sync
        res.status(200).json(payload);
    }
    catch (error) {
        console.error('Start timer error:', error);
        res.status(500).json({ message: 'Failed to start timer', error });
    }
};
exports.startTimer = startTimer;
// 🔴 Stop Timer
const stopTimer = async (req, res) => {
    try {
        const userId = req.user.id;
        const { taskId } = req.body;
        if (!taskId) {
            return res.status(400).json({ message: 'Task ID is required' });
        }
        const activeLog = await TimeLog_1.default.findOne({ userId, taskId, isActive: true });
        if (!activeLog) {
            return res.status(400).json({ message: 'No active timer found for this task' });
        }
        const stoppedAt = new Date();
        const durationSeconds = Math.floor((stoppedAt.getTime() - activeLog.startedAt.getTime()) / 1000);
        activeLog.stoppedAt = stoppedAt;
        activeLog.durationSeconds = durationSeconds;
        activeLog.isActive = false;
        await activeLog.save();
        // Mark the task inactive
        await Task_1.default.findByIdAndUpdate(taskId, {
            $set: { isActive: false, activeLog: null }
        });
        const payload = {
            taskId,
            logId: activeLog._id,
            durationSeconds,
            stoppedAt
        };
        const io = req.app.get('io');
        io.to(`user:${userId}`).emit('timer:stopped', payload);
        res.status(200).json(payload);
    }
    catch (error) {
        console.error('Stop timer error:', error);
        res.status(500).json({ message: 'Failed to stop timer', error });
    }
};
exports.stopTimer = stopTimer;
