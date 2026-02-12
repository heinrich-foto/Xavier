import { Router } from 'express';
import {
  getDeviceGroups,
  createDeviceGroup,
  updateDeviceGroup,
  deleteDeviceGroup
} from '../controllers/deviceGroupController.js';

const router = Router();

router.get('/', getDeviceGroups);
router.post('/', createDeviceGroup);
router.put('/:id', updateDeviceGroup);
router.delete('/:id', deleteDeviceGroup);

export default router;
