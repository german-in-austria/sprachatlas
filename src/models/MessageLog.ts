import { MessageType } from './MessageType';

export interface MessageLog {
  message: string;
  time: Date;
  icon: string;
  type: MessageType;
  show: boolean;
}
