import { AxiosResponse } from 'axios'
import api from '.'
import qs from 'qs'

export const getErhebungen = (): Promise<AxiosResponse<any>> => {
  return api.get('/restapi/getErhebungsorte')
}

export const getAudioErhebung = (
  inferheb: number[]
): Promise<AxiosResponse<any>> => {
  const PARAMS = {
    inferhebungen: inferheb,
    credentials: 'include',
    withCredentials: true
  }
  return api.get(
    'restapi/getErhebungsorte', {
      params: PARAMS,
      paramsSerializer: params => {
        return qs.stringify(params)
      }
    })
}
/*
export const getSingleAudioFile = (
  path: string,
  filename: string
): Promise<AxiosResponse<any>> => {
  return api.get(
    'private-media/${path}/${filename}'
  )
}
*/
