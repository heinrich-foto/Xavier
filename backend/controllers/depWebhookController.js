import asyncHandler from 'express-async-handler';
import DeviceRegistration from '../models/deviceRegistration.js';

/**
 * DEP Sync Webhook – empfängt Geräte vom nanodep Syncer.
 * Payload: { topic, event_id, created_at, device_response_event: { dep_name, device_response } }
 * device_response kann enthalten:
 *   - devices: [{ serial_number, op_type, profile_uuid, ... }] (optional, fehlt bei leerem Sync)
 *   - cursor, fetched_until, more_to_follow
 * Leere Batches (ohne devices-Array) werden mit 200 und { created:0, updated:0, deleted:0 } beantwortet.
 */
const handleDepSync = asyncHandler(async (req, res) => {
  // The DEP syncer posts: { topic, event_id, created_at, device_response_event: { dep_name, device_response } }
  // device_response may contain: devices, cursor, fetched_until, more_to_follow
  // When empty or sync-complete-only, device_response has no devices array – treat as empty batch
  const deviceResponse = req.body.device_response_event?.device_response;
  const devices =
    deviceResponse?.devices ||
    deviceResponse?.Devices ||
    req.body.devices ||
    req.body.Devices;

  const deviceList = Array.isArray(devices) ? devices : [];

  if (deviceList.length > 0) {
    console.log('DEP SYNC DEVICES:', deviceList.length, 'device(s)');
  }

  const results = { created: 0, updated: 0, deleted: 0, errors: [] };
  const now = new Date();

  for (let i = 0; i < deviceList.length; i++) {
    const d = deviceList[i];
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
