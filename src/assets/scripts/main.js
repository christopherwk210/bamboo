import electron from 'electron';
import Vue from 'vue/dist/vue';
import feather from 'feather-icons';

const webFrame = electron.webFrame;

// Prevent zooming on mac
webFrame.setVisualZoomLevelLimits(1, 1);
webFrame.setLayoutZoomLevelLimits(0, 0);

// Apply icons
feather.replace();

// Create Vue app
let app = new Vue({
  el: '#app',
  data: {
    imageList: [],
    apiKey: '',
    apiInputValue: ''
  }
});

function addImageListItem() {
  app.imageList.push({ fileName: 'test', status: 'done' });
  app.imageList.push({ fileName: 'test', status: 'loading' });
  app.imageList.push({ fileName: 'test', status: 'error' });
}

window.addI = addImageListItem;
