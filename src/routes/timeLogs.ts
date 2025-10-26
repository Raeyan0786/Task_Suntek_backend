import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';
import { startTimer, stopTimer } from '../controllers/timeLogsController';
const router = express.Router();
router.use(authMiddleware);
router.post('/start', startTimer);
router.post('/stop', stopTimer);
export default router;
