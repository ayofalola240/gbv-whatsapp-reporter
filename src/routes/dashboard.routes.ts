import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller'; // Adjust path
// import { protect } from '../middleware/authMiddleware'; // Assuming you might have this in TS

const router = Router();

// GET /api/dashboard/stats
router.get('/dashboard/stats', /* protect, */ getDashboardStats);

export default router;
