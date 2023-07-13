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

import { authUser, exportMap } from '../../static/apiModels';
import {
  checkAuthentication,
  postNewExportLink,
  getAllExportedMaps
} from '@/api/export';

export interface ErhebungState {
  currentUser: authUser;
  loggedIn: boolean;
}

@Module({
  name: 'authModule',
  namespaced: true,
  store,
  dynamic: true
})
class Auth extends VuexModule implements ErhebungState {
  currentUser: authUser = {} as authUser;
  exportedMaps: Array<exportMap> = [];
  loading: boolean = false;
  loggedIn: boolean = false;
  exportId: any = {};

  @Mutation
  setcurrentUser(user: authUser) {
    this.currentUser = user;
  }

  @Mutation
  setExportId(id: string) {
    this.exportId = id;
  }

  @Mutation
  setLoading(val: boolean) {
    this.loading = val;
  }

  @Mutation
  setLoggedIn(val: boolean) {
    this.loggedIn = val;
  }

  @MutationAction({ mutate: ['currentUser', 'loading', 'loggedIn'] })
  async fetchCurrentUser() {
    this.context.commit('setLoading', true);
    const res = await checkAuthentication().then((response) => {
      return { status: response.status, data: response.data };
    });
    return {
      currentUser: res.data,
      loading: false,
      loggedIn: res.data.error ? false : true
    };
  }

  @MutationAction({ mutate: ['exportId', 'loading'] })
  async postExportLink(arg: {
    data: string;
    url: string;
    public: boolean;
    name: string;
  }) {
    this.context.commit('setLoading', true);
    const res = await postNewExportLink(
      arg.data,
      arg.url,
      this.currentUser.user.id,
      arg.public,
      arg.name
    );
    return {
      exportId: res.data,
      loading: false
    };
  }

  @MutationAction({ mutate: ['exportedMaps', 'loading'] })
  async getAllMaps() {
    this.context.commit('setLoading', true);
    const res = await getAllExportedMaps();
    return {
      exportedMaps: this.loggedIn
        ? res.data
        : res.data.filter((e: any) => e.public === true),
      loading: false
    };
  }
}
export const authModule = getModule(Auth);
