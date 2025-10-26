"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: String,
    status: { type: String, default: 'Pending' },
    userId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    timeLogs: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'TimeLog' }],
    isActive: { type: Boolean, default: false }, // Add this field
    activeLog: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'TimeLog' } // Add this field
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Task', taskSchema);
