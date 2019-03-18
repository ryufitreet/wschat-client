import store from '@/store/store';

import {
  ADD_TO_CHAT_FLOW,
  CHANGE_WS_CONNECTION_STATE,
  SET_USERS,
  SET_USERS_COUNT_IN_CHAT,
  ADD_TO_CHAT_MESSAGES,
} from '@/store/types/mutations';

import {
  SIGN_OUT,
} from '@/store/types/actions';

import { messageSchema } from '@/store/schema';
import { normalize } from 'normalizr';

class WebSocketChat {
  constructor() {
    this.websocket = null;
    this.init = this.init.bind(this);
    this.isConnected = false;
  }

  init(callback) {
    // Make shared worker
    const { token } = store.state.me;
    const worker = new SharedWorker("sharedWorkerWs.js");
    this.onConnectedCallBack = callback;
    worker.port.start();
    
    worker.port.postMessage({
      e: 'START',
      d: {
        wsUrl: 'ws://localhost:8081',
        authToken: token,  
      },
    });

    worker.port.onmessage = (event) => {
      const { e, d } = event.data;
      console.log(`MESSAGE FROM WORKER`);
      console.log(event.data);
      if (e === 'MESSAGE') {
        this.onWsMessage(d);
      } else if (e === 'CLOSE_WS') {
        this.onCloseHandler(d);
      } else if (e === 'WS_CONNECTED') {
        this.onWsConnected();
      } else if (e === 'SIGN_OUT') {
        store.dispatch(SIGN_OUT);
      }
    }
    this.worker = worker;
    // TODO добавить ссылку на ws в переменную
  }

  onWsConnected() {
    this.isConnected = true;
    store.commit(CHANGE_WS_CONNECTION_STATE, true);
    if (typeof this.onConnectedCallBack === 'function') {
      console.log('Calback on Connection');
      this.onConnectedCallBack();
      this.onConnectedCallBack = null;
    }    
  }

  // TODO ПЕРЕНЕСТИ В SHAREDWORKER
  onCloseHandler(e) {
    console.error(e);
    this.isConnected = false;
    store.commit(CHANGE_WS_CONNECTION_STATE, false);
  }

  sendMessage(payload, type = 'MESSAGE') {
    this.worker.port.postMessage({
      e: 'MESSAGE',
      d: {
        type,
        payload,
      },
    });

  }

  closeConnection() {
    this.worker.port.postMessage({
      e: 'CLOSE_CONNECTION',
    });
  }

  onWsMessage(wsMessage) {
    console.log(`получил в onWsMessage`);
    console.log(wsMessage);
    const { type, payload } = wsMessage;
    if (type === 'NEW-MESSAGE') {
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
    } else if (type === 'USERS-COUNT-IN-CHAT') {
      store.commit(SET_USERS_COUNT_IN_CHAT, payload);
    } else if (type === 'AUTH') {
      const { status } = payload;
      if (status === true) {
        this.onWsConnected();
      }
    }
  }
}

export default new WebSocketChat();
