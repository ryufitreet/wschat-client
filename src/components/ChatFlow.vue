<template>
  <div
    :class="$style['chat-flow-container']"
    ref="container"
  >
  <div :class="$style['scroll-buffer']">
    <div v-if="isHistoryFetching">Loading...</div>
  </div>
  <div
    v-for="(messageId) in chatFlow"
    :key="messageId"
  >
    <div :class="$style['date-delim-wrapper']">
      <div
        v-if="dateDelimiterArray[messageId]"
        :class="$style['date-delim']"
      >
        {{ dateDelimiterArray[messageId] }}
      </div>
    </div>
    <Message
      :message-id="messageId"
    />
  </div>
  </div>
</template>

<script>
import {
  mapState,
  mapActions,
} from 'vuex';

import { FETCH_MESSAGE_HISTORY } from '@/store/types/actions';
import { ADD_TO_CHAT_MESSAGES } from '@/store/types/mutations';

import moment from 'moment';

import Message from './ChatMessage.vue';

export default {
  components: {
    Message,
  },
  data() {
    const storeUnsub = null;
    const isHistoryFetching = false;

    return {
      storeUnsub,
      isHistoryFetching,
    };
  },
  watch: {
    chatFlow() {
      const { container } = this.$refs;
      const { scrollTop, clientHeight, scrollHeight } = container;
      const onBottom = scrollHeight - scrollTop === clientHeight;

      if (onBottom) {
        this.$nextTick(this.setScrollToTheBottom);
      }
    },
  },
  computed: {
    ...mapState([
      'chatFlow',
      'me',
      'chatMessages',
      'chatPage',
      'isLastPage',
    ]),
    dateDelimiterArray() {
      const result = {};
      if (this.chatFlow.length === 0) return result;
      const { createdAt } = this.chatMessages[this.chatFlow[0]];
      const veryFirst = moment(createdAt).format('D MMMM');
      result[this.chatFlow[0]] = veryFirst;

      this.chatFlow.forEach((messId, i) => {
        const currMessId = this.chatFlow[i];
        const nextMessId = this.chatFlow[i + 1];
        if (!nextMessId) return;

        const { createdAt: curr } = this.chatMessages[currMessId];
        const { createdAt: next } = this.chatMessages[nextMessId];
        const dateDiff = moment(next).diff(curr, 'day');

        if (dateDiff) {
          result[nextMessId] = moment(next).format('D MMMM');
        }
      });

      return result;
    },
  },
  mounted() {
    this.storeUnsub = this.$store.subscribe(this.onMutation);
    this.setScrollToTheBottom();
    this.$refs.container.addEventListener('scroll', this.onScroll);
  },
  beforeDestroy() {
    this.$refs.container.removeEventListener('scroll', this.onScroll);
    this.storeUnsub();
  },
  methods: {
    ...mapActions([
      FETCH_MESSAGE_HISTORY,
    ]),
    setScrollToTheBottom() {
      this.$nextTick(() => {
        const { clientHeight, scrollHeight } = this.$refs.container;
        this.$refs.container.scrollTop = scrollHeight - clientHeight;
      });
    },
    onMutation(mutation) {
      const { type, payload } = mutation;
      if (type === ADD_TO_CHAT_MESSAGES) {
        const haveMyMessage = Object.keys(payload).some((messageId) => {
          return this.me.id === payload[messageId].user;
        });
        if (haveMyMessage) {
          this.setScrollToTheBottom();
        }
      }
      return false;
    },
    onScroll() {
      const { scrollTop } = this.$refs.container;
      if (!scrollTop) {
        this.fetchHistory();
      }
      return false;
    },
    fetchHistory() {
      if (this.isLastPage) return;
      this.isHistoryFetching = true;
      const page = this.chatPage + 1;
      const { scrollHeight, scrollTop } = this.$refs.container;
      const scrollBottom = scrollHeight - scrollTop;
      this.FETCH_MESSAGE_HISTORY({ page })
        .then(() => {
          this.isHistoryFetching = false;
          const { scrollHeight: scrollHeightNew } = this.$refs.container;
          this.$refs.container.scrollTop = scrollHeightNew - scrollBottom;
        });
    },
  },
};
</script>

<style module>
.chat-flow-container {
  padding: 5px;
  background: #d0eaf0;
  height: calc(100vh - 150px);
  overflow-y: scroll;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  margin-top: 15px;
  padding-top: 15px;
}
.date-delim-wrapper {
  text-align: center;
}
.date-delim {
  background: rgba(200, 200, 200, .2);
  color: #777;
  border-radius: 5px;
  padding: 5px;
  display: inline;
}
.scroll-buffer {
  height: 30px;
  text-align: center;
  color: #fff;
}
</style>
