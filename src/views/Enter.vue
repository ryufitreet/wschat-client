<template>
  <div :class="$style['enter']">
    <div :class="$style['wait']">
      <div :class="$style['wait-message']"> Please, wait... </div>
      <ClipLoader color="#6bace1" size="60px" />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import {
  SET_AUTHORIZED_STATE,
  SET_ME
} from '@/store/types/mutations';

import ClipLoader from 'vue-spinner/src/ClipLoader.vue';

import { BACKEND_URL } from '@/const';
import axios from 'axios';
import API from '@/api';

export default {
  name: 'enter',
  components: {
    ClipLoader,
  },
  mounted() {
    API.users.me()
      .then((res) => {
        const { user } = res;

        let isAuthorized;
        if (user) isAuthorized = true;
        else isAuthorized = false;

        this.SET_AUTHORIZED_STATE(isAuthorized);

        if (isAuthorized) {
          this.SET_ME(user);
          this.$router.push('/chat');
        }
      })
      .catch((error) => {
        console.log(error);
        console.log(`error catched`);
        const { type } = error;
        if (type === 'AUTH') {
          console.log(`router push`);
          this.$router.push('/signin');
        }
      });
  },
  methods: {
    ...mapMutations({
      SET_AUTHORIZED_STATE,
      SET_ME,
    }),
  },
};
</script>

<style module>
.enter {
  text-align: center;
  display: flex;
  height: 100%;
  justify-content: center;
  align-content: center;
  flex-direction: column;
}
.wait {
  height: 100px;
}
.wait-message {
  font-size: 1.5rem;
  color: #6bace1;
  margin-bottom: 10px;
}
</style>
