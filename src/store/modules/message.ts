import {
  Module,
  VuexModule,
  MutationAction,
  Mutation,
  Action,
  getModule
} from 'vuex-module-decorators';
import store from '@/store';
import { MessageLog } from '@/models/MessageLog';
import { SimpleMsg } from '@/models/SimpleMsg';
import { MessageType } from '@/models/MessageType';

import { SNACK_BAR_TIMEOUT } from '@/constants/index';
import { debounce } from 'lodash';

interface MessageState {
  showSnackbar: boolean;
  messageQueue: Array<MessageLog>;
  activationTime: Date | null;
}

@Module({
  name: 'messageHandler',
  store,
  dynamic: true
})
class Message extends VuexModule implements MessageState {
  messageQueue: Array<MessageLog> = [];
  activationTime: Date | null = null;
  showSnackbar: boolean = false;
  errorMsg: string = '';
  showError: boolean = false;
  successMsg: string = '';
  showSuccess: boolean = false;
  warnMsg: string = '';
  showWarn: boolean = false;

  get queue() {
    return this.messageQueue;
  }

  get showSnack() {
    return this.showSnackbar;
  }

  get activation() {
    return this.activationTime;
  }

  @Mutation
  setShow(shw: boolean) {
    this.showSnackbar = shw;
  }

  @Mutation
  closeMsg(time: number){
    if(time === 0) return;
    const ele = this.messageQueue.find((el) => el.time.getTime() === time);
  }

  @Mutation
  addMessage(msg: MessageLog){
    const now = new Date();
    const newMsg: MessageLog = msg;
    if(!msg.time){
      newMsg.time = now;
    }

    this.messageQueue.push(newMsg);
    this.activationTime = now;
    this.showSnackbar = true;
  }

  @Action
  showDebounce() {
    const msgDebounce = debounce(() => {
      if(this.activationTime && Date.now() - this.activationTime.getTime() >= SNACK_BAR_TIMEOUT)
        this.context.commit('setShow', false);
    }, SNACK_BAR_TIMEOUT);
    msgDebounce();
  }

  @Action
  setMessage(msg: MessageLog) {
    this.context.commit('addMessage', msg);
    debounce(() => {
      if(this.activationTime && Date.now() - this.activationTime.getTime() >= SNACK_BAR_TIMEOUT)
        this.context.commit('setShow', false);
    }, 1000);
    this.context.dispatch('showDebounce');
  }

  @Action
  setErrorMsg(msg: SimpleMsg) {
    this.context.dispatch('setMessage', {
      message: msg.message,
      icon: msg.icon,
      time: Date.now(),
      type: MessageType.error
    });
  }

  @Action
  setWarnMsg(msg: SimpleMsg) {
    this.context.dispatch('setMessage', {
      message: msg.message,
      icon: msg.icon,
      time: Date.now(),
      type: MessageType.info
    });
  }

  @Action
  setSuccessMsg(msg: SimpleMsg) {
    this.context.dispatch('setMessage', {
      message: msg.message,
      icon: msg.icon,
      time: Date.now(),
      type: MessageType.success
    });
  }
  
}

export const messageHandler = getModule(Message);
