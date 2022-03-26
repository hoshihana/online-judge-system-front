<template>
  <div>
    <el-container v-loading="loading">
      <el-main style="padding: 0 20px 20px 0">
        <el-card :body-style="{'padding-left': 0}">
          <template #header>
            <el-row>
              <el-col :span="12" style="text-align: left">
                <el-button class="back-btn" type="text" @click="back">
                  <font-awesome-icon icon="fa-solid fa-arrow-left" fixed-width></font-awesome-icon>
                  返回
                </el-button>
                <span style="vertical-align: bottom"><b
                    style="font-size: x-large">{{ problemDetail.id + ' ' + problemDetail.name }}</b></span>
              </el-col>
              <el-col :span="12" style="text-align: right">
                <el-button v-if="problemDetail.authorId === $root.loginStatus.userid" type="primary" size="medium" plain
                           @click="editProblem">
                  <font-awesome-icon icon="fa-solid fa-pen-to-square" fixed-width></font-awesome-icon>
                  编辑题目
                </el-button>
              </el-col>
            </el-row>
          </template>
          <el-tabs v-model="currentTab" tab-position="left" stretch>
            <el-tab-pane label="题目详情" name="problemDetail">
              <problem-detail :problemDetail="problemDetail"></problem-detail>
            </el-tab-pane>
            <el-tab-pane label="代码提交" name="codeSubmit">
              <!--todo 显示上一次提交的代码和语言选择-->
              <code-editor :code.sync="codeSubmit.code" :language="codeSubmit.language"></code-editor>
              <div style="text-align: right">
                <el-select v-model="codeSubmit.language" placeholder="请选择代码语言" size="medium"
                           style="margin: 20px 20px 0 0; width: 200px">
                  <template #prefix>
                    &nbsp;<font-awesome-icon icon="fa-solid fa-code"></font-awesome-icon>
                  </template>
                  <el-option
                      v-for="option in codeSubmit.languageOptions" :key="option.value" :label="option.label"
                      :value="option.value">
                  </el-option>
                </el-select>
                <el-button type="danger" size="medium" style="margin-top: 20px" plain @click="submitCode">
                  <font-awesome-icon icon="fa-solid fa-angles-up"></font-awesome-icon>
                  提交
                </el-button>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-main>
      <el-aside width="300px">
        <el-card style="margin-bottom: 20px">
          <template #header>
            <h3 style="margin: 5px 0">题目信息</h3>
          </template>
          <el-row>
            <el-col :span="10" style="text-align: left">
              <b>
                <font-awesome-icon icon="fa-solid fa-user" fixed-width></font-awesome-icon>
                作者</b>
            </el-col>
            <el-col :span="14" style="text-align: right">
              <el-link type="primary" :href="'/user/' + problemDetail.authorUsername" target="_blank">{{ authorUsername }}
              </el-link>
            </el-col>
          </el-row>
          <el-divider class="horizontal-divider"></el-divider>
          <el-row>
            <el-col :span="10" style="text-align: left">
              <b>
                <font-awesome-icon icon="fa-solid fa-hourglass" fixed-width></font-awesome-icon>
                时间限制</b>
            </el-col>
            <el-col :span="14" style="text-align: right">
              {{ problemDetail.timeLimit + "ms" }}
            </el-col>
          </el-row>
          <el-divider class="horizontal-divider"></el-divider>
          <el-row>
            <el-col :span="10" style="text-align: left">
              <b>
                <font-awesome-icon icon="fa-solid fa-memory" fixed-width></font-awesome-icon>
                空间限制</b>
            </el-col>
            <el-col :span="14" style="text-align: right">
              {{ problemDetail.memoryLimit + "MB" }}
            </el-col>
          </el-row>
          <el-divider class="horizontal-divider"></el-divider>
          <el-row>
            <el-col :span="12" style="text-align: left">
              <div style="margin-bottom: 10px">
                <b>
                  <font-awesome-icon icon="fa-solid fa-circle-right" fixed-width></font-awesome-icon>
                  提交人数：</b>
                <span style="color: #E6A23C">{{ triedUserAmount }}</span>
              </div>
              <div>
                <b>
                  <font-awesome-icon icon="fa-solid fa-circle-check" fixed-width></font-awesome-icon>
                  通过人数：</b>
                <span style="color: #67C23A">{{ passedUserAMount }}</span>
              </div>
            </el-col>
            <el-col :span="12" style="text-align: right">
            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 20px" :body-style="{'padding': '0 10px 7px'}">
          <template #header>
            <el-row align="middle" type="flex">
              <el-col :span="8" style="text-align: left">
                <h3 style="margin: 5px 0">历史提交</h3>
              </el-col>
              <el-col :span="4" style="text-align: center">
                <el-divider class="vertical-divider" direction="vertical"></el-divider>
              </el-col>
              <el-col :span="14" style="text-align: left">
                <div style="margin-bottom: 3px">
                  <b>
                    <font-awesome-icon icon="fa-solid fa-circle-right" fixed-width></font-awesome-icon>
                    提交次数：
                  </b><span style="color: #E6A23C">{{ submit }}</span>
                </div>
                <div>
                  <b>
                    <font-awesome-icon icon="fa-solid fa-circle-check" fixed-width></font-awesome-icon>
                    通过次数：
                  </b><span style="color: #67C23A">{{ accept }}</span>
                </div>
              </el-col>
            </el-row>
          </template>
          <el-table v-loading="submitLoading" :data="records" stripe style="width: 100%" size="medium">
            <el-table-column label="#" align="center" min-width="1">
              <template #default="scope">
                <el-link type="primary" :href="'/record/' + scope.row.id">{{ scope.row.id }}</el-link>
              </template>
            </el-table-column>
            <el-table-column label="时间" align="center" min-width="2">
              <template #default="scope">
                {{ (new Date(scope.row.submitTime)).toLocaleDateString() }}<br>
                {{ (new Date(scope.row.submitTime)).toLocaleTimeString() }}
              </template>
            </el-table-column>
            <el-table-column label="结果" align="center" min-width="1">
              <template #default="scope">
                <el-tooltip effect="dark" :content="getResult(scope.row.judgeResult)" placement="top">
                  <el-tag size="small" :type="getResultType(scope.row.judgeResult)">{{
                      scope.row.judgeResult
                    }}
                  </el-tag>
                </el-tooltip>
              </template>
            </el-table-column>
            <div>
              <!--todo编写查看更多功能-->
            </div>
          </el-table>
        </el-card>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import CodeEditor from "@/components/CodeEditor";
