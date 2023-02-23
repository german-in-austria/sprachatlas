import { AxiosResponse } from 'axios';
import api from '.';

export const getSingleExportLink = (
  id: number
): Promise<AxiosResponse<any>> => {
  return api.dioeDB.get(`/restapi/get?=${id}`);
};

export const postNewExportLink = (
  data: string
): Promise<AxiosResponse<any>> => {
  return api.dioeDB.post('', {
    data: data
  });
};

export const deleteSingleExportLink = (
  id: number
): Promise<AxiosResponse<any>> => {
  return api.dioeDB.delete(`/restapi/delete?=${id}`);
};
