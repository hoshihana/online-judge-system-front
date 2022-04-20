<template>
  <div>
    <el-card>
      <template #header>
        <el-row>
          <el-col :span="12" style="text-align: left">
            <el-button class="back-btn" type="text" @click="back">
              <font-awesome-icon icon="fa-solid fa-arrow-left" fixed-width></font-awesome-icon>
              返回
            </el-button>
            <span style="vertical-align: bottom"><b style="font-size: x-large">记录 {{ contestId + "-" + recordId }}</b></span>
          </el-col>
        </el-row>
      </template>
      <el-alert :type="getResultType(record.judgeResult)" show-icon :closable="false">
        <template #title>
          <div style="padding: 10px;font-size: x-large">
            {{ getResult(record.judgeResult) }} <i v-if="record.judgeResult === 'PD' || record.judgeResult === 'JD'"
                                                   class="el-icon-loading"></i>
          </div>
        </template>
        <div style="padding: 10px;font-size: larger">
          <span class="gut-span">
            <font-awesome-icon icon="fa-solid fa-hourglass" fixed-width></font-awesome-icon>运行时间：{{
              record.executeTime === null ? "--" : record.executeTime + " ms"
            }}
          </span>
          <span class="gut-span">
            <font-awesome-icon icon="fa-solid fa-memory" fixed-width></font-awesome-icon>运行内存：{{
              record.executeMemory === null ? "--" : record.executeMemory + " KB"
            }}
          </span>
          <span class="gut-span">
            <font-awesome-icon icon="fa-solid fa-clock" fixed-width></font-awesome-icon>时间：{{ record.submitTime }}
          </span>
          <span class="gut-span">
            <font-awesome-icon icon="fa-solid fa-user" fixed-width></font-awesome-icon>用户：
            <router-link class="el-link el-link--primary" :to="'/user/' + record.userId" style="padding-bottom: 3px"
                         target="_blank">{{ record.username }}</router-link>
          </span>
          <span class="gut-span">
            <font-awesome-icon icon="fa-solid fa-bookmark" fixed-width></font-awesome-icon>题目：
            <router-link class="el-link el-link--primary" :to="'/contest/' + contestId + '/problem/' + record.problemNumber"
                         style="padding-bottom: 3px" target="_blank">{{ contestId + "-" + record.problemNumber }}</router-link>
          </span>
        </div>
      </el-alert>
      <el-collapse accordion style="margin-top: 10px; padding: 15px; border: none">
        <el-collapse-item>
          <template #title>
            <span style="font-size: larger">
              <font-awesome-icon icon="fa-solid fa-gears"></font-awesome-icon>
              编译结果
            </span>
          </template>
          <div :style="{'color': compileOutputColor}" class="compile-output">{{ compileOutput }}</div>
        </el-collapse-item>
      </el-collapse>
      <div style="margin-top: 10px;padding: 15px">
        <span style="padding-right: 20px">
            <font-awesome-icon icon="fa-solid fa-code"
                               fixed-width></font-awesome-icon> 语言：{{ getLanguage(record.submitLanguage) }}
          </span>
        <span style="padding-right: 20px">
            <font-awesome-icon icon="fa-solid fa-ruler-horizontal" fixed-width></font-awesome-icon>
          代码长度：{{
            record.codeLength < 1024 ? record.codeLength + " B" : (record.codeLength % 1024 === 0 ? record.codeLength / 1024 : (record.codeLength / 1024).toFixed(1)) + " KB"
          }}
          </span>
        <span><el-button type="text" class="copyBtn" title="复制" :data-clipboard-text="code" @click="copy"
                         style="min-height: auto; padding: 0">
          <font-awesome-icon icon="fa-regular fa-copy" color="#409EFF" fixed-width></font-awesome-icon>复制代码
        </el-button></span>
      </div>
      <codemirror class="editor-border" ref="cm" v-model="code" :options="options" @input="update"></codemirror>
    </el-card>
  </div>
</template>

<script>
import axios from "@/utils/axios";
import {codemirror} from "vue-codemirror";
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/theme/idea.css'
import 'codemirror/addon/selection/active-line'
import 'codemirror/addon/selection/selection-pointer'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/scroll/simplescrollbars'
import 'codemirror/addon/display/autorefresh'
import Clipboard from "clipboard";

