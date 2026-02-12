import asyncHandler from 'express-async-handler';
import macOSDevice from '../models/macOSDevice.js';
import iOSDevice from '../models/iOSDevice.js';
import iPadOSDevice from '../models/iPadOSDevice.js';
import tvOSDevice from '../models/tvOSDevice.js';

const deviceModels = {
  mac: macOSDevice,
  iphone: iOSDevice,
  ipad: iPadOSDevice,
  appletv: tvOSDevice
};

const updateDeviceMetadata = asyncHandler(async (req, res) => {
  const { serialNumber, deviceType } = req.params;
  const { location, assetTag } = req.body;

  const model = deviceModels[deviceType];
  if (!model) {
    res.status(400);
    throw new Error('Invalid device type');
  }

  const update = {};
  if (location !== undefined) update.location = location || null;
  if (assetTag !== undefined) update.assetTag = assetTag || null;

  const device = await model.findOneAndUpdate(
    { SerialNumber: serialNumber },
    update,
    { new: true }
  );

  if (!device) {
    res.status(404);
    throw new Error('Device not found');
  }

  return res.status(200).json({
    SerialNumber: device.SerialNumber,
    location: device.location,
    assetTag: device.assetTag
  });
});

export { updateDeviceMetadata };
