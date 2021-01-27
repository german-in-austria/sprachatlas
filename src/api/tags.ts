import { AxiosResponse } from 'axios'
import api from '.'

export const getTags = (): Promise<AxiosResponse<any>> => {
  return api.dioeApi.get('/api/tags')
}
