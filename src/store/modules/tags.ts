import {
    Module,
    VuexModule,
    MutationAction,
    Mutation,
    Action,
    getModule
  } from 'vuex-module-decorators'
  import store from '@/store'
  
import { Parameter, Job, JobList } from '@/static/apiModels';
  
import { TagTree } from '@/api/dioe-public-api';
import api from '@/api';
import { getBerufe } from '@/api/erhebungen';
  
export interface TagState {
  tagList: TagTree | null;
  parameters: Parameter[];
  jobList: Job[];
  loading: boolean;
}
  
@Module({
  name: 'tagModule',
  namespaced: true,
  store,
  dynamic: true
})
class Tags extends VuexModule implements TagState {
  jobList: Job[] = [];
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
      setJobList(list: Job[]){
        this.jobList = list
      }
  
      @Mutation
      setLoading (loading: boolean) {
        this.loading = loading
      }
  
      @MutationAction({ mutate: ['tagList', 'loading'] })
      async fetchTags () {
        this.loading = true
        console.log('trying to fetch data')
        const response = await api.dioePublic.getTags();
        console.log('fetched data');
        return {
          tagList: response,
          loading: false
        }
      }

      @MutationAction({ mutate: ['jobList', 'loading'] })
      async fetchJobs () {
        this.loading = true
        console.log('trying to fetch data')
        const response = await getBerufe();
        console.log('fetched data');
        return {
          jobList: response.data,
          loading: false
        }
      }
  }
  
  export const tagModule = getModule(Tags)
  