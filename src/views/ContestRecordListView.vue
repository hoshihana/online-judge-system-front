<template>
  <div>
    <el-card body-style="padding-top: 2px">
      <template #header>
        <el-row :gutter="10" align="middle" type="flex">
          <el-col :span="3">
            <el-input placeholder="题号" v-model="problemNumber" clearable max-length="20"></el-input>
          </el-col>
          <el-col :span="3">
            <el-input placeholder="用户名" :disabled="disableUsername" v-model="username" clearable
                      max-length="20"></el-input>
          </el-col>
          <el-col :span="3">
            <el-select v-model="submitLanguage" placeholder="语言" clearable>
              <el-option
                  v-for="option in languageOptions" :key="option.value" :label="option.label"
                  :value="option.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="4">
            <el-select v-model="judgeResult" placeholder="评测结果" clearable>
              <el-option
                  v-for="option in resultOptions" :key="option.value" :label="option.label"
                  :value="option.value">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="3">
            <el-button type="primary" plain size="medium" @click="search" :disabled="loading">
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" fixed-width></font-awesome-icon>
              搜索
            </el-button>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-button type="text" @click="update" style="margin-right: 20px" :disabled="loading">
              <font-awesome-icon icon="fa-solid fa-arrows-rotate" fixed-width></font-awesome-icon>
              刷新
            </el-button>
            <el-switch v-model="onlySelf" active-text="仅显示我的记录" @change="changeOnlySelf"
                       :disabled="loading"></el-switch>
          </el-col>
        </el-row>
      </template>
      <el-table v-loading="loading" ref="list" :data="records" stripe style="width: 100%" @sort-change="sortChange">
        <el-table-column label="#" align="center">
          <template #default="scope">
            <router-link v-if="checkRecord(scope.row)"
                         class="el-link el-link--primary" :to="'/contest/' + id + '/record/' + scope.row.id">{{ scope.row.id }}
            </router-link>
            <span v-else>
              {{ scope.row.id }}
            </span>
          </template>
        </el-table-column>
        <el-table-column label="用户" align="center">
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="'/user/' + scope.row.userId" target="_blank">
              {{ scope.row.username }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="submitTime" align="center" sortable="custom">
          <template #default="scope">
            {{ scope.row.submitTime }}
          </template>
        </el-table-column>
        <el-table-column label="题目" align="center">
          <template #default="scope">
            <router-link class="el-link el-link--primary"
                         :to="'/contest/' + id + '/problem/' + scope.row.problemNumber">{{ scope.row.problemNumber }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="语言" align="center">
          <template #default="scope">
            {{ getLanguage(scope.row.submitLanguage) }}
          </template>
        </el-table-column>
        <el-table-column label="评测结果" align="center">
          <template #default="scope">
            <el-tag v-if="checkRecord(scope.row)"
                    size="small" style="cursor: pointer" :type="getResultType(scope.row.judgeResult)"
                    @click="goRecord(scope.row.id)">{{
                getResult(scope.row.judgeResult)
              }} <i v-if="scope.row.judgeResult === 'PD' || scope.row.judgeResult === 'JD'" class="el-icon-loading"></i>
            </el-tag>
            <el-tag v-else size="small" style="cursor: default" :type="getResultType(scope.row.judgeResult)">{{
                getResult(scope.row.judgeResult)
              }} <i v-if="scope.row.judgeResult === 'PD' || scope.row.judgeResult === 'JD'" class="el-icon-loading"></i>
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="运行时间" prop="executeTime" align="center" sortable="custom">
          <template #default="scope">
            {{ scope.row.executeTime === null ? "--" : scope.row.executeTime + " ms" }}
          </template>
        </el-table-column>
        <el-table-column label="运行内存" prop="executeMemory" align="center" sortable="custom">
          <template #default="scope">
            {{ scope.row.executeMemory === null ? "--" : scope.row.executeMemory + " KB" }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :total="total"
          :page-size="pageSize"
          :current-page.sync="pageIndex"
          layout="prev, pager, next"
          style="margin-top: 20px; text-align: right"
          @current-change="update">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "ContestRecordListView",
  props: ["id"],
  inject: ["contest"],
  data: function () {
    return {
      loading: false,
      disableUsername: false,

      records: [],
      total: 0,
      pageIndex: 1,
      pageSize: 10,

      problemNumber: "",
      username: "",
      submitLanguage: "",
      judgeResult: "",
      onlySelf: false,
      orderBy: "",
      asc: null,

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
      }],

      resultOptions: [{
        value: "PD",
        label: "Pending"
      }, {
        value: "CE",
        label: "Compile Error"
      }, {
        value: "AC",
        label: "Accepted"
      }, {
        value: "WA",
        label: "Wrong Answer"
      }, {
        value: "RE",
        label: "Runtime Error"
      }, {
        value: "TLE",
        label: "Time Limit Exceeded"
      }, {
        value: "MLE",
        label: "Memory Limit Exceeded"
      }, {
        value: "SE",
        label: "System Error"
      }],
    }
  },
  methods: {
    update: function () {
      this.loading = true
      axios.get("/contests/" + this.id + "/records/amount", {
        params: {
          "problemNumber": this.problemNumber,
          "username": this.username,
          "onlySelf": this.onlySelf,
          "submitLanguage": this.submitLanguage,
          "judgeResult": this.judgeResult,
        }
      }).then((response) => {
        this.total = response.data;
        this.pageIndex = Math.max(Math.min(this.pageIndex, Math.ceil(this.total / this.pageSize)), 1);
        axios.get("/contests/" + this.id + "/records", {
          params: {
            "problemNumber": this.problemNumber,
            "username": this.username,
            "onlySelf": this.onlySelf,
            "submitLanguage": this.submitLanguage,
            "judgeResult": this.judgeResult,
            "orderBy": this.orderBy,
            "asc": this.asc,
            "pageIndex": this.pageIndex,
            "pageSize": this.pageSize
          }
        }).then((response) => {
          this.records = response.data
          this.loading = false
        }).catch((error) => {
          this.loading = false
          this.$message.error(error.response.data)
        })
      }).catch((error) => {
        this.loading = false
        this.$message.error(error.response.data)
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
    search: function () {
      this.$refs.list.clearSort()
      this.update()
    },
    changeOnlySelf: function () {
      this.$refs.list.clearSort()
      if (this.onlySelf) {
        this.username = ""
        this.disableUsername = true
      } else {
        this.disableUsername = false
      }
      this.update()
    },
    sortChange: function (column) {
      if (column.order === null) {
        this.orderBy = ""
        this.asc = null
      } else {
        this.orderBy = column.prop
        this.asc = (column.order === "ascending")
      }
      this.update()
    },
    goRecord: function (recordId) {
      this.$router.push("/contest/" + this.id + "/record/" + recordId)
    },
    checkRecord: function (record) {
      if(this.contest.authorId === this.$root.userid || record.userid === this.$root.userid) {
        return true
      }
      if(new Date() < this.contest.endTime) {
        return false
      } else {
        return !record.personal
      }
    }
  },
  mounted: function () {
    this.update()
  }
}
</script>

<style scoped>

</style>