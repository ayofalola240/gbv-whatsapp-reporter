import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller'; // Adjust path
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/dashboard/stats
router.get('/stats', protect, getDashboardStats);

export default router;
