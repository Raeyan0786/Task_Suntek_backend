import { Request, Response } from 'express';
import TimeLog from '../models/TimeLog';
import Task from '../models/Task';

// 🟢 Start Timer
export const startTimer = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }

    // Check if this task already has an active timer for this user
    const existingLog = await TimeLog.findOne({ userId, taskId, isActive: true });
    if (existingLog) {
      return res.status(400).json({ message: 'Timer already running for this task' });
    }

    // Create new active time log
    const log = await TimeLog.create({
      userId,
      taskId,
      startedAt: new Date(),
      isActive: true,
      durationSeconds: 0
    });

    // Mark the current task as active + attach log
    await Task.findByIdAndUpdate(taskId, {
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
  } catch (error) {
    console.error('Start timer error:', error);
    res.status(500).json({ message: 'Failed to start timer', error });
  }
};

// 🔴 Stop Timer
export const stopTimer = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { taskId } = req.body;

    if (!taskId) {
      return res.status(400).json({ message: 'Task ID is required' });
    }

    const activeLog = await TimeLog.findOne({ userId, taskId, isActive: true });
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
    await Task.findByIdAndUpdate(taskId, {
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
  } catch (error) {
    console.error('Stop timer error:', error);
    res.status(500).json({ message: 'Failed to stop timer', error });
  }
};
