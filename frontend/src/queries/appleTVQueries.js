import { gql } from '@apollo/client';

const GET_APPLE_TV = gql`
    query getAppleTV($SerialNumber: String!) {
        configProfiles {
            PayloadDisplayName
            PayloadDescription
            PayloadOrganization
            PayloadIdentifier
            PayloadUUID
            MobileConfigData
        }
        appletv(SerialNumber: $SerialNumber) {
            SerialNumber
            ProductName
            OSVersion
            UDID
            mdmProfileInstalled
            assetTag
            location {
                _id
                name
                schoolNumber
            }
            QueryResponses {
                AvailableDeviceCapacity
                BluetoothMAC
                BuildVersion
                DeviceCapacity
                DeviceName
                IsSupervised
                Model
                ModelName
                ModelNumber
                OSVersion
                ProductName
                SerialNumber
                SoftwareUpdateDeviceID
                TimeZone
                UDID
                WiFiMAC
            }
            Applications {
              Identifier
              Name
              Version
            }
            Profiles {
                HasRemovalPasscode
                IsEncrypted
                IsManaged
                PayloadDescription
                PayloadDisplayName
                PayloadIdentifier
                PayloadOrganization
                PayloadType
                PayloadUUID
                PayloadVersion
                PayloadRemovalDisallowed
                PayloadContent {
                    PayloadDescription
                    PayloadDisplayName
                    PayloadIdentifier
                    PayloadOrganization
                    PayloadType
                    PayloadUUID
                    PayloadVersion
                }
              }
            CertificateList {
                CommonName
                IsIdentity
            }
            updatedAt
        }
    }
`

export { GET_APPLE_TV };
