<template>
  <div>
    <button @click="signOutClick">SignOut</button>
    <div v-if="!wsConnected">
      Connection problem...
    </div>
    <h1>Chat</h1>
    <h2>Hello {{ me.login }}!</h2>
    <ChatFlow />
    <MessageForm />
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

import websocketChat from '@/websocket.js';

export default {
  components: {
    MessageForm,
    ChatFlow,
  },
  computed: {
    ...mapState(['me', 'wsConnected']),
  },
  mounted() {
    this.FETCH_MESSAGE_HISTORY();
    // Register WebWorker
    websocketChat.init();
  },
  methods: {
    ...mapActions({
      SIGN_OUT,
      FETCH_MESSAGE_HISTORY,
    }),
    signOutClick() {
      this.SIGN_OUT()
    },
  },
};
</script>
