import { Request, Response } from 'express';
import { Types } from 'mongoose'
import Task from '../models/Task';
import TimeLog from '../models/TimeLog'

interface PopulatedTask {
  _id: Types.ObjectId
  title: string
  description?: string
  status: 'Pending' | 'In Progress' | 'Completed'
  userId: Types.ObjectId
  timeLogs?: {
    _id: Types.ObjectId
    startedAt: Date
    stoppedAt?: Date
    durationSeconds?: number
  }[]
}

export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const tasks = await Task.find({ userId })
      .populate({
        path: 'timeLogs',
        model: 'TimeLog',
        match: { userId },
        options: { sort: { startedAt: -1 } },
      });

    const enriched = tasks.map((task) => {
      const activeLog = task.timeLogs?.find((l: any) => l.isActive);
      const totalSeconds = task.timeLogs?.reduce(
        (acc: number, l: any) => acc + (l.durationSeconds || 0),
        0
      );
      return {
        ...task.toObject(),
        activeLog: activeLog || null,
        isActive: !!activeLog,
        totalSeconds,
      };
    });

    res.json(enriched);
  } catch (e) {
    console.error('Error fetching tasks:', e);
    res.status(500).json({ message: 'Failed to fetch tasks' });
  }
}

export const createTask = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const { title, description } = req.body;
  const task = await Task.create({ userId, title, description });
  res.json(task);
};

export const updateTask = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  const task = await Task.findOneAndUpdate({ _id: req.params.id, userId }, req.body, { new: true });
  res.json(task);
};

export const deleteTask = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;
  await Task.findOneAndDelete({ _id: req.params.id, userId });
  res.json({ message: 'Task deleted' });
};
