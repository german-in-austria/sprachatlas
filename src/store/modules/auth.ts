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
import { checkAuthentication } from '@/api/export';

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

  @Mutation
  setcurrentUser(user: authUser) {
    this.currentUser = user;
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
}
export const authModule = getModule(Auth);
