import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import store from "@/store";
import { generateID } from "@/helpers/helper";
import Vue from "../../main";
import {} from "../../static/apiModels";
import {
  ISelectAufgabenFromSetResult,
  ISelectAufgabenResult,
  ISelectAufgabenSetResult
} from "@/api/dioe-public-api/models";

export interface AufgabenState {
  legend: Array<ISelectAufgabenSetResult>;
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
    async fetchAufgabenSet(arg: {phaenId: number }){
        this.loading = true;
        const res = await api.dioePublic.getAufgabenSets(arg.phaenId);
        return {
            aufgabenSet: res,
            loading: false
        }
    }

    @MutationAction({ mutate: ['aufgaben', 'loading'] })
    async fetchAufgabeBasedPhaen(arg: {phaenId: number }){
        this.loading = true;
        const res = await api.dioePublic.getAufgabenPhaen(arg.phaenId);
        return {
            aufgaben: res,
            loading: false
        }
    }

    @MutationAction({ mutate: ['aufgabenFromSet', 'loading'] })
    async fetchAufgabeBasedSet(arg: {aufgabenSetId: number }){
        this.loading = true;
        const res = await api.dioePublic.getTagOrte1(arg.aufgabenSetId);
        return {
            aufgabenFromSet: res,
            loading: false
        }
    }
}

export const aufgabenModule = getModule(Aufgaben);
