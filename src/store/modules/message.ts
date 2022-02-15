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

const msgDebounce = debounce((activationTime: Date | null, id: number, context: any) => {
  if(activationTime && Date.now() - activationTime.getTime() >= SNACK_BAR_TIMEOUT)
    context.commit('setSingleShow', {shw: false, id: id});
}, SNACK_BAR_TIMEOUT);

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
  setSingleShow(arg: {shw: boolean, id: number}){
    if(arg.id <= 0) return;
    const ele = this.messageQueue.find((el) => new Date(el.time).getTime() === new Date(arg.id).getTime());
    if(ele){
      ele.show = arg.shw;
    }
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
  showDebounce(id: number) {
    msgDebounce(new Date(id), id, this.context);
  }

  @Action
  setMessage(msg: MessageLog) {
    this.context.commit('addMessage', msg);
    debounce(() => {
      if(this.activationTime && Date.now() - this.activationTime.getTime() >= SNACK_BAR_TIMEOUT)
        this.context.commit('setShow', false);
    }, 1000);
    this.context.dispatch('showDebounce', msg.time);
  }

  @Action
  setErrorMsg(msg: SimpleMsg) {
    this.context.dispatch('setMessage', {
      message: msg.message,
      icon: msg.icon,
      time: Date.now(),
      type: MessageType.error,
      show: true
    });
  }

  @Action
  setWarnMsg(msg: SimpleMsg) {
    this.context.dispatch('setMessage', {
      message: msg.message,
      icon: msg.icon,
      time: Date.now(),
      type: MessageType.info,
      show: true
    });
  }

  @Action
  setSuccessMsg(msg: SimpleMsg) {
    this.context.dispatch('setMessage', {
      message: msg.message,
      icon: msg.icon,
      time: Date.now(),
      type: MessageType.success,
      show: true
    });
  }
  
}

export const messageHandler = getModule(Message);
