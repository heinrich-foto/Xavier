import asyncHandler from 'express-async-handler';
import DeviceRegistration from '../models/deviceRegistration.js';

const getDeviceRegistrations = asyncHandler(async (req, res) => {
  const status = req.query.status;
  const query = status ? { enrollmentStatus: status } : {};
  const registrations = await DeviceRegistration.find(query)
    .populate('location', 'name schoolNumber')
    .populate('profileToInstall', 'PayloadDisplayName PayloadIdentifier')
    .sort({ createdAt: -1 });
  return res.status(200).json(registrations);
});

const createDeviceRegistration = asyncHandler(async (req, res) => {
  const registration = await DeviceRegistration.create({
    serialNumber: req.body.serialNumber,
    plannedDeviceName: req.body.plannedDeviceName || undefined,
    assetTag: req.body.assetTag || undefined,
    location: req.body.location || undefined,
    profileToInstall: req.body.profileToInstall || undefined,
    deviceType: req.body.deviceType || 'mac',
    notes: req.body.notes || undefined
  });
  const populated = await DeviceRegistration.findById(registration._id)
    .populate('location', 'name schoolNumber')
    .populate('profileToInstall', 'PayloadDisplayName PayloadIdentifier');
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
      profileToInstall: req.body.profileToInstall || undefined,
      deviceType: req.body.deviceType || 'mac',
      notes: req.body.notes || undefined
    },
    { new: true, runValidators: true }
  )
    .populate('location', 'name schoolNumber')
    .populate('profileToInstall', 'PayloadDisplayName PayloadIdentifier');
  if (!registration) {
    res.status(404);
    throw new Error('Device registration not found');
  }
  return res.status(200).json(registration);
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
  deleteDeviceRegistration
};
