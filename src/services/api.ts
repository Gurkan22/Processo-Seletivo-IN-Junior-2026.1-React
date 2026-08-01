import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://tarefaapi.onrender.com/api/v1',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@Filminhos:token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});