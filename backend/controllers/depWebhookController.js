import asyncHandler from 'express-async-handler';
import DeviceRegistration from '../models/deviceRegistration.js';

/**
 * DEP Sync Webhook – empfängt Geräte vom nanodep Syncer.
 * Payload-Format (von godep.FetchDeviceResponseJson / SyncDevices):
 * {
 *   "devices": [{
 *     "serial_number": "C02XY1234",
 *     "device_assigned_by": "...",
 *     "op_type": "added"|"modified"|"deleted",
 *     "profile_uuid": "DEP-Enrollment-Profile-UUID",
 *     "profile_status": "assigned"|"pushed"|...
 *   }],
 *   "cursor": "...",
 *   "more_to_follow": false
 * }
 * Hinweis: profile_uuid/profile_status beziehen sich auf das DEP-Enrollment-Profil,
 * nicht auf mobileconfig-Profile.
 */
const handleDepSync = asyncHandler(async (req, res) => {
  // The DEP syncer posts: { topic, event_id, created_at, device_response_event: { dep_name, device_response } }
  // The actual devices array is inside device_response_event.device_response.devices
  const devices =
    (req.body.device_response_event &&
      req.body.device_response_event.device_response &&
      (req.body.device_response_event.device_response.devices ||
        req.body.device_response_event.device_response.Devices)) ||
    req.body.devices ||
    req.body.Devices;
  
  console.log('DEP SYNC DEVICES:');
  console.log(devices);
  console.log(req.body)
  console.log('DEP SYNC END:');
  
  if (!Array.isArray(devices)) {
    res.status(400).json({ error: 'Request body must contain a "devices" (or "Devices") array' });
    return;
  }

  const results = { created: 0, updated: 0, deleted: 0, errors: [] };
  const now = new Date();

  for (let i = 0; i < devices.length; i++) {
    const d = devices[i];
    const serial = d.serial_number || d.SerialNumber;

    if (!serial) {
      results.errors.push({ index: i, message: 'serial_number required' });
      continue;
    }

    const opType = (d.op_type || d.OpType || '').toLowerCase();

    try {
      if (opType === 'deleted') {
        const deleted = await DeviceRegistration.findOneAndDelete({ serialNumber: serial });
        if (deleted) results.deleted++;
        continue;
      }

      const update = {
        depProfileUuid: d.profile_uuid || d.ProfileUUID || undefined,
        depProfileStatus: d.profile_status || d.ProfileStatus || undefined,
        depDeviceAssignedBy: d.device_assigned_by || d.DeviceAssignedBy || undefined,
        depOpType: opType || undefined,
        depLastSync: now,
      };

      const existing = await DeviceRegistration.findOne({ serialNumber: serial });

      if (existing) {
        await DeviceRegistration.updateOne(
          { serialNumber: serial },
          { $set: update }
        );
        results.updated++;
      } else {
        await DeviceRegistration.create({
          serialNumber: serial,
          enrollmentStatus: 'pending',
          ...update,
        });
        results.created++;
      }
    } catch (err) {
      results.errors.push({ index: i, serialNumber: serial, message: err.message });
    }
  }

  res.status(200).json(results);
});

export { handleDepSync };
