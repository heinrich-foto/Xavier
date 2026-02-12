import axios from 'axios';

const getAuthHeader = () => {
  const tokenStr = localStorage.getItem('user');
  if (tokenStr) {
    const token = JSON.parse(tokenStr).token;
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/api/device-groups`;

const getDeviceGroups = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeader() });
  return response.data;
};

const createDeviceGroup = async (data) => {
  const response = await axios.post(API_URL, data, {
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
  });
  return response.data;
};

const updateDeviceGroup = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
  });
  return response.data;
};

const deleteDeviceGroup = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export default {
  getDeviceGroups,
  createDeviceGroup,
  updateDeviceGroup,
  deleteDeviceGroup,
};
