<template>
  <v-container>
    <h1>Home</h1>
    <v-btn @click="getProfile">getProfile</v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ApiHelper from '@/commons/ApiHelper'
import { useAuthStore } from '@/stores/AuthStore'

const authStore = useAuthStore();

const getProfile = async () => {
  ApiHelper.get('user/profile')
    .then(async (response) => {
      let data = response.data;
    }).catch((e) => {
      console.error(e);
    })
}

</script>

<style></style>
