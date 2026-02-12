import mongoose from 'mongoose';

const deviceRegistrationSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  udid: {
    type: String,
    default: null
  },
  plannedDeviceName: {
    type: String
  },
  assetTag: {
    type: String
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  profileToInstall: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  },
  deviceType: {
    type: String,
    enum: ['mac', 'iphone', 'ipad', 'appletv']
  },
  enrollmentStatus: {
    type: String,
    enum: ['pending', 'enrolled', 'ignored'],
    default: 'pending'
  },
  enrolledAt: {
    type: Date,
    default: null
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

const DeviceRegistration = mongoose.model('DeviceRegistration', deviceRegistrationSchema);

export default DeviceRegistration;
