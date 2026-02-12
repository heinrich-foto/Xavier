import { Router } from 'express';
import { handleDepSync } from '../controllers/depWebhookController.js';

const router = Router();

router.post('/', handleDepSync);

export default router;
