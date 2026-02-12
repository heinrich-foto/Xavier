import axios from 'axios';

const getAuthHeader = () => {
  const tokenStr = localStorage.getItem('user');
  if (tokenStr) {
    const token = JSON.parse(tokenStr).token;
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

const updateDeviceMetadata = async (deviceType, serialNumber, { location, assetTag }) => {
  const response = await axios.patch(
    `${process.env.REACT_APP_BACKEND_SERVER}/api/devices/${deviceType}/${serialNumber}`,
    { location: location || undefined, assetTag: assetTag || undefined },
    { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } }
  );
  return response.data;
};

export default { updateDeviceMetadata };
