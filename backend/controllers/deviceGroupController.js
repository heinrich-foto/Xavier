import asyncHandler from 'express-async-handler';
import DeviceGroup from '../models/deviceGroup.js';

const getDeviceGroups = asyncHandler(async (req, res) => {
  const groups = await DeviceGroup.find({})
    .populate('location', 'name schoolNumber')
    .populate('profiles', 'PayloadDisplayName PayloadIdentifier')
    .sort({ name: 1 });
  return res.status(200).json(groups);
});

const createDeviceGroup = asyncHandler(async (req, res) => {
  const group = await DeviceGroup.create({
    name: req.body.name,
    location: req.body.location || undefined,
    profiles: req.body.profiles || []
  });
  const populated = await DeviceGroup.findById(group._id)
    .populate('location', 'name schoolNumber')
    .populate('profiles', 'PayloadDisplayName PayloadIdentifier');
  return res.status(201).json(populated);
});

const updateDeviceGroup = asyncHandler(async (req, res) => {
  const group = await DeviceGroup.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      location: req.body.location || undefined,
      profiles: req.body.profiles || []
    },
    { new: true, runValidators: true }
  )
    .populate('location', 'name schoolNumber')
    .populate('profiles', 'PayloadDisplayName PayloadIdentifier');
  if (!group) {
    res.status(404);
    throw new Error('Device group not found');
  }
  return res.status(200).json(group);
});

const deleteDeviceGroup = asyncHandler(async (req, res) => {
  const group = await DeviceGroup.findByIdAndDelete(req.params.id);
  if (!group) {
    res.status(404);
    throw new Error('Device group not found');
  }
  return res.status(200).json({ id: req.params.id });
});

export { getDeviceGroups, createDeviceGroup, updateDeviceGroup, deleteDeviceGroup };
