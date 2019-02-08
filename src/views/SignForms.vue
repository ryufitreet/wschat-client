<template>
  <div class="enter-form-view"
    :class="{
      'enter-form-view-signin': route==='signin',
      'enter-form-view-signup': route==='signup',
    }"
  >
    <SignInForm v-if="route==='signin'" />
    <SignUpForm v-if="route==='signup'" />
  </div>
</template>

<script>
import SignInForm from '@/components/SignInForm.vue';
import SignUpForm from '@/components/SignUpForm.vue';

export default {
  props: {
    route: {
      type: String,
      required: true,
    },
  },
  components: {
    SignInForm,
    SignUpForm,
  },
  mounted() {
    console.log('mounted');
    console.log(this.$router.currentRoute.name);
  },
};
</script>

<style>
</style>
