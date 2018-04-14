const template = `
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
`;

export default template;
