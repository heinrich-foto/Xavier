import asyncHandler from 'express-async-handler';
import DeviceRegistration from '../models/deviceRegistration.js';

const getDeviceRegistrations = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const query = status ? { enrollmentStatus: status } : {};
  const registrations = await DeviceRegistration.find(query)
    .populate('location', 'name schoolNumber')
    .populate({ path: 'group', select: 'name', populate: { path: 'profiles', select: 'PayloadDisplayName' } })
    .sort({ createdAt: -1 });
  return res.status(200).json(registrations);
});

const createDeviceRegistration = asyncHandler(async (req, res) => {
  const registration = await DeviceRegistration.create({
    serialNumber: req.body.serialNumber,
    plannedDeviceName: req.body.plannedDeviceName || undefined,
    assetTag: req.body.assetTag || undefined,
    location: req.body.location || undefined,
    group: req.body.group || undefined,
    notes: req.body.notes || undefined
  });
  const populated = await DeviceRegistration.findById(registration._id)
    .populate('location', 'name schoolNumber')
    .populate('group', 'name profiles');
  return res.status(201).json(populated);
});

const updateDeviceRegistration = asyncHandler(async (req, res) => {
  const registration = await DeviceRegistration.findByIdAndUpdate(
    req.params.id,
    {
      serialNumber: req.body.serialNumber,
      plannedDeviceName: req.body.plannedDeviceName || undefined,
      assetTag: req.body.assetTag || undefined,
      location: req.body.location || undefined,
      group: req.body.group || undefined,
      notes: req.body.notes || undefined
    },
    { new: true, runValidators: true }
  )
    .populate('location', 'name schoolNumber')
    .populate('group', 'name profiles');
  if (!registration) {
    res.status(404);
    throw new Error('Device registration not found');
  }
  return res.status(200).json(registration);
});

const importDeviceRegistrations = asyncHandler(async (req, res) => {
  const { devices } = req.body;
  if (!Array.isArray(devices)) {
    res.status(400);
    throw new Error('Request body must contain a "devices" array');
  }

  const results = { created: 0, skipped: 0, errors: [] };

  for (let i = 0; i < devices.length; i++) {
    const d = devices[i];
    if (!d.serialNumber || typeof d.serialNumber !== 'string') {
      results.errors.push({ index: i, message: 'serialNumber is required' });
      results.skipped++;
      continue;
    }

    try {
      const existing = await DeviceRegistration.findOne({ serialNumber: d.serialNumber.trim() });
      if (existing) {
        results.skipped++;
        results.errors.push({ index: i, serialNumber: d.serialNumber, message: 'Already exists' });
        continue;
      }

      await DeviceRegistration.create({
        serialNumber: d.serialNumber.trim(),
        plannedDeviceName: d.plannedDeviceName?.trim() || undefined,
        assetTag: d.assetTag?.trim() || undefined,
        location: d.location || undefined,
        group: d.group || undefined,
        notes: d.notes?.trim() || undefined
      });
      results.created++;
    } catch (err) {
      results.skipped++;
      results.errors.push({ index: i, serialNumber: d.serialNumber, message: err.message });
    }
  }

  return res.status(200).json(results);
});

const deleteDeviceRegistration = asyncHandler(async (req, res) => {
  const registration = await DeviceRegistration.findByIdAndDelete(req.params.id);
  if (!registration) {
    res.status(404);
    throw new Error('Device registration not found');
  }
  return res.status(200).json({ id: req.params.id });
});

export {
  getDeviceRegistrations,
  createDeviceRegistration,
  updateDeviceRegistration,
  deleteDeviceRegistration,
  importDeviceRegistrations
};
