import mongoose from 'mongoose';

const deviceGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  profiles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile'
  }]
}, {
  timestamps: true
});

const DeviceGroup = mongoose.model('DeviceGroup', deviceGroupSchema);

export default DeviceGroup;
