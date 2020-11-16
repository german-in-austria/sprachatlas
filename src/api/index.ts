import axios from 'axios'

axios.defaults.withCredentials = true
const api = axios.create({
  // baseURL sollte im env sein
  baseURL: 'https://dioedb.dioe.at',
  withCredentials: true,
  timeout: 100000
})

export default api