import ProblemDetail from "@/components/ProblemDetail";
import axios from "@/utils/axios";

export default {
  name: "ProblemView",
  components: {ProblemDetail, CodeEditor},
  props: ["id"],
  data: function () {
    return {
      loading: false,
      submitLoading: false,
      currentTab: "problemDetail",

      submit: "--",
      accept: "--",
      limit: 5,
      records: [],

      authorUsername: "--",
      triedUserAmount: "--",
      passedUserAMount: "--",

      problemDetail: {
        id: null,
        authorId: null,
        name: "",
        description: "",
        inputFormat: "",
        outputFormat: "",
        explanation: "",
        timeLimit: null,
        memoryLimit: null,
        visibility: null,
        samples: "",
        submit: null,
        accept: null,
      },
      codeSubmit: {
        code: "",
        language: "",
        languageOptions: [{
          value: "C",
          label: "C"
        }, {
          value: "CPP",
          label: "C++"
        }, {
          value: "JAVA",
          label: "Java"
        }, {
          value: "PY",
          label: "Python"
        }]
      }
    }
  },
  methods: {
    update: function () {
      this.loading = true
      axios.get("/problems/" + this.id)
          .then((response) => {
            this.problemDetail = response.data
            this.loading = false
            // 异步获取作者用户名
            axios.get("/accounts/username", {
              params: {
                "id": this.problemDetail.authorId
              }
              }).then((response) => {
                this.authorUsername = response.data
              }).catch((error) => {
                this.$message.error(error.response.data)
              })
            // 异步获取该题提交和通过人数
            axios.get("/problems/" + this.id + "/amount"
            ).then((response) => {
              this.triedUserAmount = response.data.triedUserAmount || 0
              this.passedUserAMount = response.data.passedUserAMount || 0
            }).catch((error) => {
              this.$message.error(error.response.data)
            })
            axios.get("/problems/" + this.problemDetail.id + "/users/" + this.$root.loginStatus.userid)
              .then((response) => {
                this.submit = response.data.submit || 0
                this.accept = response.data.accept || 0
              }).catch((error) => {
                this.$message.error(error.response.data)
            })
            this.submitLoading = true
            axios.get("/records/recent", {
              params: {
                "problemId": this.problemDetail.id,
                "userId": this.$root.loginStatus.userid,
                "limit": this.limit
              }
            }).then((response) => {
              this.submitLoading = false
              this.records = response.data
            }).catch((error) => {
              this.submitLoading = false
              this.$message.error(error.response.data)
            })

          })
          .catch((error) => {
            this.loading = false
            this.$message.error(error.response.data)
          })
    },
    back: function () {
      this.$router.go(-1)
    },
    editProblem: function () {
      this.$router.replace(this.$route.path + "/edit")
    },
    submitCode: function () {
      this.loading = true
      axios.post("/records", {
        "userId": this.$root.loginStatus.userid,
        "problemId": this.id,
        "submitLanguage": this.codeSubmit.language,
        "code": this.codeSubmit.code
      }).then(() => {
        this.loading = false
        this.$message.success("代码提交成功")
        this.currentTab = "problemDetail"
        this.update()
      }).catch((error) => {
        this.loading = false
        this.$message.error(error.response.data)
      })
    },
    getResult: function (result) {
      switch (result) {
        case "PD":
          return "Pending"
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
          return "info"
        case "AC":
          return "success"
        case "WA":
        case "RE":
        case "TLE":
        case "MLE":
          return "danger"
        case "CE":
        case "SE":
          return "warning"
        default:
          return ""
      }
    },
  },
  mounted: function () {
    this.update();
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

.horizontal-divider {
  margin: 15px 0;
}

.vertical-divider {
  display: inline-block;
  width: 1px;
  height: 36px;
  margin: 0 8px;
  vertical-align: middle;
  position: relative;
}


</style>