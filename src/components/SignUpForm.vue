<template>
  <div
    @keydown.enter="sendSignUpRequest"
    class="enter-form"
  >
    <div class="enter-form__title">Sign Up</div>
    <div
      class="enter-form__error enter-form__signup-error"
    >
      <transition name="appear">
        <div v-show="error">
          This login already in use.
        </div>
      </transition>
    </div>
    <input
      v-model="login"
      type="text"
      placeholder="LOGIN"
      class="enter-form__input enter-form__login-input"
    >
    <input
      v-model="password"
      type="password"
      placeholder="PASSWORD"
      class="enter-form__input enter-form__password-input"
    >
    <button
      @click="sendSignUpRequest"
      class="btn btn-empty btn-green"
    >
      Sign Up
    </button>
    <div class="enter-form__under-form-link">
      <router-link tag="a" to="/signin">Sign in</router-link> if you with us
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { BACKEND_URL } from '@/const';
import axios from 'axios';
import { makeAuthToken } from '@/utils';

import {
  SET_AUTH_TOKEN,
} from '@/store/types/mutations';

export default {
  data() {
    const login = '';
    const password = '';
    const error = '';

    return {
      login,
      password,
      error,
    };
  },
  watch: {
    login() {
      this.error = false;
    },
  },
  methods: {
    ...mapMutations([SET_AUTH_TOKEN]),
    sendSignUpRequest() {
      const { login, password } = this;

      const formData = new FormData();
      formData.append('login', login);
      formData.append('password', password);

      axios.post(`${BACKEND_URL}/signup`, {
        login,
        password,
      })
        .then((res) => {
          const { status, token = '' } = res.data;
          if (status === true) {
            // TODO должно быть в экшнах
            // Зачем дублировать запись в стор 
            // и запись в лс пока не понятно ???????
            const authToken = makeAuthToken(login, token);
            this.SET_AUTH_TOKEN(authToken);
            localStorage.at = authToken;
            this.$router.push('/');
          } else {
            this.error = true;
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>

<style>
.appear-enter-active, .appear-leave-active {
  transition: all .5s;
}
.appear-enter, .appear-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
