import axios from 'axios';
import { getToken } from '../utils/storage';

/**
 * Update BASE_URL to match your server:
 *   Android emulator  → http://10.0.2.2:5000/api
 *   iOS simulator     → http://localhost:5000/api
 *   Physical device   → http://<YOUR_COMPUTER_LAN_IP>:5000/api
 */
const BASE_URL = 'http://192.168.1.69:5000/api';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) config.headers['x-auth-token'] = token;
  return config;
});

export const login = (email, password) =>
  api.post('/auth/login', { email, password });

export const register = (name, email, password) =>
  api.post('/auth/register', { name, email, password });

export const getNotes = () => api.get('/notes');
export const createNote = (data) => api.post('/notes', data);
export const updateNote = (id, data) => api.put(`/notes/${id}`, data);
export const deleteNote = (id) => api.delete(`/notes/${id}`);

export default api;
