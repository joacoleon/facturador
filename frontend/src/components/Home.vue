<template>
  <v-container>
    <h1>Home</h1>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ApiHelper from '@/commons/ApiHelper'
import { useAuthStore } from '@/stores/AuthStore'

const authStore = useAuthStore();

</script>

<style></style>
