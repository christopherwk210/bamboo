// Imports
import { webFrame, ipcRenderer, shell, remote } from 'electron';
import feather from 'feather-icons';
import settings from 'electron-settings';

// Determine environment
const env = remote.process.env.NODE_ENV || 'production';

// Import the correct version of Vue
let Vue;
if (env === 'production') {
  Vue = require('vue/dist/vue.min');
} else {
  Vue = require('vue/dist/vue');
}

// Local imports
import { ImageItem } from './image-item.class';
import SettingsComponent from '../../components/settings.component.vue';

// Prevent zooming on mac
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

// Apply icons
feather.replace();

// Create Vue app
let app = new Vue({
  el: '#app',
  components: {
    settings: SettingsComponent
  },
  data: {
    imageList: [],
    apiKey: settings.get('api-key') || '',
    apiInputValue: '',
    viewingSettings: false
  },
  methods: {
    /** Trigger the load image files dialog from electron */
    loadImages: function() {
      ipcRenderer.send('loadFile');
    },

    addImage: function(path) {
      let img = new ImageItem(path);
      this.imageList.push(img);
    },

    changeApiKey: function(newKey) {
      this.apiKey = newKey;
      settings.set('api-key', newKey);
    },

    /** Trigger the about dialog */
    showAbout: () => ipcRenderer.send('showAbout'),

    /** Open the tinify developer page */
    showApiPage: () => shell.openExternal('https://tinypng.com/developers', e => {})
  },

  // Only show the application window when Vue has mounted
  mounted: () => remote.getCurrentWindow().show()
});

// Register ipc callbacks
ipcRenderer.on('filesSelected', (e, args) => {
  if (args) args.forEach(path => app.addImage(path))
});
