import axios from 'axios';
import { Service as publicApi } from './dioe-public-api';

axios.defaults.withCredentials = true;
console.log(process.env.VUE_APP_DB_ENDPOINT);
const api = axios.create({
  timeout: 100000,
  baseURL: process.env.VUE_APP_DB_ENDPOINT,
  withCredentials: true
});

export default {
  dioeDB: api,
  dioePublic: publicApi
};
