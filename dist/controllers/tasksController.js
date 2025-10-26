"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const getTasks = async (req, res) => {
    try {
        const userId = req.user.id;
        const tasks = await Task_1.default.find({ userId })
            .populate({
            path: 'timeLogs',
            model: 'TimeLog',
            match: { userId },
            options: { sort: { startedAt: -1 } },
        });
        const enriched = tasks.map((task) => {
            var _a, _b;
            const activeLog = (_a = task.timeLogs) === null || _a === void 0 ? void 0 : _a.find((l) => l.isActive);
            const totalSeconds = (_b = task.timeLogs) === null || _b === void 0 ? void 0 : _b.reduce((acc, l) => acc + (l.durationSeconds || 0), 0);
            return {
                ...task.toObject(),
                activeLog: activeLog || null,
                isActive: !!activeLog,
                totalSeconds,
            };
        });
        res.json(enriched);
    }
    catch (e) {
        console.error('Error fetching tasks:', e);
        res.status(500).json({ message: 'Failed to fetch tasks' });
    }
};
exports.getTasks = getTasks;
const createTask = async (req, res) => {
    const userId = req.user.id;
    const { title, description } = req.body;
    const task = await Task_1.default.create({ userId, title, description });
    res.json(task);
};
exports.createTask = createTask;
const updateTask = async (req, res) => {
    const userId = req.user.id;
    const task = await Task_1.default.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true });
    res.json(task);
};
exports.updateTask = updateTask;
const deleteTask = async (req, res) => {
    const userId = req.user.id;
    await Task_1.default.findOneAndDelete({ _id: req.params.id, userId });
    res.json({ message: 'Task deleted' });
};
exports.deleteTask = deleteTask;
