import { AxiosResponse } from 'axios';
import api from '.';

export const getSingleExportLink = (
  id: number
): Promise<AxiosResponse<any>> => {
  return api.dioeDB.get(`/restapi/get?=${id}`);
};

export const postNewExportLink = async (data: string): Promise<any> => {
  return await api.dioeDB
    .post('/restapi/post', {
      data: data
    })
    .then((response) => {
      return { status: response.status, data: response.data };
    });
};

export const deleteSingleExportLink = (
  id: number
): Promise<AxiosResponse<any>> => {
  return api.dioeDB.delete(`/restapi/delete?=${id}`);
};
