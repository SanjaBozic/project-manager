<script setup lang="ts">
import MainNavigation from './components/MainNavigation.vue';
</script>

<template class="dark-mode">
  <div>
    <MainNavigation />
    <router-view />
  </div>
</template>