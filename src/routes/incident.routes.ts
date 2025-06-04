import { Router } from 'express';
import {
  getAllIncidents,
  getIncidentById,
  escalateIncident,
  updateIncidentStatus,
  addIncidentNote
} from '../controllers/incident.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', getAllIncidents);
router.get('/:id', getIncidentById);
router.put('/:id/status', updateIncidentStatus);
router.post('/:id/escalate', escalateIncident);
router.post('/:id/notes', addIncidentNote);

export default router;
