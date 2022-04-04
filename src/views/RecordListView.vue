<template>
  <div>
    <el-card body-style="padding-top: 2px">
      <template #header>
        <el-row :gutter="10" align="middle" type="flex">
          <el-col :span="3">
            <el-input placeholder="题号" v-model="problemId" clearable max-length="20"></el-input>
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
            <el-button type="primary" plain size="medium" @click="search">
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" fixed-width></font-awesome-icon>
              搜索
            </el-button>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-switch v-model="onlySelf" active-text="仅显示我的记录" @change="changeOnlySelf"></el-switch>
          </el-col>
        </el-row>
      </template>
      <el-table v-loading="loading" ref="list" :data="records" stripe style="width: 100%" @sort-change="sortChange">
        <el-table-column label="#" align="center">
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="'/record/' + scope.row.id">{{ scope.row.id }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="用户" align="center">
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="'/user/' + scope.row.userId" target="_blank">{{ scope.row.username }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="时间" prop="submitTime" align="center" sortable="custom">
          <template #default="scope">
            {{ scope.row.submitTime }}
          </template>
        </el-table-column>
        <el-table-column label="题目" align="center">
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="'/problem/' + scope.row.problemId">{{ scope.row.problemId }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="语言" align="center">
          <template #default="scope">
            {{ getLanguage(scope.row.submitLanguage) }}
          </template>
        </el-table-column>
        <el-table-column label="评测结果" align="center">
          <template #default="scope">
            <el-tag size="small" :type="getResultType(scope.row.judgeResult)">{{
                getResult(scope.row.judgeResult)
              }}
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
            {{ scope.row.executeMemory === null ? "--" : scope.row.executeMemory + " MB"}}
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

//todo 添加刷新按钮

export default {
  name: "RecordView",
  props: ["initProblemId", "initOnlySelf"],
  data: function () {
    return {
      loading: false,
      disableUsername: false,

      records: [],
      total: 0,
      pageIndex: 1,
      pageSize: 20,

      problemId: "",
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
        value: "JAVA",
        label: "Java"
      }, {
        value: "PY",
        label: "Python"
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
      axios.get("/records/amount", {
        params: {
          "problemId": this.problemId,
          "username": this.username,
          "onlySelf": this.onlySelf,
          "submitLanguage": this.submitLanguage,
          "judgeResult": this.judgeResult,
        }
      }).then((response) => {
        this.total = response.data;
        axios.get("/records", {
          params: {
            "problemId": this.problemId,
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
        case "JAVA":
          return "Java"
        case "PY":
          return "Python"
        default:
          return language
      }
    },
    // todo 配置JD状态
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
    }
  },
  mounted: function () {
    if (this.initProblemId !== undefined)
      this.problemId = this.initProblemId
    if (this.initOnlySelf === "true") {
      this.disableUsername = true
      this.onlySelf = true
    }
    this.update()
  }
}
</script>

<style scoped>

</style>