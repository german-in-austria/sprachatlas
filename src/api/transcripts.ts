import { AxiosResponse } from 'axios'
import api from '.'
import qs from 'qs'

export const getTranscripts = (): Promise<AxiosResponse<any>> => {
    return api.get('/routes/transcripts')
}

export const getEinzelerhebungen = (): Promise<AxiosResponse<any>> => {
    return api.get('/routes/einzelerhebungen')
}

export const getSingleTranscript = (id: number, page: number): Promise<AxiosResponse<any>> => {
    return api.get(`/routes/transcript/${id}/${page}`)
}
  
