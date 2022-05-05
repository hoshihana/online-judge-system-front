<template>
  <div>
    <el-container>
      <el-main style="padding: 0 20px 20px 0">
        <el-card v-loading="chartLoading" style="margin-bottom: 20px">
          <ve-line :title="chartTitle" :data="chartData" :settings="chartSettings" :yAxis="chartYAxis"></ve-line>
        </el-card>
        <el-card>
          <el-row>
            <el-col :span="12">
              <h1 style="margin: 0 0 10px 5px; font-size: 20px">随机题目</h1>
            </el-col>
            <el-col :span="12" style="text-align: right">
              <el-button type="text" @click="getRandomProblemList" style="margin-right: 20px" :disabled="problemListLoading">
                <font-awesome-icon icon="fa-solid fa-dice" fixed-width></font-awesome-icon> 换一换
              </el-button>
            </el-col>
          </el-row>
          <el-table v-loading="problemListLoading" :data="problemEntries" :show-header="false" stripe style="width: 100%">
            <el-table-column min-width="1" align="center">
              <template #default="scope">
                <router-link class="el-link el-link--primary" :to="'/problem/' + scope.row.id">{{ scope.row.id }}</router-link>
              </template>
            </el-table-column>
            <el-table-column min-width="10">
              <template #default="scope">
                <router-link class="el-link el-link--primary" :to="'/problem/' + scope.row.id">{{ scope.row.name }}</router-link>
              </template>
            </el-table-column>
            <el-table-column min-width="2" align="right">
              <template #default="scope">
                <el-tooltip effect="dark" placement="left">
                  <el-tag size="small">
                    {{ getPercent(scope.row.accept, scope.row.submit) }}
                  </el-tag>
                  <template #content>
                    总提交：{{ scope.row.submit }}<br/>
                    总通过：{{ scope.row.accept }}
                  </template>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-main>
      <el-aside width="400px">
        <el-card style="margin-bottom: 20px">
          <template #header>
            <h1 style="margin: 0; font-size: 20px">公告</h1>
          </template>
          &#127752;&#127752;&#127752;欢迎来到在线评测系统~
        </el-card>
        <el-card>
          <template #header>
            <h1 style="margin: 0; font-size: 20px">近期比赛</h1>
          </template>
          <el-table v-loading="contestListLoading" :data="contests" stripe :show-header="false" style="width: 100%">
            <el-table-column min-width="4">
              <template #default="scope">
                <el-tag effect="dark" :type="getTypeTagType(scope.row.type)" size="small"
                        style="display: inline-block; vertical-align: middle; margin-right: 10px">
                  {{ getTypeTagText(scope.row.type) }}
                </el-tag>
                <div style="display: inline-block; vertical-align: middle">
                  <router-link class="el-link el-link--primary" style="font-size: large;"
                               :to="'/contest/' + scope.row.id">{{ scope.row.name }}
                  </router-link>
                </div>
              </template>
            </el-table-column>
            <el-table-column min-width="1" align="center" :key="statusColumnKey">
              <template #default="scope">
                <div style="display: inline-block; vertical-align: middle; padding-right: 10px">
                    <el-tooltip placement="top" :content="scope.row.statusInfo">
                    <el-tag :type="scope.row.statusTagType" size="small">
                      {{ scope.row.statusTagText }}
                    </el-tag>
                    </el-tooltip>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import VeLine from 'v-charts/lib/line.common'
import "echarts/lib/component/title";
import axios from "@/utils/axios";

export default {
  name: "HomeView",
  components: {
    VeLine,
  },
  data: function () {
    return {
      recordDayLimit: 31,
      problemLimit: 10,
      contestDayLimit: 3,
      chartLoading: false,
      problemListLoading: false,
      contestListLoading: false,
      statusColumnKey: "",
      chartData: {
        columns: ["日期", "提交数", "通过数"],
        rows: []
      },
      chartSettings: {
        area: true,
      },
      chartYAxis: {
        minInterval: 1,
      },
      chartTitle: {
        show: true,
        text: "近期提交",
        textStyle: {
          fontSize: 20
        }
      },
      problemEntries: [],
      contests: [],
    }
  },
  methods: {
    getRandomProblemList: function(){
      this.problemListLoading = true
      axios.get("/problemEntries/public/random", {
        params: {
          "limit": this.problemLimit
        }
      }).then((response) => {
        this.problemEntries = response.data
        this.problemListLoading = false
      }).catch((error) => {
        this.problemListLoading = false
        this.$message.error(error.response.data)
      })
    },
    getPercent: function (up, down) {
      if(down === 0) {
        return "0%"
      }
      if(up * 100 % down === 0) {
        return up * 100 / down + "%"
      } else {
        return (up * 100 / down).toFixed(1) + "%"
      }
    },
    getTypeTagType: function (type) {
      switch (type) {
        case "PRAC":
          return ""
        case "COMP":
          return "success"
      }
    },
    getTypeTagText: function (type) {
      switch (type) {
        case "PRAC":
          return "练习"
        case "COMP":
          return "竞赛"
      }
    },
    updateStatus: function () {
      let current = new Date()
      for(let i = 0; i < this.contests.length; i++) {
        let startTime = new Date(this.contests[i].startTime)
        let endTime = new Date(this.contests[i].endTime)
        if (current < startTime) {
          this.contests[i].statusInfo = "开始于 " + this.$moment(startTime).format("yyyy-MM-DD HH:mm")
          this.contests[i].statusTagType = ""
          this.contests[i].statusTagText = "未开始"
        } else if (current >= endTime) {
          this.contests[i].statusInfo = "结束于 " + this.$moment(endTime).format("yyyy-MM-DD HH:mm")
          this.contests[i].statusTagType = "info"
          this.contests[i].statusTagText = "已结束"
        } else {
          this.contests[i].statusInfo = "结束于 " + this.$moment(endTime).format("yyyy-MM-DD HH:mm")
          this.contests[i].statusTagType = "success"
          this.contests[i].statusTagText = "进行中"
        }
      }
      this.statusColumnKey = Math.random().toString()
    },
  },
  mounted: function () {
    this.chartLoading = true
    axios.get("/records/status", {
      params: {
        "dayLimit": this.recordDayLimit
      }
    }).then((response) => {
      let current = new Date()
      for(let i = 0; i < this.recordDayLimit; i++) {
        this.chartData.rows.push({
          "日期": this.$moment(current).format("MM-DD"),
          "提交数": response.data[i].submittedRecordAmount,
          "通过数": response.data[i].acceptedRecordAmount,
        })
        current.setTime(current.getTime() - 24 * 60 * 60 * 1000)
      }
      this.chartData.rows.reverse()
      this.chartLoading = false
    }).catch((error) => {
      this.chartLoading = false
      this.$message.error(error.response.data)
    })
    this.getRandomProblemList()
    this.contestListLoading = true
    axios.get("/contests/recent", {
      params: {
        "dayLimit": this.contestDayLimit
      }
    }).then((response) => {
      this.contests = response.data
      this.updateStatus()
      clearInterval(this.timer)
      this.timer = setInterval(this.updateStatus, 500)
      this.contestListLoading = false
    }).catch((error) => {
      this.contestListLoading = false
      this.$message.error(error.response.data)
    })
  },
  destroyed: function () {
    clearInterval(this.timer)
  }
}
</script>
