import mongoose from 'mongoose';

const tvOSDeviceSchema = new mongoose.Schema({
  SerialNumber: {
    type: String
  },
  UDID: {
    type: String
  },
  mdmProfileInstalled: {
    type: Boolean
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  assetTag: {
    type: String
  },
  BuildVersion: {
    type: String
  },
  OSVersion: {
    type: String
  },
  ProductName: {
    type: String
  },
  Topic: {
    type: String
  },

  QueryResponses: {
    AvailableDeviceCapacity: {
      type: Number
    },
    BluetoothMAC: {
      type: String
    },
    BuildVersion: {
      type: String
    },
    DeviceCapacity: {
      type: Number
    },
    DeviceName: {
      type: String
    },
    IsSupervised: {
      type: Boolean
    },
    Model: {
      type: String
    },
    ModelName: {
      type: String
    },
    ModelNumber: {
      type: String
    },
    OSVersion: {
      type: String
    },
    ProductName: {
      type: String
    },
    SerialNumber: {
      type: String
    },
    SoftwareUpdateDeviceID: {
      type: String
    },
    TimeZone: {
      type: String
    },
    UDID: {
      type: String
    },
    WiFiMAC: {
      type: String
    }
  },
  Applications: [
    {
      BundleSize: {
        type: Number  
      },
      Identifier: {
        type: String
      },
      Installing: {
        type: Boolean
      },
      Name: {
        type: String
      },
      ShortVersion: {
        type: String
      },
      Version: {
        type: String
      }
    }
  ],
  Profiles: [
    {
      HasRemovalPasscode: {
        type: Boolean
      },
      IsEncrypted: {
        type: Boolean
      },
      IsManaged: {
        type: Boolean
      },
      PayloadDescription: {
        type: String
      },
      PayloadDisplayName: {
        type: String
      },
      PayloadIdentifier: {
        type: String
      },
      PayloadOrganization: {
        type: String
      },
      PayloadType: {
        type: String
      },
      PayloadUUID: {
        type: String
      },
      PayloadVersion: {
        type: Number
      },
      PayloadRemovalDisallowed: {
        type: Boolean
      },
      PayloadContent: [
        {
          PayloadDescription: {
            type: String
          },
          PayloadDisplayName: {
            type: String
          },
          PayloadIdentifier: {
            type: String
          },
          PayloadOrganization: {
            type: String
          },
          PayloadType: {
            type: String
          },
          PayloadUUID: {
            type: String
          },
          PayloadVersion: {
            type: Number
          }
        }
      ],
    },
  ],
  CertificateList: [
    {
      CommonName: {
        type: String
      },
      IsIdentity: {
        type: Boolean
      }
    }
  ]
}, {
  timestamps: true
});

const tvOSDevice = mongoose.model('tvOSDevices', tvOSDeviceSchema);

export default tvOSDevice;
