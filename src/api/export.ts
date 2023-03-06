import { AxiosResponse } from 'axios';
import api from '.';

export const getSingleExportLink = (id: string): Promise<any> => {
  return api.dioeDB.get(`/restapi/get?=${id}`).then((response) => {
    return { status: response.status, data: response.data };
  });
};

export const postNewExportLink = async (
  data: string,
  id: string
): Promise<any> => {
  return await api.dioeDB
    .post('/restapi/setZitatUrl', {
      data: { data: data, url_id: id }
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

export const checkAuthentication = (): Promise<any> => {
  return api.dioeDB.get('/restapi/auth');
};
