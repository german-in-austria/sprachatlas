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

import { authUser } from '../../static/apiModels';
import { checkAuthentication, postNewExportLink } from '@/api/export';

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
  loading: boolean = false;
  loggedIn: boolean = false;
  exportId: string = '';

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
  async postExportLink(arg: { data: string; url: string }) {
    this.context.commit('setLoading', true);
    const res = await postNewExportLink(arg.data, arg.url);
    return {
      exportId: res.data,
      loading: false
    };
  }
}
export const authModule = getModule(Auth);
