import { Router } from 'express';
import { handleIncomingMessage, verifyWebhook } from '../controllers/whatsapp.controller';

const router = Router();

// Endpoint for Meta Cloud API to verify webhook
router.get('/webhook/whatsapp', verifyWebhook);

// Endpoint for Meta Cloud API to send message updates
router.post('/webhook/whatsapp', handleIncomingMessage);

export default router;
