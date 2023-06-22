<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import MainScreen from './components/MainScreen.vue'
import Login from './components/Login.vue'
import {store} from "@/stores"

console.log(store.state)

const isLoggedIn = store.state.userName !== null;
</script>

<template>
  <MainScreen/>
  <!-- <MainScreen v-if="isLoggedIn"/>
  <div v-else-if="!isLoggedIn" class="login">
    <Login/>
  </div> -->
</template>

<style scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; 
}
</style>
