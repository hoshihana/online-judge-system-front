<template>
  <div>
    <el-container>
      <el-main style="padding: 0 20px 20px 0">
        <el-card :body-style="{'padding-left': 0}">
          <template #header>
            <el-button class="back-btn" type="text" icon="el-icon-back">返回</el-button>
            <b style="font-size: larger">{{ problemDetail.id + ' ' + problemDetail.name }}</b>
          </template>
          <el-tabs tab-position="left" stretch>
            <el-tab-pane label="题目描述">
              <problem-detail :problemDetail="problemDetail"></problem-detail>
            </el-tab-pane>
            <el-tab-pane label="代码提交">
              <code-editor :code.sync="codeSubmit.code" :language="codeSubmit.language"></code-editor>
              <div style="text-align: right">
                <el-select v-model="codeSubmit.language" placeholder="请选择代码语言" size="medium"
                           style="margin: 20px 20px 0 0; width: 200px">
                  <el-option
                      v-for="option in codeSubmit.languageOptions" :key="option.value" :label="option.label"
                      :value="option.value">
                  </el-option>
                </el-select>
                <el-button type="danger" size="medium" style="margin-top: 20px">提交</el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-main>
      <el-aside width="300px">
        <el-card style="margin-bottom: 20px">
          <template #header>
            <b>题目信息</b>
          </template>

        </el-card>
        <el-card style="margin-bottom: 20px"></el-card>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import CodeEditor from "@/components/CodeEditor";
import ProblemDetail from "@/components/ProblemDetail";

export default {
  name: "ProblemView",
  components: {ProblemDetail, CodeEditor},
  data: function () {
    return {
      showProblemDetail: true,
      problemDetail: {
        id: 1000,
        name: "题目名",
        description: `<p>题目描述</p>`,
        inputFormat: `<p>输入格式</p>`,
        outputFormat: `<p>输出格式</p>`,
        explanation: `<p>说明</p>`,
        samples: [
          {input: "1 1", output: "2"},
          {input: "2 3", output: "5"}
        ]
      },
      codeSubmit: {
        code: "#include <bits/stdc++.h>",
        language: "",
        languageOptions: [{
          value: "c",
          label: "C"
        }, {
          value: "cpp",
          label: "C++"
        }, {
          value: "java",
          label: "Java"
        }, {
          value: "py",
          label: "Python"
        }, {
          value: "js",
          label: "JavaScript"
        }]
      }
    }
  },
  // watch: {
  //   "codeSubmit.code": function () {
  //     console.log(this.codeSubmit.code)
  //   }
  // },
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
  border-right: 3px solid rgb(228,231,237);
  padding-right: 26px;
  margin-right: 12px;
}
.back-btn:hover {
  border-right: 3px solid rgb(228,231,237);
  color: #409EFF;
}
</style>