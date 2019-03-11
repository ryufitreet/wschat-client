import Vue from 'vue';
import Vuex from 'vuex';

import websocketChat from '@/websocket.js';

import {
  SET_AUTHORIZED_STATE,
  SET_AUTH_TOKEN,
  SET_ME,
  SET_MESSAGE,
  ADD_TO_CHAT_FLOW,
  ADD_TO_CHAT_MESSAGES,
  SET_USERS,
  SET_BUFFERED_MESSAGES,
  CHANGE_WS_CONNECTION_STATE,
  SET_CHAT_PAGE,
  SET_IS_LAST_PAGE,
  UNSHIFT_TO_CHAT_FLOW,
} from '@/store/types/mutations';

import {
  SIGN_OUT,
  INIT_STORE_LOCALSTORAGE,
  SEND_MESSAGE,
  FETCH_MESSAGE_HISTORY,
} from '@/store/types/actions';

import API from '@/api';

import { normalize } from 'normalizr';
import { messageListScheme, messageSchema } from './schema';


Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isAuthorized: !!localStorage.isAuthorized || false,
    me: {
      id: false,
      login: localStorage.userName || false,
      token: localStorage.at || null,
    },
    users: {},
    message: '',
    chatFlow: [],
    chatMessages: {},
    chatPage: 1,
    isLastPage: false,
    wsConnected: false,
  },
  mutations: {
    [SET_AUTHORIZED_STATE](state, payload) {
      state.isAuthorized = payload;
    },
    [SET_AUTH_TOKEN](state, payload) {
      state.me.token = payload;
    },
    [SET_ME](state, payload) {
      const { id, login } = payload;
      state.me.login = login;
      state.me.id = id;
    },
    [SET_MESSAGE](state, payload) {
      state.message = payload;
    },
    [ADD_TO_CHAT_FLOW](state, payload) {
      if (Array.isArray(payload)) {
        state.chatFlow.push(...payload);
      } else {
        state.chatFlow.push(payload);
      }
    },
    [UNSHIFT_TO_CHAT_FLOW](state, payload=[]) {
      state.chatFlow.unshift(...payload);
    },
    [ADD_TO_CHAT_MESSAGES](state, payload) {
      Object.keys(payload).forEach((messageId) => {
        state.chatMessages[messageId] = payload[messageId];
      });
    },
    [SET_USERS](state, payload) {
      const userIdList = Object.keys(payload);
      userIdList.forEach((userId) => {
        state.users[userId] = payload[userId];
      });
    },
    [CHANGE_WS_CONNECTION_STATE](state, payload) {
      state.wsConnected = payload;
    },
    [SET_CHAT_PAGE](state, page) {
      state.chatPage = page;
    },
    [SET_IS_LAST_PAGE](state, isLast) {
      state.isLastPage = isLast;
    },
  },
  actions: {
    // TODO send to server request too
    [SIGN_OUT]({ commit }) {
      commit(SET_AUTHORIZED_STATE, false);
      localStorage.removeItem('at');
      window.location.href = '/signin';
    },
    [INIT_STORE_LOCALSTORAGE]({ commit }) {
      if (localStorage.isAuthorized) {
        commit(SET_AUTHORIZED_STATE, JSON.parse(localStorage.isAuthorized));
      }
      if (localStorage.user) {
        commit(SET_ME, JSON.parse(localStorage.user));
      }
      if (localStorage.message) {
        commit(SET_MESSAGE, JSON.parse(localStorage.message));
      }
    },
    [FETCH_MESSAGE_HISTORY]({state, commit}, payload = {}) {
      const { page = 1 } = payload;
      return API.messages.getAll(page)
        .then((data) => {
          const normalizedData = normalize(data, messageListScheme);
          const { users={}, message={} } = normalizedData.entities;
          const { result: messageIdsList={} } = normalizedData;

          commit(SET_USERS, users);

          commit(UNSHIFT_TO_CHAT_FLOW, messageIdsList);
          commit(ADD_TO_CHAT_MESSAGES, message);
          commit(SET_CHAT_PAGE, page);
          if (data.length < 50) {
            commit(SET_IS_LAST_PAGE, true);
          }
        })
        .catch(error => console.error(error));
    },
    [SEND_MESSAGE]({ state, commit }) {
      const { message } = state;
      API.messages.put({ message })
        .then((res) => {
          // TODO понять что делать на ответ сервера
        });
    },
  },
});

store.dispatch(INIT_STORE_LOCALSTORAGE);

store.subscribe((mutation) => {
  const { type, payload } = mutation;
  switch (type) {
    case (SET_ME):
      localStorage.user = JSON.stringify(payload);
      break;
    case (SET_AUTHORIZED_STATE):
      localStorage.isAuthorized = JSON.stringify(payload);
      break;
    case (SET_MESSAGE):
      localStorage.message = JSON.stringify(payload);
      break;
    default:
      break;
  }
});

export default store;
