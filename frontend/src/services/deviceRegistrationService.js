import axios from 'axios';

const getAuthHeader = () => {
  const tokenStr = localStorage.getItem('user');
  if (tokenStr) {
    const token = JSON.parse(tokenStr).token;
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/api/device-registrations`;

const getDeviceRegistrations = async (status) => {
  const params = status ? { status } : {};
  const response = await axios.get(API_URL, {
    headers: getAuthHeader(),
    params
  });
  return response.data;
};

const createDeviceRegistration = async (data) => {
  const response = await axios.post(API_URL, data, {
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
  });
  return response.data;
};

const updateDeviceRegistration = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data, {
    headers: { ...getAuthHeader(), 'Content-Type': 'application/json' }
  });
  return response.data;
};

const deleteDeviceRegistration = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export default {
  getDeviceRegistrations,
  createDeviceRegistration,
  updateDeviceRegistration,
  deleteDeviceRegistration,
};
