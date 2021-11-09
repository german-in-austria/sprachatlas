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
import {
  SearchItems,
  Parameter,
  LegendGlobal
} from "../../static/apiModels";

export interface LegendState {
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
  legend = [] as Array<LegendGlobal>;

  @Mutation
  addLegendEntry(
    color: string,
    size: number,
    type: SearchItems,
    content: any,
    stroke: boolean,
    strokeWidth: number,
    parameter: Parameter | null,
    vis: boolean,
    name: string
  ) {
    this.legend.push({
      id: generateID(),
      color,
      size,
      type,
      content,
      stroke,
      strokeWidth,
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
  removeEntryById(sid: string) {
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
