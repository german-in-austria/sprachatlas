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
  id: string,
  user: number,
  isPublic: boolean,
  name: string
): Promise<any> => {
  return await api.dioeDB
    .post('/restapi/setZitatUrl', {
      data: data,
      url_id: id,
      user: user,
      public: isPublic,
      name: name
    })
    .then((response) => {
      return {
        status: response.status,
        data: response.data,
        error: response.data.error
      };
    });
};

export const getAllExportedMaps = async (): Promise<any> => {
  return await api.dioeDB.get('/restapi/getZitatUrl').then((response) => {
    return { status: response.status, data: response.data.tbl_antworten };
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
