<style>
  @import url('./assets/styles/font.css');
  @import url('./assets/styles/global.css');
</style>

<style scoped>
  #app {
    height: 100%;
  }
</style>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { electronRenderer } from './electron-renderer';

@Component
export default class App extends Vue {
  mounted() {
    electronRenderer.showWindow();
  }
}
</script>
