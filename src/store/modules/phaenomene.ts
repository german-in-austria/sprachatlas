import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators';
import store from '@/store';

import { PhaenBer } from '@/static/apiModels';

import api from '@/api';
import {
  Aset,
  ISelectTagByPhaenResult,
  ISelectPhaenResult
} from '@/api/dioe-public-api';

export interface PhaeState {
  phaen: Array<ISelectPhaenResult>;
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
  phaen: Array<ISelectPhaenResult> = [];
  phaenBer: Array<PhaenBer> = [];
  phaenTags: Array<ISelectTagByPhaenResult> = [];
  phaenAufgaben: Array<Aset> = [];

  loading = false;

  @Mutation
  setLoading(val: boolean) {
    this.loading = val;
  }

  @MutationAction({ mutate: ['phaenBer', 'loading'] })
  async fetchBereich() {
    this.context.commit('setLoading', true);
    console.log('trying to fetch data');
    const response = await api.dioePublic.getPhaenBer();
    console.log('fetched data');
    return {
      phaenBer: response,
      loading: false
    };
  }

  @MutationAction({ mutate: ['phaen', 'loading'] })
  async fetchAllPhaen() {
    this.context.commit('setLoading', true);
    const res = await api.dioePublic.getPhaen();
    return {
      phaen: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ['phaen', 'loading'] })
  async fetchPhaenByBerId(arg: { berId: number }) {
    this.context.commit('setLoading', true);
    console.log('trying to fetch data');
    const response = await api.dioePublic.getSinglePhaen(arg.berId);
    console.log('fetched data');
    return {
      phaen: response,
      loading: false
    };
  }

  @MutationAction({ mutate: ['phaenTags', 'loading'] })
  async fetchTagByPhaen(arg: { ids: number[] }) {
    this.context.commit('setLoading', true);
    console.log('trying to fetch data');
    const response = await api.dioePublic.getTagsByPhaen(arg);
    console.log('fetched data');
    return {
      phaenTags: response,
      loading: false
    };
  }

  @MutationAction({ mutate: ['phaenAufgaben', 'loading'] })
  async fetchAsetByPhaen(arg: { ids: number[] }) {
    this.context.commit('setLoading', true);
    console.log('trying to fetch data');
    const response = await api.dioePublic.getASetByPhaen(arg);
    console.log('fetched data');
    return {
      phaenAufgaben: response,
      loading: false
    };
  }
}

export const phaeModule = getModule(Phaenomene);
