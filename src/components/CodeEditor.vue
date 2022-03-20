<template>
  <div>
    <prism-editor class="my-editor" v-model="newCode" :highlight="highlighter" @input="update"></prism-editor>
  </div>
</template>

<script>
import {PrismEditor} from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css';

import {highlight, languages} from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-coy.css';

export default {
  name: "CodeEditor",
  data: function () {
    return {
      newCode: "console.log('hello world')",
    }
  },
  props: ['code'],
  components: {
    PrismEditor
  },
  methods: {
    highlighter: function () {
      return highlight(this.newCode, languages.js, "js");
    },
    update: function () {
      this.$emit("update:code", this.newCode)
    }
  }
}
</script>

<style scoped>
.my-editor {
  /* we dont use `language-` classes anymore so thats why we need to add background and text color manually */
  background: rgb(240,240,240);
  /* you must provide font-family font-size line-height. Example: */
  font-family: Consolas;
  font-size: 14px;
  line-height: 1.5;
  width: 90%;
  height: 500px;
  padding: 10px 20px;
}

/* optional class for removing the outline */
.prism-editor__textarea:focus {
  outline: none;
}
</style>