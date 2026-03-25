import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://10.0.0.9:5000/api', // Substitua pela URL da sua API
  timeout: 10000,
});