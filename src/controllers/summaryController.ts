import { Request, Response } from 'express'
import mongoose from 'mongoose'
import Task from '../models/Task'
import TimeLog from '../models/TimeLog'

// 🟢 Get daily summary (optimized)
export const getDailySummary = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    // Step 1: Get all time logs for today for the logged-in user
    const todayLogs = await TimeLog.find({
      userId,
      startedAt: { $gte: startOfDay, $lte: endOfDay },
    })
      .populate('taskId', 'title status')
      .lean()

    // Step 2: Aggregate total time and group by task
    const taskMap: Record<
      string,
      { title: string; totalSeconds: number; status: string }
    > = {}

    let totalTimeSeconds = 0

    for (const log of todayLogs) {
      if (!log.taskId) continue

      const taskId = (log.taskId as any)._id.toString()
      const title = (log.taskId as any).title
      const status = (log.taskId as any).status
      const duration = log.durationSeconds || 0
      totalTimeSeconds += duration

      if (!taskMap[taskId]) {
        taskMap[taskId] = { title, totalSeconds: 0, status }
      }
      taskMap[taskId].totalSeconds += duration
    }

    const tasksWorked = Object.entries(taskMap).map(
      ([taskId, { title, totalSeconds, status }]) => ({
        taskId,
        title,
        totalSeconds,
        status,
      })
    )

    // Step 3: Get all user's tasks created (or modified) today
    const todayTasks = await Task.find({
      userId,
      // updatedAt: { $gte: startOfDay, $lte: endOfDay },
    })
      .select('title status')
      .lean()

    // Step 4: Categorize tasks by status
    const completedTasks = todayTasks.filter((t) => t.status === 'Completed')
    const inProgressTasks = todayTasks.filter(
      (t) => t.status === 'In Progress'
    )
    const pendingTasks = todayTasks.filter((t) => t.status === 'Pending')

    // Step 5: Construct final summary object
    const summary = {
      totalTimeSeconds,
      tasksWorked,
      completedTasks,
      inProgressTasks,
      pendingTasks,
    }

    res.json(summary)
  } catch (error) {
    console.error('Error fetching daily summary:', error)
    res.status(500).json({ message: 'Failed to generate summary' })
  }
}
