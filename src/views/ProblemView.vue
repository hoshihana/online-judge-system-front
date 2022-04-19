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
              <el-col :span="12" style="text-align: right; float: right">
                <el-tooltip content="测试点尚未配置" placement="left" effect="light"
                            :disabled="problemDetail.authorId !== $root.loginStatus.userid || problemDetail.testSet">
                  <el-badge is-dot
                            :hidden="problemDetail.authorId !== $root.loginStatus.userid || problemDetail.testSet">
                    <el-button v-if="problemDetail.authorId === $root.loginStatus.userid" type="primary" size="medium"
                               plain
                               @click="editProblem">
                      <font-awesome-icon icon="fa-solid fa-pen-to-square" fixed-width></font-awesome-icon>
                      编辑题目
                    </el-button>
                  </el-badge>
                </el-tooltip>
              </el-col>
            </el-row>
          </template>
          <el-tabs v-model="currentTab" tab-position="left" stretch>
            <el-tab-pane label="题目详情" name="problemDetail">
              <problem-detail :problemDetail="problemDetail"></problem-detail>
            </el-tab-pane>
            <el-tab-pane :disabled="!problemDetail.testSet" label="代码提交" name="codeSubmit">
              <code-editor v-loading="codeSubmitLoading" :code.sync="codeSubmit.code"
                           :language="codeSubmit.language"></code-editor>
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
              <router-link class="el-link el-link--primary" :to="'/user/' + problemDetail.authorId" target="_blank">
                {{ problemDetail.authorUsername }}
              </router-link>
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
        <el-card style="margin-bottom: 20px" :body-style="{'padding': '0 15px'}">
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
          <el-table v-loading="historySubmitLoading" :data="records" stripe style="width: 100%" size="medium">
            <el-table-column label="#" align="center" min-width="1">
              <template #default="scope">
                <router-link class="el-link el-link--primary" :to="'/record/' + scope.row.id" target="_blank">{{
                    scope.row.id
                  }}
                </router-link>
              </template>
            </el-table-column>
            <el-table-column label="时间" align="center" min-width="2">
              <template #default="scope">
                {{ $moment(scope.row.submitTime).format("yyyy-MM-DD") }}<br>
                {{ $moment(scope.row.submitTime).format("HH:mm:ss") }}
              </template>
            </el-table-column>
            <el-table-column label="结果" align="center" min-width="1">
              <template #default="scope">
                <el-tooltip effect="dark" :content="getResult(scope.row.judgeResult)" placement="top">
                  <el-tag size="small" :type="getResultType(scope.row.judgeResult)" style="cursor: pointer" @click="goRecord(scope.row.id)">{{
                      scope.row.judgeResult
                    }} <i v-if="scope.row.judgeResult === 'PD' || scope.row.judgeResult === 'JD'"
                          class="el-icon-loading"></i>
                  </el-tag>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
          <div v-if="submit !== '--' && submit > limit" style="text-align: center">
            <el-button type="text" @click="dialogKey = new Date()">
              查看更多
            </el-button>
            <personal-record-list-dialog :problem-id="id" :dialog-key="dialogKey" :problem-name="problemDetail.name"></personal-record-list-dialog>
          </div>
        </el-card>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import CodeEditor from "@/components/CodeEditor";
import ProblemDetail from "@/components/ProblemDetail";
import axios from "@/utils/axios";
import PersonalRecordListDialog from "@/components/PersonalRecordListDialog";

export default {
  name: "ProblemView",
  components: {PersonalRecordListDialog, ProblemDetail, CodeEditor},
  props: ["id"],
  data: function () {
    return {
      loading: false,
      historySubmitLoading: false,
      codeSubmitLoading: false,
      currentTab: "problemDetail",
      checkMoreRecords: false,
      dialogKey: new Date(),

      submit: "--",
      accept: "--",
      limit: 3,
      records: [],

      triedUserAmount: "--",
      passedUserAMount: "--",

      problemDetail: {
        id: null,
        authorId: null,
        authorUsername: null,
        name: "",
        description: "",
        inputFormat: "",
        outputFormat: "",
        explanation: "",
        timeLimit: null,
        memoryLimit: null,
        testSet: null,
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
          value: "CPP11",
          label: "C++11"
        }, {
          value: "CPP14",
          label: "C++14"
        }, {
          value: "CPP17",
          label: "C++17"
        }, {
          value: "JAVA",
          label: "Java"
        }, {
          value: "PY2",
          label: "Python2"
        }, {
          value: "PY3",
          label: "Python3"
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
            // 异步获取该题提交和通过人数
            axios.get("/problems/" + this.id + "/status"
            ).then((response) => {
              this.triedUserAmount = response.data.triedUserAmount || 0
              this.passedUserAMount = response.data.passedUserAmount || 0
            }).catch((error) => {
              this.$message.error(error.response.data)
            })
            // 异步获取用户在该题的提交和通过次数
            axios.get("/problems/" + this.problemDetail.id + "/users/" + this.$root.loginStatus.userid)
                .then((response) => {
                  this.submit = response.data.submit || 0
                  this.accept = response.data.accept || 0
                }).catch((error) => {
              this.$message.error(error.response.data)
            })
            // 异步获取用户在该题的最近的提交记录
            this.historySubmitLoading = true
            axios.get("/records/recent", {
              params: {
                "problemId": this.problemDetail.id,
                "limit": this.limit
              }
            }).then((response) => {
              this.historySubmitLoading = false
              this.records = response.data
              if (this.records.length > 0) {
                this.codeSubmit.language = this.records[0].submitLanguage
                this.codeSubmitLoading = true
                axios.get("/records/" + this.records[0].id + "/code", {
                  params: {
                    "submitLanguage": this.records[0].submitLanguage,
                    "codeLength": this.records[0].codeLength
                  }
                }).then((response) => {
                  this.codeSubmit.code = response.data
                  this.codeSubmitLoading = false
                }).catch((error) => {
                  this.codeSubmitLoading = false
                  this.$message.error(error.response.data)
                })
              }
            }).catch((error) => {
              this.historySubmitLoading = false
              this.$message.error(error.response.data)
            })
            // 异步获取用户在该题最近一次提交的代码
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
      if (this.codeSubmit.language === "") {
        this.$message.error("请选择提交语言")
        return
      } else if (this.codeSubmit.code === "") {
        this.$message.error("提交代码不能为空")
        return
      }
      this.loading = true
      axios.post("/records", {
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
          return "danger"
        case "CE":
        case "SE":
          return "warning"
        default:
          return ""
      }
    },
    goRecord: function (recordId) {
      let routeUrl = this.$router.resolve({
        path: "/record/" + recordId,
      });
      window.open(routeUrl.href, '_blank');
    }
  },
  mounted: function () {
    this.update();
    const timer = setInterval(() => {
      let refresh = false;
      for (const record of this.records) {
        if (record.judgeResult === 'PD' || record.judgeResult === 'JD') {
          refresh = true
          break
        }
      }
      if (refresh) {
        axios.get("/records/recent", {
          params: {
            "problemId": this.id,
            "limit": this.limit
          }
        }).then((response) => {
          this.records = response.data
        })
        axios.get("/problems/" + this.id + "/status"
        ).then((response) => {
          this.triedUserAmount = response.data.triedUserAmount || 0
          this.passedUserAMount = response.data.passedUserAmount || 0
        })
        axios.get("/problems/" + this.problemDetail.id + "/users/" + this.$root.loginStatus.userid)
            .then((response) => {
              this.submit = response.data.submit || 0
              this.accept = response.data.accept || 0
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