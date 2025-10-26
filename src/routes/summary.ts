import express from 'express';
import { getDailySummary } from '../controllers/summaryController';
import { authMiddleware } from '../middlewares/authMiddleware';
const router = express.Router();
router.use(authMiddleware);
router.get('/daily', getDailySummary);
export default router;