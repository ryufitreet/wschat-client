<template>
  <div :class="$style['container']">
    <textarea
      v-model="message"
      @keydown.ctrl.enter="onClickSend"
      :class="$style['message-field']"
    />
    <div
      @click="onClickSend"
      class="btn btn-blue"
      :class="$style['send-btn']"
    >
      Send
    </div>
  </div>
</template>

<script>
import {
  mapMutations,
  mapActions,
} from 'vuex';
import {
  SET_MESSAGE,
} from '@/store/types/mutations';
import {
  SEND_MESSAGE,
} from '@/store/types/actions';

export default {
  computed: {
    message: {
      get() { return this.$store.state.message; },
      set(message) { this.SET_MESSAGE(message); },
    },
  },
  methods: {
    ...mapMutations({
      SET_MESSAGE,
    }),
    ...mapActions({
      SEND_MESSAGE,
    }),
    onClickSend() {
      if (this.message.trim()) {
        this.SEND_MESSAGE(this.message);
        this.message = '';
      }      
    },
  },
};
</script>

<style module>
.container {
  display: flex;
  height: 70px;
  margin: 10px;
}
.message-field {
  height: 100%;
  resize: none;
  flex-grow: 2;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
}
.send-btn {
  width: 60px;
  height: 100%;
  line-height: 70px;
  vertical-align: middle;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
}
</style>
