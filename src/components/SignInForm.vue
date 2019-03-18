<template>
  <div
    @keydown.enter="sendSignInRequest"
    class="enter-form"
  >
    <div class="enter-form__title">Sign In</div>
    <div
      class="enter-form__error enter-form__signin-error"
    >
      <transition name="appear">
        <div v-show="error">
          Login or password are incorrect.
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
      @click="sendSignInRequest"
      class="btn btn-empty btn-blue"
    >
      Sign In
    </button>
    <div class="enter-form__under-form-link">
      <router-link tag="a" to="/signup">Sign Up</router-link> for new users
    </div>
  </div>
</template>

<script>
import {
  mapMutations,
} from 'vuex';
import {
  SET_AUTH_TOKEN,
} from '@/store/types/mutations';
import { BACKEND_URL } from '@/const';
import axios from 'axios';
import { makeAuthToken } from '@/utils';

export default {
  data() {
    const login = 'admin';
    const password = 'admin';
    const error = false;

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
    password() {
      this.error = false;
    },
  },
  methods: {
    ...mapMutations([SET_AUTH_TOKEN]),
    sendSignInRequest() {
      const { login, password } = this;
      axios.post(`${BACKEND_URL}/signin`, {
        login,
        password,
      }, {
        withCredentials: true,
      })
        .then((res) => {
          const { status, token } = res.data;
          if (status === true) {
            const authToken = makeAuthToken(login, token);
            this.SET_AUTH_TOKEN(authToken);
            localStorage.at = authToken;
            this.$router.push('/');
          } else {
            this.error = true;
          }
        })
        .catch(err => console.error(err));
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
