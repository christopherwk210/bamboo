import electron from 'electron';
import $ from 'jquery';

const webFrame = electron.webFrame;

$(document).ready(() => {
  webFrame.setVisualZoomLevelLimits(1, 1);
  webFrame.setLayoutZoomLevelLimits(0, 0);
});
