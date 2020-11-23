import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import store from '@/store'
import {
  getAudioErhebung,
  getErhebungen
} from '../../api/erhebungen'

import { AxiosResponse } from 'axios'
import Vue from '../../main'
import { ApiLocationResponse, ApiLocSingleResponse, SingleInfResponse, ApiInfErhResponse } from '../../static/apiModels'

export interface ErhebungState {
    currentOrt: ApiLocSingleResponse | null;
    erhebungen: ApiLocationResponse | null;
    loading: boolean;
}

@Module({
  name: 'erhebungModule',
  namespaced: true,
  store,
  dynamic: true
})
class Erhebungen extends VuexModule implements ErhebungState {
    erhebungen: ApiLocationResponse | null = null;
    currentOrt: ApiLocSingleResponse | null = null;

    infErhebungen: ApiInfErhResponse | null = null;
    loading = false;
    infLoading = false;
    

    @Mutation
    setCurrentOrt (ort: ApiLocSingleResponse | null) {
      this.currentOrt = ort
    }

    @Mutation
    setLoading (loading: boolean) {
      this.loading = loading
    }

    @Mutation
    setInfLoading (loading: boolean) {
      this.infLoading = loading
    }

    @MutationAction({ mutate: ['erhebungen', 'loading'] })
    async fetchErhebungen () {
      this.loading = true
      console.log('trying to fetch data')
      const response = await getErhebungen();
      
      console.log('fetched data');
      return {
        erhebungen: response.data.orte,
        loading: false
      }
    }

    @MutationAction({ mutate: ['infErhebungen', 'infLoading'] })
    async fetchInfErhebungen(params: any) {
      this.infLoading = true;
      let numbers: number[] = [];
      params.infs.forEach(function(value: any, index: any){
        numbers.push(value.id);
      });
      const ids = numbers.join(',');
      const response_inf = await getAudioErhebung(ids);
      console.log('fetched data');
      return {
        infErhebungen: response_inf.data,
        infLoading: false
      }
    }
    
}

export const erhebungModule = getModule(Erhebungen)
