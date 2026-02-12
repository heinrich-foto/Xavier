import { gql } from '@apollo/client';

const GET_ALL_DEVICES = gql`
    query getAllDevices($first: Int, $after: String, $filter: DeviceFilter) {
        macs(first: $first, after: $after, filter: $filter) {
            edges {
                node {
                    SerialNumber
                    ProductName
                    OSVersion
                    UDID
                    assetTag
                    location {
                        _id
                        name
                        schoolNumber
                    }
                    QueryResponses {
                        DeviceName
                        OSVersion
                    }
                    updatedAt
                }
                cursor
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
        iphones(first: $first, after: $after, filter: $filter) {
            edges {
                node {
                    SerialNumber
                    ProductName
                    OSVersion
                    UDID
                    assetTag
                    location {
                        _id
                        name
                        schoolNumber
                    }
                    QueryResponses {
                        DeviceName
                        OSVersion
                    }
                    updatedAt
                }
                cursor
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
        ipads(first: $first, after: $after, filter: $filter) {
            edges {
                node {
                    SerialNumber
                    ProductName
                    OSVersion
                    UDID
                    assetTag
                    location {
                        _id
                        name
                        schoolNumber
                    }
                    QueryResponses {
                        DeviceName
                        OSVersion
                    }
                    updatedAt
                }
                cursor
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
        appletvs(first: $first, after: $after, filter: $filter) {
            edges {
                node {
                    SerialNumber
                    ProductName
                    OSVersion
                    UDID
                    assetTag
                    location {
                        _id
                        name
                        schoolNumber
                    }
                    QueryResponses {
                        DeviceName
                        OSVersion
                    }
                    updatedAt
                }
                cursor
            }
            pageInfo {
                hasNextPage
                endCursor
            }
            totalCount
        }
    }
`;

export { GET_ALL_DEVICES };
