import { Router } from 'express';
import { updateDeviceMetadata } from '../controllers/deviceController.js';

const router = Router();

router.patch('/:deviceType/:serialNumber', updateDeviceMetadata);

export default router;
