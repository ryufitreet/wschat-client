<template>
  <div :class="[$style['container'], (isMyMessage?$style['container-my-mes']: $style['container-not-my-mes'])]">
    <div
      :class="[
        $style['message'], (isMyMessage?$style['my-mes']:$style['not-my-mes'])
      ]"
    >
      <div
        v-if="!isMyMessage"
        :class="$style['message-author']"
      >
        {{ user.login }}
      </div>
      <div :class="$style['message-text']">
        <pre>{{ message.message }}</pre>
      </div>
      <div :class="$style['time']">{{ time }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import moment from 'moment';

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
    isMyMessage() {
      return this.user.id === this.me.id;
    },
    time() {
      return moment(this.message.createdAt).format('HH:mm');
    },
  },
};
</script>

<style module>
.message {
  padding-left: 10px;
  padding-right: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 5px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  position: relative;
  min-height: 28px;
}
.message-author {
  color: #0088cc;
  font-weight: 600;
}
.container {
  display: flex;
}
.container-my-mes {
  justify-content: flex-end;
  padding-left: 5%;
  text-align: right;
}
.container-not-my-mes {
  justify-content: flex-start;
  padding-right: 5%;
  text-align: left;
}
.message-text {
  margin-top: 5px;
  margin-bottom: 5px;
  padding-right: 30px;
}
.time {
  text-align: right;
  color: #aaa;
  font-size: 12px;
  position: absolute;
  bottom: 2px;
  right: 2px;

}
.my-mes {
  background-color: #EFFDDE;
}
</style>
