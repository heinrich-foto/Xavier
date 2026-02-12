import asyncHandler from 'express-async-handler';
import Location from '../models/location.js';

const getLocations = asyncHandler(async (req, res) => {
  const locations = await Location.find({}).sort({ schoolNumber: 1 });
  return res.status(200).json(locations);
});

const createLocation = asyncHandler(async (req, res) => {
  const location = await Location.create({
    name: req.body.name,
    schoolNumber: req.body.schoolNumber
  });
  return res.status(201).json(location);
});

const updateLocation = asyncHandler(async (req, res) => {
  const location = await Location.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, schoolNumber: req.body.schoolNumber },
    { new: true, runValidators: true }
  );
  if (!location) {
    res.status(404);
    throw new Error('Location not found');
  }
  return res.status(200).json(location);
});

const deleteLocation = asyncHandler(async (req, res) => {
  const location = await Location.findByIdAndDelete(req.params.id);
  if (!location) {
    res.status(404);
    throw new Error('Location not found');
  }
  return res.status(200).json({ id: req.params.id });
});

export { getLocations, createLocation, updateLocation, deleteLocation };
