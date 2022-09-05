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
import { generateID } from '@/helpers/helper';
import Vue from '../../main';
import {} from '../../static/apiModels';
import { ISelectAufgabenFromSetResult } from '../../api/dioe-public-api/models/ISelectAufgabenFromSetResult';
import { ISelectAufgabenResult } from '../../api/dioe-public-api/models/ISelectAufgabenResult';
import { ISelectAufgabenSetResult } from '../../api/dioe-public-api/models/ISelectAufgabenSetResult';
import { ISelectAllAufgabenResult } from '../../api/dioe-public-api/models/ISelectAllAufgabenResult';
import { AntwortTokenStamp } from '../../api/dioe-public-api/models/AntwortTokenStamp';
import { ISelectSatzResult } from '../../api/dioe-public-api/models/ISelectSatzResult';
import { ISelectOrtAufgabeResult } from '../../api/dioe-public-api/models/ISelectOrtAufgabeResult';
import { AufgabeStamp } from '../../api/dioe-public-api/models/AufgabeStamp';
import { ISelectAllTeamsResult } from '../../api/dioe-public-api/models/ISelectAllTeamsResult';

import type { AntwortenFromAufgabe } from '../../api/dioe-public-api/models/AntwortenFromAufgabe';
import { selectionObject } from '@/api/dioe-public-api';

export interface AufgabenState {
  aufgabenSet: Array<ISelectAufgabenSetResult>;
  antwortenAudio: Array<AntwortTokenStamp>;
  loading: boolean;
}

@Module({
  name: 'aufgabenModule',
  namespaced: true,
  store,
  dynamic: true
})
class Aufgaben extends VuexModule implements AufgabenState {
  aufgabenSet = [] as Array<ISelectAufgabenSetResult>;
  aufgaben = [] as Array<ISelectAufgabenResult>;
  aufgabenFromSet = [] as Array<ISelectAufgabenFromSetResult>;
  antwortenAudio = [] as Array<AntwortTokenStamp>;
  allAufgaben = [] as Array<ISelectAllAufgabenResult>;
  allSaetze = [] as Array<ISelectSatzResult>;

  antworten = [] as Array<AntwortenFromAufgabe>;
  aufgabenOrt = [] as Array<ISelectOrtAufgabeResult>;
  aufgabeSingleOrt = [] as Array<AufgabeStamp>;
  teams = [] as Array<ISelectAllTeamsResult>;
  loading = false;

  @Mutation
  clearAufgabenSet() {
    this.aufgabenSet = [];
  }

  @Mutation
  clearAufgaben() {
    this.aufgaben = [];
  }

  @Mutation
  clearAufgabenFromSet() {
    this.aufgabenFromSet = [];
  }

  @Mutation
  clearAntworten() {
    this.antwortenAudio = [];
  }

  @Mutation
  setLoading(val: boolean) {
    this.loading = val;
  }

  @MutationAction({ mutate: ['aufgabenSet', 'loading'] })
  async fetchAufgabenSet(arg: { ids: number[] }) {
    this.context.commit('setLoading', true);
    const res = await api.dioePublic.getAufgabenSets(arg);
    return {
      aufgabenSet: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ['aufgaben', 'loading'] })
  async fetchAufgabeBasedPhaen(arg: { ids: number[] }) {
    this.context.commit('setLoading', true);
    const res = await api.dioePublic.getAufgabenPhaen(arg);
    return {
      aufgaben: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ['aufgabenFromSet', 'loading'] })
  async fetchAufgabeBasedSet(arg: { ids: number[] }) {
    this.context.commit('setLoading', true);
    const res = await api.dioePublic.getTagOrte1(arg);
    return {
      aufgabenFromSet: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ['antwortenAudio', 'loading'] })
  async fetchAntwortAudio(arg: {
    ids: number[];
    osmId: number;
    ageLower: number;
    ageUpper: number;
    ausbildung?: string;
    beruf_id?: number;
    weiblich?: boolean;
    text?: selectionObject[];
    ortho?: selectionObject[];
    lemma?: selectionObject[];
  }) {
    // @ts-ignore
    this.context.commit('setLoading', true);
    console.log('Getting Antworten');
    const res = await api.dioePublic.getAntByTags(arg);
    console.log('Done!');
    return {
      antwortenAudio: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ['allAufgaben', 'loading'] })
  async fetchAllAufgaben() {
    // @ts-ignore
    this.context.commit('setLoading', true);
    console.log('Getting Antworten');
    const res = await api.dioePublic.getAllAufgaben();
    console.log('Done!');
    return {
      allAufgaben: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ['allSaetze', 'loading'] })
  async fetchSaetze(arg: { query: string }) {
    // @ts-ignore
    this.context.commit('setLoading', true);
    const res = await api.dioePublic.getSatz(arg.query);
    return {
      allSaetze: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ['antworten', 'loading'] })
  async fetchAntworten(arg: { sid?: number; aid?: number }) {
    // @ts-ignore
    this.context.commit('setLoading', true);
    const res = await api.dioePublic.getAntbyAufgaben(arg.sid, arg.aid);
    return {
      antworten: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ['aufgabenOrt', 'loading'] })
  async fetchAufgabenOrt(arg: { ids: number[]; asetIds?: number[] }) {
    // @ts-ignore
    this.context.commit('setLoading', true);
    const res = await api.dioePublic.getAufgabenOrte(arg);
    return {
      aufgabenOrt: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ['aufgabeSingleOrt', 'loading'] })
  async fetchAufgabenAudioOrt(arg: {
    ids: number[];
    osmId: number;
    ageLower: number;
    ageUpper: number;
  }) {
    // @ts-ignore
    this.context.commit('setLoading', true);
    const res = await api.dioePublic.getAntAudioByOrt(arg);
    return {
      aufgabeSingleOrt: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ['teams', 'loading'] })
  async fetchAllTeams() {
    // @ts-ignore
    this.context.commit('setLoading', true);
    const res = await api.dioePublic.getAllTeams();
    return {
      teams: res.filter((el: ISelectAllTeamsResult) =>
        ['PP02', 'PP03', 'PP04'].includes(el.team ? el.team : '')
      ),
      loading: false
    };
  }
}

export const aufgabenModule = getModule(Aufgaben);
