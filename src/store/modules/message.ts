import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators';
import store from '@/store';

interface MessageState {
  errorMsg: string;
  successMsg: string;
  warnMsg: string;
  showError: boolean;
  showSuccess: boolean;
  showWarn: boolean;
}

@Module({
  name: 'messageHandler',
  store,
  dynamic: true
})
class Message extends VuexModule implements MessageState {
  errorMsg: string = '';
  showError: boolean = false;
  successMsg: string = '';
  showSuccess: boolean = false;
  warnMsg: string = '';
  showWarn: boolean = false;

  @Mutation
  setErrorMsg(msg: string) {
    this.errorMsg = msg;
  }

  @Mutation
  setWarnMsg(msg: string) {
    this.warnMsg = msg;
  }

  @Mutation
  setSuccessMsg(msg: string) {
    this.successMsg = msg;
  }

  @Mutation
  displayError() {
    this.showError = !this.showError;
  }

  @Mutation
  displaySuccess() {
    this.showSuccess = !this.showSuccess;
  }

  @Mutation
  displayWarn() {
    this.showWarn = !this.showWarn;
  }
  
}

export const messageHandler = getModule(Message);
