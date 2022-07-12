import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators';
import store from '@/store';
import api from '@/api';

import {
  getAudioErhebung,
  getErhebungen
} from '../../api/erhebungen';

import { ApiLocationResponse, ApiLocSingleResponse, SingleInfResponse, ApiInfErhResponse } from '../../static/apiModels';
import type { ISelectErhebungsartenResult } from '../../api/dioe-public-api/models/ISelectErhebungsartenResult';

export interface ErhebungState {
    currentOrt: ApiLocSingleResponse | null;
    erhebungen: ApiLocationResponse | null;
    loading: boolean;
    erhebungsarten: Array<ISelectErhebungsartenResult>;
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

    // IMPORTANT: DO NOT TOUCH THIS VARIABLE
    // Controls when map is loaded and if used by another function, leaflet will throw exceptions
    // !!!
    loading = false;

    // Use these two instead
    infLoading = false;
    erhLoading = false;

    erhebungsarten: Array<ISelectErhebungsartenResult> = [];
    
    @Mutation
    setCurrentOrt (ort: ApiLocSingleResponse | null) {
      this.currentOrt = ort;
    }

    @Mutation
    setLoading (loading: boolean) {
      this.loading = loading;
    }

    @Mutation
    setErhLoading (loading: boolean) {
      this.erhLoading = loading;
    }

    @Mutation
    setInfLoading (loading: boolean) {
      this.infLoading = loading;
    }

    @MutationAction({ mutate: ['erhebungen', 'loading'] })
    async fetchErhebungen () {
      this.context.commit('setLoading', true);
      console.log('trying to fetch data');
      const response = await getErhebungen();
      
      console.log('fetched data');
      return {
        erhebungen: response.data.orte,
        loading: false
      };
    }

    @MutationAction({ mutate: ['infErhebungen', 'infLoading'] })
    async fetchInfErhebungen(params: any) {
      this.context.commit('setInfLoading', true);
      const numbers: number[] = [];
      params.infs.forEach(function(value: any, index: any){
        numbers.push(value.id);
      });
      const ids = numbers.join(',');
      const response_inf = await getAudioErhebung(ids);
      console.log('fetched data');
      return {
        infErhebungen: response_inf.data,
        infLoading: false
      };
    }

    @MutationAction({ mutate: ['erhebungsarten', 'erhLoading'] })
    async fetchErhebungsArten() {
      // @ts-ignore
      this.context.commit('setErhLoading', true);
      console.log('trying to fetch data');
      const response = await api.dioePublic.getErhebungsArten();
      console.log('fetched data');
      return {
        erhebungsarten: response,
        erhLoading: false
      };
    }
    
}

export const erhebungModule = getModule(Erhebungen);
