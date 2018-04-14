<template>
  <div class="settings">
    <p style="margin-top: 0;">
      <label for="api-key">API key</label>
      <input v-model.trim="apiInputValue" type="text" id="api-key">
    </p>

    <div class="toolbar">
      <a href="#" @click="save"><i data-feather="save"></i> <span>Save</span></a>
      <a href="#" @click="close"><i data-feather="x-circle"></i> <span>Close</span></a>
    </div>
  </div>
</template>

<script>
import settings from 'electron-settings';
import feather from 'feather-icons';
import { remote } from 'electron';

export default {
  name: 'settings',
  data: function() {
    return {
      apiKey: '',
      apiInputValue: ''
    };
  },
  methods: {
    close: function() {
      this.$emit('close');
    },
    save: function() {
      if (this.apiInputValue.length < 1) {
        remote.dialog.showMessageBox(remote.getCurrentWindow(), {
          type: 'info',
          buttons: [
            'Dismiss'
          ],
          cancelId: 0,
          defaultId: 0,
          title: 'Invalid API key',
          message: 'You must enter a valid API key!'
        });
        return;
      }

      this.apiKey = this.apiInputValue;
      settings.set('api-key', this.apiKey);
    }
  },
  created: function() {
    this.apiKey = settings.get('api-key') || '';
    this.apiInputValue = settings.get('api-key') || '';
  },
  mounted: () => feather.replace()
}
</script>

<style lang="scss">
.settings {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 2;
  
  background: linear-gradient(to bottom, #c5f7ff, white);
  background-size: 100%;
  background-repeat: no-repeat;

  padding: 1em;

  input[type=text] {
    margin: 0.15em;
    width: 100%;
    font-family: monospace;
    text-align: center;
  }

  .toolbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
