// Lib imports
import { remote, app } from 'electron';
import settings from 'electron-settings';
import feather from 'feather-icons';

// Local imports
import template from './settings.template';

export default {
  name: 'settings',
  template,
  data: function() {
    return {
      apiKey: '',
      apiInputValue: ''
    };
  },
  methods: {
    /** Emit a close signal to hide the settings component */
    close: function() {
      this.$emit('close');
    },

    /** Save all relevant settings */
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

  /** Initialize setting values */
  created: function() {
    this.apiKey = settings.get('api-key') || '';
    this.apiInputValue = settings.get('api-key') || '';
  },

  /** Replace icons on mount */
  mounted: () => feather.replace()
}
