<template>
  <div
    :class="[
      $style['message'],
      {
        [$style['my-message']]: user.id===me.id,
      }
    ]"
  >
    <div>{{ user.login }}</div>
    <div>{{ message.createdAt }}</div>
    <div>{{ message.message }}</div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  props: {
    messageId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState(['chatMessages', 'users', 'me']),
    message() {
      return this.chatMessages[this.messageId];
    },
    user() {
      const userId = this.chatMessages[this.messageId].user;
      return this.users[userId];
    },
  },
};
</script>

<style module>
.message {
  border: 1px solid grey;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
}
.my-message {
  background-color: #d0eaf0;
  text-align: right;
}
</style>
