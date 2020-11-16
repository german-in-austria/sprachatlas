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
import { ApiLocationResponse, ApiLocSingleResponse } from '../../static/apiModels'

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
    loading = false;

    @Mutation
    setCurrentOrt (ort: ApiLocSingleResponse | null) {
      this.currentOrt = ort
    }

    @Mutation
    setLoading (loading: boolean) {
      this.loading = loading
    }

    @MutationAction({ mutate: ['erhebungen', 'loading'] })
    async fetchErhebungen () {
      this.loading = true
      console.log('trying to fetch data')
      const response = await getErhebungen()
      console.log('fetched data')
      return {
        erhebungen: response.data.orte,
        loading: false
      }
    }
}

export const erhebungModule = getModule(Erhebungen)
