import { Router } from 'express';
import {
  getDeviceRegistrations,
  createDeviceRegistration,
  updateDeviceRegistration,
  deleteDeviceRegistration
} from '../controllers/deviceRegistrationController.js';

const router = Router();

router.get('/', getDeviceRegistrations);
router.post('/', createDeviceRegistration);
router.put('/:id', updateDeviceRegistration);
router.delete('/:id', deleteDeviceRegistration);

export default router;
