<template>
  <div>
    <textarea
      v-model="message"
    />
    <div
      @click="SEND_MESSAGE"
      class="btn btn-blue"
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
  },
}
</script>

