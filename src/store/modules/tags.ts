import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators';
import store from '@/store';

import {
  Parameter,
  Job,
  JobList,
  LegendList,
  TagSelection,
  TagOrteResults,
  SingleTag
} from '@/static/apiModels';

import { IGetPresetTagsResult } from '../../api/dioe-public-api/models/IGetPresetTagsResult';
import { TagTree } from '@/api/dioe-public-api';
import api from '@/api';
import { getBerufe } from '@/api/erhebungen';

export interface TagState {
  tagList: TagTree[] | null;
  parameters: Parameter[];
  legends: LegendList[];
  jobList: Job[];
  loading: boolean;
  tagSelection: Array<TagSelection>;
  tagOrteResults: Array<TagOrteResults>;
}

@Module({
  name: 'tagModule',
  namespaced: true,
  store,
  dynamic: true
})
class Tags extends VuexModule implements TagState {
  tagOrteResults: TagOrteResults[] = [];
  tagSelection: TagSelection[] = [];
  legends: LegendList[] = [];
  jobList: Job[] = [];
  parameters: Parameter[] = [];
  presetTags = [] as Array<IGetPresetTagsResult>;
  tagList: TagTree[] | null = null;
  childrenTag: TagTree[] = [];
  loading = false;

  get byUniqueURL() {
    return (name: string) => {
      return this.legends.find((e) => e.name === name);
    };
  }

  get tagOrteNum() {
    return this.tagOrteResults;
  }

  get tags() {
    return this.tagList ? this.tagList : ([] as TagTree[]);
  }

  @Mutation
  addParameter(parameter: Parameter) {
    this.parameters.push(parameter);
  }

  @Mutation
  addLegend(parameter: LegendList) {
    let currName = parameter.name;
    let i = 1;
    while (this.legends.find((e) => e.name === currName) !== undefined) {
      currName = parameter.name + ' ' + i;
      i += 1;
    }
    parameter.name = currName;
    parameter.visible = false;
    this.legends.push(parameter);
  }

  @Mutation
  editLegendName(name: string, idx: number) {
    this.legends[idx].name = name;
  }

  @Mutation
  addParameterToLegend(idx: number, para: Parameter) {
    const legend = this.legends[idx];
    legend.parameter.push(para);
    this.legends[idx] = legend;
  }

  @Action
  changeLegendName(name: string, idx: number) {
    if (idx > -1) {
      const leg = this.legends[idx].name;
      if (leg !== name)
        this.context.commit('editLegendName', { name: name, idx: idx });
    }
  }

  @Action
  addLegendParameter(leg: any) {
    const legend = this.legends.find((e) => e.name === leg.lName);
    if (legend !== undefined) {
      const idx = this.legends.indexOf(legend);
      // @ts-ignore
      this.context.commit('addParameterToLegend', {
        idx: idx,
        para: {} as Parameter
      });
    } else {
      const parameters = [];
      parameters.push(leg.parameter);
      const ls: LegendList = {} as LegendList;
      ls.name = leg.lname;
      ls.parameter = parameters;
      // @ts-ignore
      this.context.commit('addLegend', ls);
    }
  }

  @Mutation
  setTagList(ort: TagTree[] | null) {
    this.tagList = ort;
  }

  @Mutation
  setTagSelection(tags: TagSelection[]) {
    this.tagSelection = tags;
  }

  @Mutation
  setChildrenTag(tags: TagTree[]) {
    this.childrenTag = tags;
  }

  @Mutation
  setJobList(list: Job[]) {
    this.jobList = list;
  }

  @Mutation
  setParameters(list: Parameter[]) {
    this.parameters = list;
  }

  @Mutation
  setLoading(loading: boolean) {
    this.loading = loading;
  }

  @Mutation
  clearLegend() {
    this.legends = [];
  }

  @MutationAction({ mutate: ['tagList', 'loading'] })
  async fetchTags() {
    this.context.commit('setLoading', true);
    console.log('trying to fetch data');
    const response = await api.dioePublic.getTags();
    console.log('fetched data');
    return {
      tagList: response,
      loading: false
    };
  }

  @MutationAction({ mutate: ['tagList', 'loading'] })
  async fetchGenTags(arg: { gen: number }) {
    this.context.commit('setLoading', true);
    console.log('trying to fetch data');
    const response = await api.dioePublic.getTagGen(arg.gen);
    console.log('fetched data');
    return {
      tagList: response,
      loading: false
    };
  }

  @MutationAction({ mutate: ['tagOrteResults', 'loading'] })
  async fetchTagOrteResults(arg: { tagId: number }) {
    this.context.commit('setLoading', true);
    const res = await api.dioePublic.getTagOrte(arg.tagId);
    return {
      tagOrteResults: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ['tagOrteResults', 'loading'] })
  async fetchTagOrteResultsMultiple(arg: any[]) {
    this.context.commit('setLoading', true);
    const res = await api.dioePublic.getTagOrteMultiple(arg);
    return {
      tagOrteResults: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ['jobList', 'loading'] })
  async fetchJobs() {
    this.context.commit('setLoading', true);
    console.log('trying to fetch data');
    const response = await getBerufe();
    console.log('fetched data');
    return {
      jobList: response.data,
      loading: false
    };
  }

  @MutationAction({ mutate: ['presetTags', 'loading'] })
  async fetchPresetTags() {
    this.context.commit('setLoading', true);
    console.log('trying to fetch data');
    const response = await api.dioePublic.getPresetTags();
    console.log('fetched data');
    return {
      presetTags: response,
      loading: false
    };
  }

  @MutationAction({ mutate: ['tagOrteResults', 'loading'] })
  async fetchTagOrtePreset(arg: { ids: number[]; erhArt: number[] }) {
    this.context.commit('setLoading', true);
    const res = await api.dioePublic.getTagsFromPreset(arg);
    return {
      tagOrteResults: res,
      loading: false
    };
  }

  @MutationAction({ mutate: ['tagOrteResults', 'loading'] })
  async fetchPresetTagOrte(presetID: number) {
    this.context.commit('setLoading', true);
    console.log('trying to fetch data');
    const response = await api.dioePublic.getPresetOrte(presetID);
    console.log('fetched data');
    return {
      tagOrteResults: response,
      loading: false
    };
  }
}

export const tagModule = getModule(Tags);