export default {
  name: "ContestRecordView",
  components: {
    codemirror
  },
  props: ["contestId", "recordId"],
  data: function () {
    return {
      loading: false,
      codeLoading: false,
      compileOutputLoading: false,
      record: {},
      compileOutput: "",
      code: "",

      options: {
        tabSize: 4,
        mode: "",
        theme: "idea",
        lineNumbers: true,
        line: true,
        scrollbarStyle: 'overlay',
        autoRefresh: true,
        readOnly: true
      }
    }
  },
  methods: {
    update: function () {
      this.loading = this.codeLoading = true
      axios.get("/contests/" + this.contestId + "/records/" + this.recordId)
          .then((response) => {
            this.record = response.data
            this.loading = false
            axios.get("/contests/" + this.contestId + "/records/" + this.recordId + "/code", {
              params: {
                "submitLanguage": this.record.submitLanguage,
                "codeLength": this.record.codeLength
              }
            }).then((response) => {
              this.code = response.data
              this.codeLoading = false
            }).catch((error) => {
              this.codeLoading = false
              this.$message.error(error.response.data)
            })
          })
          .catch((error) => {
            this.loading = false
            this.$message.error(error.response.data)
          })
      this.compileOutputLoading = true
      axios.get("/contests/" + this.contestId + "/records/" + this.recordId + "/compileOutput")
          .then((response) => {
            this.compileOutput = response.data;
            this.compileOutputLoading = false;
          }).catch((error) => {
        this.compileOutput = error.response.data;
        this.compileOutputLoading = false;
      })
    },
    getLanguage: function (language) {
      switch (language) {
        case "C":
          return "C"
        case "CPP":
          return "C++"
        case "CPP11":
          return "C++11"
        case "CPP14":
          return "C++14"
        case "CPP17":
          return "C++17"
        case "JAVA":
          return "Java"
        case "PY2":
          return "Python2"
        case "PY3":
          return "Python3"
        default:
          return language
      }
    },
    getMode: function (language) {
      switch (language) {
        case "C":
          return "text/x-csrc"
        case "CPP":
        case "CPP11":
        case "CPP14":
        case "CPP17":
          return "text/x-c++src"
        case "JAVA":
          return "text/x-java"
        case "PY2":
        case "PY3":
          return "text/x-python"
        default:
          return ""
      }
    },
    getResult: function (result) {
      switch (result) {
        case "PD":
          return "Pending"
        case "JD":
          return "Judging"
        case "CE":
          return "Compile Error"
        case "AC":
          return "Accepted"
        case "WA":
          return "Wrong Answer"
        case "RE":
          return "Runtime Error"
        case "TLE":
          return "Time Limit Exceeded"
        case "MLE":
          return "Memory Limit Exceeded"
        case "SE":
          return "System Error"
        default:
          return result
      }
    },
    getResultType: function (result) {
      switch (result) {
        case "PD":
        case "JD":
          return "info"
        case "AC":
          return "success"
        case "WA":
        case "RE":
        case "TLE":
        case "MLE":
          return "error"
        case "CE":
        case "SE":
          return "warning"
        default:
          return ""
      }
    },
    copy: function () {
      let clipboard = new Clipboard(".copyBtn");
      clipboard.on("success", () => {
        this.$message({
          message: "复制成功",
          type: "success"
        })
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        this.$message.error("复制失败")
        clipboard.destroy();
      });
    },
    back: function () {
      this.$router.push("/contest/" + this.contestId + "/record/list")
    }
  },
  computed: {
    compileOutputColor: function () {
      if(this.record.judgeResult === 'CE') {
        return '#F56C6C';
      } else {
        return '#909399'
      }
    }
  },
  watch: {
    "record.submitLanguage": function (val) {
      this.options.mode = this.getMode(val)
    }
  },
  mounted: function () {
    this.update()
    this.$refs.cm.codemirror.setSize("auto", "auto")
    const timer = setInterval(() => {
      if (this.record.judgeResult !== undefined && (this.record.judgeResult === 'PD' || this.record.judgeResult === 'JD')) {
        axios.get("/contests/" + this.contestId + "/records/" + this.recordId).then((response) => {
          this.record = response.data
        })
        axios.get("/contests/" + this.contestId + "/records/" + this.recordId + "/compileOutput")
            .then((response) => {
              this.compileOutput = response.data;
            }).catch((error) => {
          this.compileOutput = error.response.data;
        })
      }
    }, 500)
    this.$once('hook:beforeDestroy', () => {
      clearInterval(timer);
    })
  }
}
</script>

<style scoped>
.back-btn {
  padding: 0;
  border: 0;
  border-radius: 0;
  min-height: 35px;
  height: 30px;
  color: black;
  border-right: 3px solid rgb(228, 231, 237);
  padding-left: 3px;
  padding-right: 24px;
  margin-right: 12px;
}

.back-btn:hover {
  border-right: 3px solid #409EFF;
  color: #409EFF;
}

.back-btn:focus {
  border-right: 3px solid #409EFF;
  color: #409EFF;
}

.gut-span {
  padding-right: 15px;
}

.editor-border {
  border-width: 3px;
  border-style: dashed dashed dashed none;
  border-color: rgb(230, 230, 230);
}

.compile-output {
  padding-left: 20px;
  white-space: pre-wrap;
  font-family: Consolas;
  line-height: 1.4
}
</style>