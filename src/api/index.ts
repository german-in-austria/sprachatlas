import axios from 'axios'
import { Service as publicApi } from './dioe-public-api'

axios.defaults.withCredentials = true
const api = axios.create({
  // baseURL sollte im env sein
  baseURL: 'https://dioedb.dioe.at',
  withCredentials: true,
  timeout: 100000
})

const dioeApi = axios.create({
  // baseURL sollte im env sein
  baseURL: 'https://api.dioe.at',
  withCredentials: true,
  timeout: 100000
})

export default {
  dioeDB: api,
  dioeApi: dioeApi,
  dioePublic: publicApi
}
