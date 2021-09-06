import { AxiosResponse } from 'axios'
import { ServerTranscriptListItem } from "@/static/apiModels";
import api from '.'
import qs from 'qs'

export const getTranscripts = (): Promise<AxiosResponse<{transcripts: ServerTranscriptListItem[]}>> => {
    return api.dioeDB.get('/routes/transcripts')
}

export const getEinzelerhebungen = (): Promise<AxiosResponse<any>> => {
    return api.dioeDB.get('/routes/einzelerhebungen')
}

export const getSingleTranscript = (id: number, page: number): Promise<AxiosResponse<any>> => {
    return api.dioeDB.get(`/routes/transcript/${id}/${page}`)
}
  
