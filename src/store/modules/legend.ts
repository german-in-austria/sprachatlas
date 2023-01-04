import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators';
import store from '@/store';
import { generateID } from '@/helpers/helper';
import Vue from '../../main';
import api from '@/api';

import {
  SearchItems,
  Parameter,
  LegendGlobal,
  Symbols,
  Hsl,
  pinData,
  circleData,
  pinDataVar,
  Description
} from '../../static/apiModels';
import { selectColor } from '@/helpers/helper';
import {
  AntwortTokenStamp,
  AufgabeStamp,
  ISelectAusbildungResult
} from '@/api/dioe-public-api';

export interface LegendState {
  legend: Array<LegendGlobal>;
  loading: boolean;
  erhArtFilter: Array<number>;
  ageRange: {
    lower: number;
    upper: number;
  };
  filterByAge: boolean;
  filterByArt: boolean;
  ausbildungsGrad: Array<ISelectAusbildungResult>;
}

@Module({
  name: 'legendmodule',
  store,
  dynamic: true
})
class Legend extends VuexModule implements LegendState {
  loading = false;
  legend = [] as Array<LegendGlobal>;
  ageRange = { lower: -1, upper: -1 };
  erhArtFilter: Array<number> = [];
  filterByAge = false;
  filterByArt = false;
  ausbildungsGrad = [];
  pinnedData = [] as Array<pinData>;
  pinDataVar: Array<pinDataVar> = [];

  @Mutation
  addPinDataVar(e: pinDataVar) {
    this.pinDataVar.push(e);
  }

  @Mutation
  removeElementFromPinDataVar(idx: number) {
    this.pinDataVar.splice(idx, 1);
  }

  @Mutation
  removeElementFromPinDataVarById(id: string) {
    const idx = this.pinDataVar.findIndex((el) => el.id === id);
    if (idx > -1) {
      this.pinDataVar.splice(idx, 1);
    }
  }

  @Mutation
  removeElementFromPinDataById(id: string) {
    const idx = this.pinnedData.findIndex((el) => el.id === id);
    if (idx > -1) {
      this.pinnedData.splice(idx, 1);
    }
  }

  @Mutation
  resetPinDataVar() {
    this.pinDataVar = [];
  }

  @Mutation
  editPinDataByID(content: pinDataVar) {
    const id = content.id;
    const ele = this.pinDataVar.findIndex((el) => el.id === id);
    if (ele > -1) {
      this.pinDataVar[ele] = content;
    }
  }

  @Mutation
  addPinData(e: pinData) {
    this.pinnedData.push(e);
  }

  @Mutation
  removeElement(idx: number) {
    this.pinnedData.splice(idx, 1);
  }

  @Mutation
  resetPinnedData() {
    this.pinnedData = [];
  }

  @Mutation
  editPinnedByID(content: pinData) {
    const id = content.id;
    const ele = this.pinnedData.findIndex((el) => el.id === id);
    if (ele > -1) {
      this.pinnedData[ele] = content;
    }
  }

  @Mutation
  editPinnedShowById(arg: { dataId: string; show: boolean; pinned: boolean }) {
    const id = arg.dataId;
    const ele = this.pinnedData.findIndex((el) => el.id === id);
    if (ele > -1) {
      this.pinnedData[ele].isPinned = arg.pinned;
      this.pinnedData[ele].showCard = arg.show;
    }
  }

  @Mutation
  editPinShowById(arg: { dataId: string; show: boolean }) {
    const id = arg.dataId;
    const ele = this.pinnedData.findIndex((el) => el.id === id);
    if (ele > -1) {
      this.pinnedData[ele].showCard = arg.show;
    }
  }

  @Mutation
  removeUnPinnedData() {
    this.pinnedData = this.pinnedData.filter((el) => el.isPinned);
  }

  @Mutation
  removeUnpinndDataVar() {
    this.pinDataVar = this.pinDataVar.filter((el) => el.isPinned);
  }

  @Mutation
  addLegendEntry(e: any) {
    e.id = generateID();
    this.legend.push(e);
  }

  @Mutation
  setErhArtFilter(ids: number[]) {
    this.erhArtFilter = ids;
    if (ids.length > 0) {
      this.filterByArt = true;
    } else {
      this.filterByArt = false;
    }
  }

