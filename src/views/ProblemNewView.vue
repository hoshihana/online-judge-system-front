<template>
  <div>
    <el-card v-loading="loading">
      <template #header>
        <el-row>
          <el-col :span="8" style="text-align: left">
            <el-button type="primary" size="medium" plain @click="backToUserProblemList">
              <font-awesome-icon icon="fa-solid fa-arrow-left"></font-awesome-icon>
              返回我的题目
            </el-button>
          </el-col>
          <el-col :span="16" style="text-align: right"><b style="font-size: x-large">题目创建</b></el-col>
        </el-row>
      </template>
      <el-tabs tab-position="left" stretch>
        <el-tab-pane label="题目信息编辑">
          <el-alert style="margin: 10px;width: 350px" title="请保存当前内容后再进行测试点的配置" type="warning"
                    show-icon close-text="知道了"></el-alert>
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
          <h3 style="margin-top: 40px">题目状态</h3>
          <div style="margin: 15px">
            <el-radio-group v-model="visibility">
              <el-radio label="PRIVATE">私密题目</el-radio>
              <el-radio label="HIDDEN">比赛题目</el-radio>
              <el-radio label="PUBLIC">公开题目</el-radio>
            </el-radio-group>
          </div>
          <el-alert
              type="warning"
              :closable="false"
              style="margin-top: 20px; margin-bottom: 20px; width: 700px">
            <template #title>
              <span style="font-size: larger"><i class="el-icon-warning"></i> 题目状态说明</span>
            </template>
            <ul style="padding-left: 10px; font-size: larger;">
              <li><b>私密题目：</b>仅管理员可见，其提交记录也是仅管理员可见</li>
              <li><b>比赛题目：</b>仅管理员和比赛的参加者可见，其全部提交记录管理员可见，当比赛进行时，参加者仅能查看自己的提交记录，结束后则可以查看所有参加者的提交记录</li>
              <li><b>公开题目：</b>所有用户可见，其提交记录也是所有用户可见</li>
            </ul>
          </el-alert>
          <div style="text-align: right">
            <el-button type="primary" size="medium" style="margin: 10px 20px" plain @click="newProblem">
              <font-awesome-icon icon="fa-solid fa-floppy-disk"></font-awesome-icon>
              创建
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="测试点配置" :disabled="true">
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {mavonEditor} from "mavon-editor";
import axios from "@/utils/axios";

export default {
  name: "ProblemNewView",
  components: {
    mavonEditor
  },
  data: function () {
    return {
      loading: false,
      uploadLoading: false,
      testInfoLoading: false,
      saved: false,
      existent: false,
      currentTab: "problemEdit",
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
      visibility: 'PRIVATE',
      samples: []
    }
  },
  beforeRouteLeave: function (to, from, next) {
    if (this.saved) {
      next()
    } else {
      this.$confirm('创建的题目尚未保存，是否继续离开？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        next(false)
      });
    }
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
    newProblem: function () {
      if (this.name === "") {
        this.$message.error("题目名不能为空")
      } else {
        this.loading = true
        axios.post("/problems/", {
          "name": this.name,
          "description": this.description,
          "inputFormat": this.inputFormat,
          "outputFormat": this.outputFormat,
          "explanation": this.explanation,
          "samples": JSON.stringify(this.samples),
          "timeLimit": this.timeLimit,
          "memoryLimit": this.memoryLimit,
          "visibility": this.visibility
        }).then((response) => {
          this.loading = false
          this.$message.success("题目创建成功")
          this.saved = true
          this.$router.replace("/problem/" + response.data)
        }).catch((error) => {
          this.loading = false
          this.$message.error(error.response.data)
        })
      }
    },
    backToUserProblemList: function () {
      this.$router.replace("/user/" + this.$root.loginStatus.userid + "/problem/list")
    },
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