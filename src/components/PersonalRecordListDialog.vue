<template>
  <div>
    <el-dialog :visible.sync="checkMoreRecords" width="70%" destroy-on-close>
      <template #title>
        <el-row type="flex" align="middle">
          <el-col :span="8" style="text-align: left">
            <h3 style="margin:0; padding-left: 10px">我的历史提交</h3>
          </el-col>
          <el-col :span="8" style="text-align: center">
            <h3 style="margin:0">{{ isContestProblem ? contestId + "-" + problemNumber + " " + problemName : problemId + " " + problemName }}</h3>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-button type="text" @click="update" style="margin-right: 50px" :disabled="loading">
              <font-awesome-icon icon="fa-solid fa-arrows-rotate" fixed-width></font-awesome-icon>
              刷新
            </el-button>
          </el-col>
        </el-row>
      </template>
      <el-table v-loading="loading" ref="list" :data="records" stripe style="width: 100%" :max-height="tableHeight">
        <el-table-column label="#" align="center">
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="isContestProblem ? '/contest/' + contestId + '/record/' + scope.row.id : '/record/' + scope.row.id" target="_blank">
              {{ scope.row.id }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="submitTime" align="center">
          <template #default="scope">
            {{ scope.row.submitTime }}
          </template>
        </el-table-column>
        <el-table-column label="语言" align="center">
          <template #default="scope">
            {{ getLanguage(scope.row.submitLanguage) }}
          </template>
        </el-table-column>
        <el-table-column label="评测结果" align="center">
          <template #default="scope">
            <el-tag size="small" style="cursor: pointer" :type="getResultType(scope.row.judgeResult)"
                    @click="goRecord(scope.row.id)">{{
                getResult(scope.row.judgeResult)
              }} <i v-if="scope.row.judgeResult === 'PD' || scope.row.judgeResult === 'JD'" class="el-icon-loading"></i>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="运行时间" prop="executeTime" align="center">
          <template #default="scope">
            {{ scope.row.executeTime === null ? "--" : scope.row.executeTime + " ms" }}
          </template>
        </el-table-column>
        <el-table-column label="运行内存" prop="executeMemory" align="center">
          <template #default="scope">
            {{ scope.row.executeMemory === null ? "--" : scope.row.executeMemory + " KB" }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "PersonalRecordListDialog",
  props: ["isContestProblem", "contestId", "problemNumber", "problemId", "problemName", "dialogKey"],
  data: function () {
    return {
      loading: false,
      checkMoreRecords: false,
      tableHeight: 400,
      records: []
    }
  },
  watch: {
    dialogKey: function () {
      this.checkMoreRecords = true
      this.update()
      this.tableHeight = document.documentElement.clientHeight - 400
    }
  },
  methods: {
    goRecord: function (recordId) {
      let routeUrl = this.$router.resolve({
        path: this.isContestProblem ? "/contest/" + this.contestId + "/record/" + recordId : "/record/" + recordId,
      });
      window.open(routeUrl.href, '_blank');
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
    update: function () {
      this.loading = true
      if (this.isContestProblem) {
        axios.get("/contests/" + this.contestId + "/problems/" + this.problemNumber + "/records/recent", {
          params: {
            "limit": ~(1 << 31)
          }
        }).then((response) => {
          this.records = response.data
          this.loading = false
        }).catch((error) => {
          this.loading = false
          this.$message.error(error.response.data)
        })
      } else {
        axios.get("/records/recent", {
          params: {
            "problemId": this.problemId,
            "userId": this.$root.loginStatus.userid,
            "limit": ~(1 << 31)
          }
        }).then((response) => {
          this.records = response.data
          this.loading = false
        }).catch((error) => {
          this.loading = false
          this.$message.error(error.response.data)
        })
      }
    }
  },
}
</script>

<style scoped>
::v-deep .el-dialog__body {
  padding: 0 20px 20px 20px;
  margin-left: 20px;
  color: #606266;
  font-size: 14px;
}
</style>