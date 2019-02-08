import axios from 'axios';
import router from './router';
import store from '@/store/store';

import {
  SIGN_OUT,
} from '@/store/types/actions';
import {
  BACKEND_URL,
} from '@/const';

const axiosMiddleware = (method, url, params) => {
  const { token: AuthToken } = store.state.me;
  return axios({
    method,
    url,
    data: params,
    withCredentials: true,
    headers: {
      AuthToken,
    },
  })
    .then((response) => {
      const { data } = response;
      if (data.status && data.status === 'error') {
        if (data.type && data.type === 'AUTH') {
          store.dispatch(SIGN_OUT);
          router.push('/');
        }
        throw data;
      }
      return data;
    });
};

const API = {
  users: {
    me() {
      return axiosMiddleware('get', `${BACKEND_URL}/api/users/me`);
    },
  },
  messages: {
    getAll() {
      return axiosMiddleware('get', `${BACKEND_URL}/api/messages/main`);
    },
    put(message) {
      return axiosMiddleware('put', `${BACKEND_URL}/api/messages/main`, message);
    },
  },
};

export default API;
