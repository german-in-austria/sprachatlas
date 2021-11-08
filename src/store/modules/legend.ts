import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
  getModule
} from "vuex-module-decorators";
import store from "@/store";
import { getAudioErhebung, getErhebungen } from "../../api/erhebungen";
import { generateID } from "@/helpers/helper";
import { AxiosResponse } from "axios";
import Vue from "../../main";
import {
  SearchItems,
  Parameter,
  ApiLocationResponse,
  ApiLocSingleResponse,
  SingleInfResponse,
  ApiInfErhResponse,
  LegendGlobal
} from "../../static/apiModels";

export interface ErhebungState {
  legend: Array<LegendGlobal>;
  loading: boolean;
}

@Module({
  name: "legendMod",
  namespaced: true,
  store,
  dynamic: true
})
class Legend extends VuexModule implements LegendState {
  loading = false;
  legend = [] as LegendGlobal;

  @Mutation
  addLegendEntry(
    color: string,
    type: SearchItems,
    content: any,
    stroke: boolean,
    strokeWidth: number,
    lat: string | null,
    lon: string | null,
    parameter: Parameter | null,
    vis: boolean,
    name: string
  ) {
    this.legend.push({
      id: generateID(),
      color,
      type,
      content,
      stroke,
      strokeWidth,
      lat,
      lon,
      parameter,
      vis,
      name
    });
  }

  @Mutation
  editLegendElement(idx: number, content: LegendGlobal) {
    this.legend[idx] = content;
  }

  @Mutation
  removeEntryById(sid: number) {
    const idxEle = this.legend.findIndex(ele => ele.id === sid);
    if (idxEle > -1) {
      this.legend.splice(idxEle, 1);
    }
  }

  @Mutation
  removeEntryByIdx(idx: number) {
    if (idx > -1 && idx < this.legend.length) {
      this.legend.splice(idx, 1);
    }
  }

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  @Mutation
  setLegend(l: Array<LegendGlobal>) {
    this.legend = l;
  }

  @Mutation
  clearLegend() {
    this.legend = [];
  }
}

export const legendMod = getModule(Legend);
