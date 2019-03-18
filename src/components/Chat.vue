<template>
  <div>
    <div :class="$style['header-container']">
      <div>
        <div :class="$style['logo']">
          Ch@t1k!)
        </div>
        <div>
          {{ me.login }}
        </div>
      </div>
      <div
        :class="$style['users-list-btn-cnt']"
      >
        <div
          :class="$style['users-list-btn']"
          @click="toggleUsersList"
        >
          <template v-if="usersCountInChat !== -1">
            {{ usersCountInChat }} users online
          </template>
        </div>
        <transition name="users-list">
          <div
            v-if="usersListShowed"
            :class="$style['users-list-container']"
          >
            <UsersList />
          </div>
        </transition>
      </div>
      <div>
        <div
          @click="signOutClick"
          :class="$style['log-out-btn']"
        >
          <eva-icon name="log-out" fill="#0088cc"></eva-icon>
        </div>
      </div>
    </div>
    <div v-if="!wsConnected">
      Connection problem...
    </div>
    
    <div :class="$style['chat-wrapper']">
      <ChatFlow />
      <MessageForm />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import {
  SIGN_OUT,
  FETCH_MESSAGE_HISTORY,
} from '@/store/types/actions';

import ChatFlow from './ChatFlow.vue';
import MessageForm from './MessageForm.vue';
import UsersList from './UsersList.vue';

import websocketChat from '@/websocket.js';

export default {
  components: {
    MessageForm,
    ChatFlow,
    UsersList,
  },
  data() {
    const usersListShowed = false;

    return {
      usersListShowed,
    };
  },
  computed: {
    ...mapState([
        'me',
        'wsConnected',
        'usersCountInChat',
      ]),
  },
  mounted() {
    this.FETCH_MESSAGE_HISTORY();
    // Register WebWorker
    websocketChat.init(() => {
      websocketChat.sendMessage({}, 'GET_USERS_COUNT');
    });
  },
  methods: {
    ...mapActions({
      SIGN_OUT,
      FETCH_MESSAGE_HISTORY,
    }),
    signOutClick() {
      this.SIGN_OUT();
    },
    toggleUsersList() {
      this.usersListShowed = !this.usersListShowed;
    },
  },
};
</script>

<style>
.users-list-enter-active, .users-list-leave-active {
  transition: all .4s ease-in-out;
}
.users-list-enter, .users-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

<style module>
.chat-wrapper {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}
.logo {
  font-size: 16px;
  font-weight: 600;
}
.header-container {
  display: flex;
  height: 40px;
  align-items: center;
  color: #0088cc;
  justify-content: space-between;
  padding-left: 15px;
  padding-right: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  position: relative;
  z-index: 10;
}
.users-list-btn-cnt {
  position: absolute;
  left: 0px;
  width: 100%;
  text-align: center;
}
.users-list-btn {
  display: inline;
  cursor: pointer;
}

.users-list-container {
  position: absolute;
  top: 35px;
  transform: translate(-50%);
  left: 50%;
}
.log-out-btn {
  cursor: pointer;
  z-index: 50;
  position: relative;
}
</style>
