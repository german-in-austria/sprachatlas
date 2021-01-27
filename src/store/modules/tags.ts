import {
    Module,
    VuexModule,
    MutationAction,
    Mutation,
    Action,
    getModule
  } from 'vuex-module-decorators'
  import store from '@/store'
  import {
    getTags,
  } from '../../api/tags'
  
import { Parameter } from '@/static/apiModels';
  
import { TagTree } from '@/api/dioe-public-api';
  
  export interface TagState {
      tagList: TagTree | null;
      parameters: Parameter[];
      loading: boolean;
  }
  
  @Module({
    name: 'tagModule',
    namespaced: true,
    store,
    dynamic: true
})
class Tags extends VuexModule implements TagState {
      parameters: Parameter[] = [];
      tagList: TagTree | null = null;
      loading = false;
      
      @Mutation
      addParameter (parameter: Parameter) {
        this.parameters.push(parameter);
      }
  
      @Mutation
      setTagList (ort: TagTree | null) {
        this.tagList = ort
      }
  
      @Mutation
      setLoading (loading: boolean) {
        this.loading = loading
      }
  
      @MutationAction({ mutate: ['tagList', 'loading'] })
      async fetchTags () {
        this.loading = true
        console.log('trying to fetch data')
        const response = await getTags();
        console.log('fetched data');
        return {
          tagList: response.data,
          loading: false
        }
      }
  }
  
  export const tagModule = getModule(Tags)
  