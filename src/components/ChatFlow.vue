<template>
  <div :class="$style['chat-flow-container']">
    <Message
      v-for="messageId in chatFlow"
      :key="messageId"
      :message-id="messageId"
    />
  </div>
</template>

<script>
import {
  mapState,
} from 'vuex';

import Message from './ChatMessage.vue';

export default {
  components: {
    Message,
  },
  computed: {
    ...mapState(['chatFlow']),
  },
};
</script>

<style module>
.chat-flow-container {
  border: 1px solid gold;
  padding: 5px;
}
</style>
