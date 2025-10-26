"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const timeLogSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    taskId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    startedAt: {
        type: Date,
        required: true,
    },
    stoppedAt: {
        type: Date,
        default: null,
    },
    durationSeconds: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model('TimeLog', timeLogSchema);
// import mongoose from 'mongoose';
// const timeLogSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
//   startedAt: { type: Date, required: true },
//   stoppedAt: Date,
//   durationSeconds: Number,
//   isActive: { type: Boolean, default: true }
// }, { timestamps: true });
// export default mongoose.model('TimeLog', timeLogSchema);
