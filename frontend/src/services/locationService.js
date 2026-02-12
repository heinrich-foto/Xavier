import axios from 'axios';

const getAuthHeader = () => {
  const tokenStr = localStorage.getItem('user');
  if (tokenStr) {
    const token = JSON.parse(tokenStr).token;
    return { Authorization: `Bearer ${token}` };
  }
  return {};
};

const API_URL = `${process.env.REACT_APP_BACKEND_SERVER}/api/locations`;

const getLocations = async () => {
  const response = await axios.get(API_URL, { headers: getAuthHeader() });
  return response.data;
};

const createLocation = async (name, schoolNumber) => {
  const response = await axios.post(
    API_URL,
    { name, schoolNumber },
    { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } }
  );
  return response.data;
};

const updateLocation = async (id, name, schoolNumber) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    { name, schoolNumber },
    { headers: { ...getAuthHeader(), 'Content-Type': 'application/json' } }
  );
  return response.data;
};

const deleteLocation = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export default {
  getLocations,
  createLocation,
  updateLocation,
  deleteLocation,
};