  @Mutation
  setAgeRange(arg: { lower: number; upper: number }) {
    if (arg.lower >= 0 || arg.upper >= 0) {
      this.filterByAge = true;
    }
    if (arg.lower < 0 && arg.upper < 0) this.filterByAge = false;
    this.ageRange = { lower: arg.lower, upper: arg.upper };
  }

  @Mutation
  setFilterByAge(val: boolean) {
    this.filterByAge = val;
  }

  @Mutation
  setFilterByArt(val: boolean) {
    this.filterByArt = val;
  }

  @Mutation
  editLegendElement(idx: number, content: LegendGlobal) {
    this.legend[idx] = content;
  }

  @Mutation
  editLegendByID(content: LegendGlobal) {
    const sid = content.id;
    const ele = this.legend.findIndex((el) => el.id === sid);
    this.legend[ele] = content;
  }

  @Mutation
  removeEntryById(sid: string) {
    const idxEle = this.legend.findIndex((ele) => ele.id === sid);
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

  @Action
  createLegendEntry(arg: {
    icon: Symbols;
    layer: L.LayerGroup;
    name: string;
    color: Hsl | null;
    radius: number;
    content: any;
    type: SearchItems;
  }): LegendGlobal {
    const newLegend: LegendGlobal = {
      id: '',
      color: arg.color ? arg.color : selectColor(null),
      size: arg.radius,
      type: arg.type,
      content: arg.content,
      symbol: arg.icon,
      stroke: true,
      strokeWidth: 1,
      parameter: null,
      vis: true,
      name: arg.name,
      layer: arg.layer
    };
    return newLegend;
  }

  @Action
  deleteLegendEntry(el: LegendGlobal, idx: number | null) {
    const l = el.layer;
    l?.clearLayers();
    if (idx) {
      this.context.commit('removeEntryByIdx', idx);
    } else {
      this.context.commit('removeEntryById', el.id);
    }
    if (this.legend.length === 0) {
      this.context.commit('removeUnpinndDataVar');
      this.context.commit('removeUnPinnedData');
    }
  }

  @Action
  pushNewData(arg: {
    selOrt: circleData;
    selIdx: number;
    isPinned: boolean;
    antwortAudio: AntwortTokenStamp[];
    aufgabeAudio: AufgabeStamp[];
  }): pinData {
    const data: pinData = {
      id: generateID(),
      selectedOrt: arg.selOrt,
      selectedDataIdx: arg.selIdx,
      isPinned: arg.isPinned,
      showCard: true,
      antwortAudio: arg.antwortAudio,
      aufgabeAudio: arg.aufgabeAudio
    };
    if (this.pinnedData.length === 1 && !this.pinnedData[0].isPinned) {
      this.context.commit('removeElement', 0);
    } else if (this.pinnedData.length > 1) {
      this.context.commit('removeUnPinnedData');
    }
    this.context.commit('addPinData', data);
    return data;
  }

  @Action
  editPinnedData(el: pinData) {
    this.context.commit('editPinnedByID', el);
  }

  @Action
  pushNewPinDataVar(arg: {
    diagramTitle: string;
    diagramData: Array<Description>;
    isPinned: boolean;
    isShown: boolean;
  }): pinDataVar {
    const data: pinDataVar = {
      id: generateID(),
      diagramTitle: arg.diagramTitle,
      diagramData: arg.diagramData,
      isPinned: arg.isPinned,
      isShown: arg.isShown
    };
    if (this.pinDataVar.length === 1 && !this.pinDataVar[0].isPinned) {
      this.context.commit('removeElementFromPinDataVar', 0);
    } else if (this.pinDataVar.length > 1) {
      this.context.commit('removeUnpinndDataVar');
    }
    this.context.commit('addPinDataVar', data);
    return data;
  }

  @Action
  editPinnDataVar(el: pinDataVar) {
    this.context.commit('editPinDataByID', el);
  }

  @MutationAction({ mutate: ['ausbildungsGrad'] })
  async fetchAusbildung() {
    const res = await api.dioePublic.getAllAusbildung();
    return {
      ausbildungsGrad: res
    };
  }
}

export const legendMod = getModule(Legend);
