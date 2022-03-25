<template>
  <div>
    <el-container v-loading="loading">
      <el-main style="padding: 0 20px 20px 0">
        <el-card :body-style="{'padding-left': 0}">
          <template #header>
            <el-row>
              <el-col :span="12" style="text-align: left">
                <el-button class="back-btn" type="text" @click="back"><font-awesome-icon icon="fa-solid fa-arrow-left"></font-awesome-icon> 返回</el-button>
                <span style="vertical-align: bottom"><b
                    style="font-size: x-large">{{ problemDetail.id + ' ' + problemDetail.name }}</b></span>
              </el-col>
              <el-col :span="12" style="text-align: right">
                <el-button v-if="problemDetail.authorId === $root.loginStatus.userid" type="primary" size="medium" plain @click="editProblem">
                  <font-awesome-icon icon="fa-solid fa-pen-to-square"></font-awesome-icon> 编辑题目
                </el-button>
              </el-col>
            </el-row>
          </template>
          <el-tabs v-model="currentTab" tab-position="left" stretch>
            <el-tab-pane label="题目详情" name="problemDetail">
              <problem-detail :problemDetail="problemDetail"></problem-detail>
            </el-tab-pane>
            <el-tab-pane label="代码提交" name="codeSubmit">
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
                  <font-awesome-icon icon="fa-solid fa-angles-up"></font-awesome-icon> 提交
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
            <el-col :span="14" style="text-align: right" v-loading="authorLoading" element-loading-text="数据获取中..."
                    element-loading-spinner="el-icon-loading">
              {{ problemDetail.authorUsername }}
            </el-col>
          </el-row>
          <el-divider class="divider"></el-divider>
          <el-row>
            <el-col :span="10" style="text-align: left">
              <b>
                <font-awesome-icon icon="fa-solid fa-clock" fixed-width></font-awesome-icon>
                时间限制</b>
            </el-col>
            <el-col :span="14" style="text-align: right">
              {{ problemDetail.timeLimit + "ms" }}
            </el-col>
          </el-row>
          <el-divider class="divider"></el-divider>
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
          <el-divider class="divider"></el-divider>
          <el-row>
            <el-col :span="12" style="text-align: left">
              <div style="margin-bottom: 10px">
                <b>
                  <font-awesome-icon icon="fa-solid fa-circle-right" fixed-width></font-awesome-icon>
                  提交人数：</b>
                <span style="color: #E6A23C">{{ problemDetail.submit }}</span>
              </div>
              <div>
                <b>
                  <font-awesome-icon icon="fa-solid fa-circle-check" fixed-width></font-awesome-icon>
                  <!--   todo 区分总提交数、提交人数、总通过数和通过人数-->
                  通过人数：</b>
                <span style="color: #67C23A">{{ problemDetail.accept }}</span>
              </div>
            </el-col>
            <el-col :span="12" style="text-align: right">

            </el-col>
          </el-row>
        </el-card>
        <el-card style="margin-bottom: 20px"></el-card>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import CodeEditor from "@/components/CodeEditor";
import ProblemDetail from "@/components/ProblemDetail";
import axios from "@/utils/axios";

//todo 查看详情可以查看代码（显示代码长度），点击用户可以跳转至用户主页...

export default {
  name: "ProblemView",
  components: {ProblemDetail, CodeEditor},
  props: ["id"],
  data: function () {
    return {
      loading: false,
      authorLoading: true,
      currentTab: "problemDetail",
      problemDetail: {
        id: null,
        authorId: null,
        authorUsername: "",
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
        accept: null
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
      this.loading = this.authorLoading = true
      axios.get("/problems/" + this.id)
          .then((response) => {
            this.problemDetail = response.data
            this.loading = false
            axios.get("/accounts/username", {
              params: {
                "id": this.problemDetail.authorId
              }
            }).then((response) => {
              this.problemDetail.authorUsername = response.data
              this.authorLoading = false
            }).then((error) => {
              this.authorLoading = false
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
      }).catch((error) => {
        this.loading = false
        this.$message.error(error.response.data)
      })
    }
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
  padding-right: 26px;
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

.divider {
  margin: 15px 0;
}
</style>