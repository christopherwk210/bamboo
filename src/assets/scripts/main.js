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
import SettingsComponent from '../../components/settings/settings.component';

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

    /**
     * Add an image to the list (and begin upload)
     * @param {string} path Image file path
     * @param {number} size File size
     */
    addImage: function(path, size) {
      let img = new ImageItem(path, size);
      img.beginUpload();
      this.imageList.push(img);
    },

    /**
     * Save a new API key value
     * @param {string} newKey New API key to save
     */
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

// On image added through file selector
ipcRenderer.on('filesSelected', (e, args) => {
  if (args) args.forEach(file => app.addImage(file.path, file.size))
});

// On image compression error
ipcRenderer.on('imageError', (e, args) => {
  console.log('image error reported', args);

  app.imageList.some(imageItem => {
    if (imageItem.id === args.id) {
      imageItem.markAsError(args.msg.message);
      return true;
    }
  });
});

// On image compression complete
ipcRenderer.on('imageComplete', (e, args) => {
  app.imageList.some(imageItem => {
    if (imageItem.id === args.id) {
      imageItem.markAsComplete(args.newSize);
      return true;
    }
  });
});
