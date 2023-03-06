import { AxiosResponse } from 'axios';
import api from '.';

export const getSingleExportLink = (id: string): Promise<any> => {
  return api.dioeDB
    .get(`/restapi/getZitatUrl?url_id=${id}`)
    .then((response) => {
      return { status: response.status, data: response.data.tbl_antworten };
    });
};

export const postNewExportLink = async (
  data: string,
  id: string
): Promise<any> => {
  return await api.dioeDB
    .post('/restapi/setZitatUrl', {
      data: data,
      url_id: id
    })
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
        error: response.data.error
      };
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
