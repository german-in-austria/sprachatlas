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
import {
  SearchItems,
  Parameter,
  LegendGlobal,
  Symbols,
  Hsl
} from '../../static/apiModels';
import { selectColor } from '@/helpers/helper';

export interface LegendState {
  legend: Array<LegendGlobal>;
  loading: boolean;
}

@Module({
  name: 'legendmodule',
  store,
  dynamic: true
})
class Legend extends VuexModule implements LegendState {
  loading = false;
  legend = [] as Array<LegendGlobal>;

  @Mutation
  addLegendEntry(e: any) {
    e.id = generateID();
    this.legend.push(e);

  }

  @Mutation
  editLegendElement(idx: number, content: LegendGlobal) {
    this.legend[idx] = content;
  }

  @Mutation
  editLegendByID(content: LegendGlobal) {
    const sid = content.id;
    const ele = this.legend.findIndex(el => el.id === sid);
    this.legend[ele] = content;
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

  @Action
  createLegendEntry(arg: {
    icon: Symbols,
    layer: L.LayerGroup,
    name: string,
    color: Hsl | null,
    radius: number,
    content: any,
    type: SearchItems}
  ): LegendGlobal {
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
  }
}

export const legendMod = getModule(Legend);
