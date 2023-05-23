import axios from 'axios';
import { Service as publicApi } from './dioe-public-api';

axios.defaults.withCredentials = true;
const api = axios.create({
  // baseURL sollte im env sein
  baseURL: process.env.VUE_APP_DB_ENDPOINT,
  withCredentials: true,
  timeout: 100000
});

export default {
  dioeDB: api,
  dioePublic: publicApi
};
