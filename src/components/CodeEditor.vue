<template>
  <div>
    <codemirror class="editor-border" ref="cm" v-model="newCode" :options="options" @input="update"></codemirror>
  </div>
</template>

<script>
import {codemirror} from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/theme/idea.css'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/selection/selection-pointer'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/display/autorefresh'

export default {
  name: "CodeEditor",
  components: {
    codemirror
  },
  data: function () {
    return {
      newCode: "",
      options: {
        tabSize: 4,
        mode: "",
        theme: "idea",
        lineNumbers: true,
        line: true,
        styleActiveLine: true,
        scrollbarStyle: 'overlay',
        autoRefresh: true
      }
    }
  },
  props: ["code", "language"],
  methods: {
    update: function () {
      this.$emit("update:code", this.newCode)
    },
    getMode: function (language) {
      switch (language) {
        case "C": return "text/x-csrc"
        case "CPP":
        case "CPP11":
        case "CPP14":
        case "CPP17":
          return "text/x-c++src"
        case "JAVA": return "text/x-java"
        case "PY2":
        case "PY3":
          return "text/x-python"
        default: return ""
      }
    },
  },
  watch: {
    language: function (val) {
      this.options.mode = this.getMode(val)
    },
    code: function (val) {
      this.newCode = val
    }
  },
  mounted() {
    this.newCode = this.code
    this.options.mode = this.getMode(this.language)
    this.$refs.cm.codemirror.setSize("auto", (document.documentElement.clientHeight - 290) + "px")
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        //监听浏览器窗口大小改变
        //浏览器变化执行动作
        this.$refs.cm.codemirror.setSize("auto", (document.documentElement.clientHeight - 290) + "px")
      });
    })
  }
}
</script>

<style scoped>
.editor-border {
  border-width: 3px;
  border-style: dashed dashed dashed none;
  border-color: rgb(230,230,230)
}
</style>