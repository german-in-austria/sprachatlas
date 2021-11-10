import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import store from "@/store";
import api from '@/api';
import { generateID } from "@/helpers/helper";
import Vue from "../../main";
import {} from "../../static/apiModels";
import {ISelectAufgabenFromSetResult} from "../../api/dioe-public-api/models/ISelectAufgabenFromSetResult";
import {ISelectAufgabenResult} from "../../api/dioe-public-api/models/ISelectAufgabenResult";
import {ISelectAufgabenSetResult} from "../../api/dioe-public-api/models/ISelectAufgabenSetResult";

export interface AufgabenState {
  aufgabenSet: Array<ISelectAufgabenSetResult>;
  loading: boolean;
}

@Module({
  name: "aufgabenModule",
  namespaced: true,
  store,
  dynamic: true
})
class Aufgaben extends VuexModule implements AufgabenState{
    aufgabenSet = [] as Array<ISelectAufgabenSetResult>;
    aufgaben = [] as Array<ISelectAufgabenResult>;
    aufgabenFromSet = [] as Array<ISelectAufgabenFromSetResult>;
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

    @MutationAction({ mutate: ['aufgabenSet', 'loading']})
    async fetchAufgabenSet(arg: {ids: number[] }){
        this.loading = true;
        const res = await api.dioePublic.getAufgabenSets(arg);
        return {
            aufgabenSet: res,
            loading: false
        }
    }

    @MutationAction({ mutate: ['aufgaben', 'loading'] })
    async fetchAufgabeBasedPhaen(arg: {ids: number[] }){
        this.loading = true;
        const res = await api.dioePublic.getAufgabenPhaen(arg);
        return {
            aufgaben: res,
            loading: false
        }
    }

    @MutationAction({ mutate: ['aufgabenFromSet', 'loading'] })
    async fetchAufgabeBasedSet(arg: {ids: number[] }){
        this.loading = true;
        const res = await api.dioePublic.getTagOrte1(arg);
        return {
            aufgabenFromSet: res,
            loading: false
        }
    }
}

export const aufgabenModule = getModule(Aufgaben);
