import { Router } from 'express';
import {
  getDeviceRegistrations,
  createDeviceRegistration,
  updateDeviceRegistration,
  deleteDeviceRegistration,
  importDeviceRegistrations
} from '../controllers/deviceRegistrationController.js';

const router = Router();

router.get('/', getDeviceRegistrations);
router.post('/', createDeviceRegistration);
router.post('/import', importDeviceRegistrations);
router.put('/:id', updateDeviceRegistration);
router.delete('/:id', deleteDeviceRegistration);

export default router;
