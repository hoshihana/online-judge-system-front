<template>
  <div>
    <el-card v-loading="loading">
      <template #header>
        <el-row v-if="$route.name === 'problemNew'">
          <el-col :span="12" style="text-align: left">
            <el-button type="primary" size="medium" plain>返回我的题库</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right"><b style="font-size: x-large">题目创建</b></el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="12" style="text-align: left">
            <el-button type="primary" size="medium" plain @click="backToProblem">返回题目</el-button>
            <el-button type="danger" size="medium" plain>删除题目</el-button>
          </el-col>
          <el-col :span="12" style="text-align: right"><b style="font-size: x-large">题目编辑</b></el-col>
        </el-row>
      </template>
      <el-tabs tab-position="left" stretch>
        <el-tab-pane label="题目编辑">
          <h3>题目名<b style="color: #F56C6C">*</b></h3>
          <el-input type="text" v-model="name" placeholder="题目名" maxlength="40" show-word-limit
                    style="width: 80%; margin: 15px"></el-input>
          <h3>题目描述</h3>
          <mavon-editor v-model="description" :toolbars="toolbars" :xssOptions="{}" style="margin: 15px"></mavon-editor>
          <br>
          <h3>输入格式</h3>
          <mavon-editor v-model="inputFormat" :toolbars="toolbars" :xssOptions="{}" style="margin: 15px"></mavon-editor>
          <br>
          <h3>输出格式</h3>
          <mavon-editor v-model="outputFormat" :toolbars="toolbars" :xssOptions="{}"
                        style="margin: 15px"></mavon-editor>
          <br>
          <h3>输入输出样例
            <el-button type="text" @click="addSample">添加样例</el-button>
          </h3>
          <div class="sample-div" v-for="(sample, index) in samples" :key="index">
            <el-row>
              <el-col :span="9">
                <h4>输入#{{ index + 1 }}</h4>
                <el-input v-model="sample.input" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
              </el-col>
              <el-col :span="9" :offset="5">
                <h4>输出#{{ index + 1 }}</h4>
                <el-input v-model="sample.output" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
              </el-col>
              <el-col :span="1" style="text-align: right">
                <el-button class="close-btn" type="text" @click="removeSample(index)" title="删除">
                  <font-awesome-icon icon="fa-solid fa-xmark"></font-awesome-icon>
                </el-button>
              </el-col>
            </el-row>
          </div>
          <br>
          <h3>说明</h3>
          <mavon-editor v-model="explanation" :toolbars="toolbars" style="margin: 15px"></mavon-editor>
          <div style="text-align: right">
            <el-button type="primary" size="medium" style="margin: 10px 20px" plain @click="save">保存</el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="数据点配置">
          <!--数据点配置-->
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import axios from "@/utils/axios";
import router from "@/router";
// import router from "@/router";

//  todo 编辑后未保存提示
export default {
  name: "ProblemEditView",
  components: {
    mavonEditor
  },
  props: ["id"],
  data: function () {
    return {
      loading: false,
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: false, // 图片链接 todo 实现图片上传功能
        code: true, // code
        table: true, // 表格
        fullscreen: false, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: false, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: false, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
      name: "",
      authorId: null,
      description: "",
      inputFormat: "",
      outputFormat: "",
      explanation: "",
      timeLimit: 1000,
      memoryLimit: 128,
      visibility: null,
      samples: [{
        input: "",
        output: ""
      }],
    }
  },
  beforeRouteEnter: function (to, from, next) {
    axios.get("/problem/" + to.params.id)
        .then((response) => {
          if (response.data.authorId !== router.app.$root.loginStatus.userid) {
            router.app.$message.error("无权访问该题目")
            next(false)
          } else {
            next()
          }
        })
        .catch((error) => {
          router.app.$message.error(error.response.data)
          next(false)
        })
  },
  mounted: function () {
    this.loading = true
    axios.get("/problem/" + this.id)
        .then((response) => {
          this.name = response.data.name
          this.authorId = response.data.authorId
          this.description = response.data.description
          this.inputFormat = response.data.inputFormat
          this.outputFormat = response.data.outputFormat
          this.samples = eval(response.data.samples)
          this.explanation = response.data.explanation
          this.timeLimit = response.data.timeLimit
          this.memoryLimit = response.memoryLimit
          this.loading = false
        })
        .catch((error) => {
          this.loading = false
          this.$message.error(error.response.data)
        })
  },
  methods: {
    addSample: function () {
      this.samples.push({
        input: "",
        output: ""
      })
    },
    removeSample: function (index) {
      this.samples.splice(index, 1)
    },
    save: function () {
      if (this.$route.name === "problemNew") {
        this.newProblem()
      } else {
        this.editProblem()
      }
    },
    newProblem: function () {
      if (this.name === "") {
        this.$message.error("题目名不能为空")
      } else {
        this.loading = true
        axios.post("/problem/", {
          "name": this.name,
          "description": this.description,
          "inputFormat": this.inputFormat,
          "outputFormat": this.outputFormat,
          "explanation": this.explanation,
          "samples": JSON.stringify(this.samples),
          "timeLimit": 500,
          "memoryLimit": 128
        }).then((response) => {
          this.loading = false
          this.$message({
            message: "题目创建成功",
            type: "success"
          })
          this.$router.push("/problem/" + response.data)
        }).catch((error) => {
          this.loading = false
          this.$message.error(error.response.data)
        })
      }
    },
    editProblem: function () {
      if (this.name === "") {
        this.$message.error("题目名不能为空")
      } else {
        this.loading = true
        axios.patch("/problem/" + this.id, {
          "name": this.name,
          "description": this.description,
          "inputFormat": this.inputFormat,
          "outputFormat": this.outputFormat,
          "explanation": this.explanation,
          "samples": JSON.stringify(this.samples),
          "timeLimit": 500,   //todo 待传入数据（注意要传入整数，不能是字符串，否则后端报错）
          "memoryLimit": 128,
        }).then((response) => {
          this.loading = false
          this.$message({
            message: "题目编辑成功",
            type: "success"
          })
          this.$router.push("/problem/" + response.data)
        }).catch((error) => {
          this.loading = false
          this.$message.error(error.response.data)
        })
      }
    },
    backToProblem: function () {
      this.$router.push("/problem/" + this.id)
    }
  }
}
</script>

<style scoped>

.sample-div {
  width: 80%;
  margin: 13px;
  padding: 10px 10px 20px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.sample-div:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
}

.close-btn {
  padding: 8px
}

.close-btn:hover {
  color: #1776f1;
}

h3 {
  margin: 6px 0;
}

h4 {
  margin: 4px 0;
}
</style>