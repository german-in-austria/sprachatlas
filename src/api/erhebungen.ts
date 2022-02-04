import { AxiosResponse } from 'axios';
import api from '.';
import qs from 'qs';

export const getErhebungen = (): Promise<AxiosResponse<any>> => {
  return api.dioeDB.get('/restapi/getErhebungsorte');
};

export const getBerufe = (): Promise<AxiosResponse<any>> => {
  return api.dioeDB.get('/restapi/getBerufe');
};

export const getAudioErhebung = (
  inferheb: string
): Promise<AxiosResponse<any>> => {
  const PARAMS = {
    inferhebung: inferheb,
    credentials: 'include',
    withCredentials: true
  };
  return api.dioeDB.get(
    'restapi/getErhebungsorte', {
      params: PARAMS
      /*
      paramsSerializer: params => {
        return qs.stringify(params)
      }*/
    });
};
// Audio request: <audio src="https://url.com/file.ogg#t=5.20,7.35">
export const getSingleAudioFile = (
  path: string,
  filename: string,
  start?: number,
  stop?: number
): Promise<AxiosResponse<any>> => {
  return api.dioeDB.get(
    `private-media/${path}/${filename}#t=${start},${stop}`
  );
};

