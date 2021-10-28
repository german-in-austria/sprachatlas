import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators'
import store from '@/store'

import { Phaen, PhaenBer } from '@/static/apiModels';

import api from '@/api';

export interface PhaeState {
    phaen: Array<Phaen>;
    phaenBer: Array<PhaenBer>;
    loading: boolean;
}

@Module({
  name: 'phaeModule',
  namespaced: true,
  store,
  dynamic: true
})
class Phaenomene extends VuexModule implements PhaeState {
  phaen: Array<Phaen> = [];
  phaenBer: Array<PhaenBer> = [];
  loading = false;
  
  @MutationAction({ mutate: ['phaenBer', 'loading'] })
  async fetchBereich () {
    this.loading = true
    console.log('trying to fetch data')
    const response = await api.dioePublic.getPhaenBer();
    console.log('fetched data');
    return {
      phaenBer: response,
      loading: false
    }
  }

  @MutationAction({mutate: ['phaen', 'loading']})
  async fetchAllPhaen (){
    this.loading = true;
    const res = await api.dioePublic.getPhaen();
    return {
      phaen: res,
      loading: false
    }
  }
  
  @MutationAction({ mutate: ['phaen', 'loading'] })
  async fetchPhaenByBerId (arg: {berId: number}) {
    this.loading = true
    console.log('trying to fetch data')
    const response = await api.dioePublic.getSinglePhaen(arg.berId);
    console.log('fetched data');
    return {
      phaen: response,
      loading: false
    }
  }
}

export const phaeModule = getModule(Phaenomene)
