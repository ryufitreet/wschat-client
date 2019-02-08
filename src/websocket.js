import store from '@/store/store';

import {
  ADD_TO_CHAT_FLOW,
  CHANGE_WS_CONNECTION_STATE,
  SET_USERS,
} from '@/store/types/mutations';

import { messageSchema } from '@/store/schema';
import { normalize } from 'normalizr';
import { ADD_TO_CHAT_MESSAGES } from './store/types/mutations';

class WebSocketChat {
  constructor() {
    this.websocket = null;
    this.init = this.init.bind(this);
    this.isConnected = false;
  }

  init() {
    // TODO добавить ссылку на ws в переменную
    this.websocket = new WebSocket('ws://localhost:8081');
    this.websocket.onopen = (event) => {
      this.isConnected = true;
      store.commit(CHANGE_WS_CONNECTION_STATE, true);
      // Auth
      const { token } = store.state.me;
      this.websocket.send(JSON.stringify({ type: 'AUTH', payload: { token } }));
    };

    this.websocket.onmessage = (e) => {
      const { data } = e;
      this.constructor.onChatMessage(data);
    };

    this.websocket.onclose = (e) => {
      this.constructor.onClose(e);
      this.isConnected = false;
      store.commit(CHANGE_WS_CONNECTION_STATE, false);
      const interval = setInterval(() => {
        if (this.isConnected) {
          clearInterval(interval);
          return;
        }
        this.init();
      }, 2000);
    };

  }

  static onClose(event) {
    console.log('CONNECTION CLOSED!!!');
    console.log(event);
  }

  static onChatMessage(wsMessage) {
    const wsMessageData = JSON.parse(wsMessage);
    const { type, payload } = wsMessageData;
    if (type === 'new-message') {
      const normilizedData = normalize(payload, messageSchema);

      const { result } = normilizedData;
      const { message, users } = normilizedData.entities;
      const { user } = Object.values(message)[0];
      const { state } = store;

      if (user === state.me.id && state.chatFlow.includes(result)) {
        store.commit(ADD_TO_CHAT_MESSAGES, message);
      } else {
        store.commit(ADD_TO_CHAT_FLOW, result);
        store.commit(ADD_TO_CHAT_MESSAGES, message);
        store.commit(SET_USERS, users);
      }
    }
  }
}

export default new WebSocketChat();
