<template>
  <div>
    <el-card body-style="padding-top: 2px">
      <template #header>
        <el-input placeholder="比赛号/比赛名" v-model="key" clearable style="width: 250px" maxlength="40"></el-input>
        <el-button type="primary" plain size="medium" @click="update" style="margin-left: 15px"
                   :disabled="loading">
          <font-awesome-icon icon="fa-solid fa-magnifying-glass" fixed-width></font-awesome-icon>
          搜索
        </el-button>
      </template>
      <el-table v-loading="loading" :data="contests" stripe :show-header="false" style="width: 100%">
        <el-table-column min-width="1">
          <template #default="scope">
            <el-tag effect="dark" :type="getTypeTagType(scope.row.type)" class="type-tag"
                    style="display: inline-block; vertical-align: middle;">
              {{ getTypeTagText(scope.row.type) }}
            </el-tag>
            <div style="display: inline-block; vertical-align: middle">
              <router-link class="el-link el-link--primary" style="font-size: large; margin-bottom: 10px"
                           :to="'/contest/' + scope.row.id">{{ scope.row.name }}
              </router-link>
              <el-tooltip v-if="scope.row.passwordSet" content="需要参赛密码" placement="right">
                <font-awesome-icon style="margin-left: 10px; margin-bottom: 4px" color="rgb(144,147,153)"
                                   icon="fa-solid fa-lock"/>
              </el-tooltip>
              <br>
              <span class="contest-info">
                <font-awesome-icon icon="fa-solid fa-hashtag" fixed-width></font-awesome-icon> {{ scope.row.id }}
              </span>
              <span class="contest-info">
                <font-awesome-icon icon="fa-solid fa-user"
                                   fixed-width></font-awesome-icon> {{ scope.row.authorUsername }}
              </span>
              <span class="contest-info">
                <font-awesome-icon icon="fa-solid fa-stopwatch" fixed-width></font-awesome-icon> {{
                  formatTimeInterval(new Date(scope.row.endTime) - new Date(scope.row.startTime), false)
                }}
              </span>
              <span class="contest-info">
                <font-awesome-icon icon="fa-solid fa-list"
                                   fixed-width></font-awesome-icon> {{ scope.row.problemAmount }}题
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column min-width="1" align="right" :key="statusColumnKey">
          <template #default="scope">
              <div style="display: inline-block; vertical-align: middle; margin: 7px 0">
                <el-tooltip placement="left" effect="light" :content="scope.row.statusTipText">
                  <el-tag :type="scope.row.statusTagType" size="small" style="margin-right: 10px">
                    {{ scope.row.statusTagText }}
                  </el-tag>
                </el-tooltip>
                <span class="contest-info">{{scope.row.statusInfo}}</span>
                <el-tooltip placement="right" :content="scope.row.percentage + '%'">
                  <el-progress :percentage="scope.row.percentage" :status="scope.row.percentageSatus" :format="()=>''" style="margin-top: 12px; text-align: left"></el-progress>
                </el-tooltip>
              </div>
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
  name: "ContestListView",
  data: function () {
    return {
      loading: false,
      key: "",
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      contests: [],
      statusColumnKey: "",
      timer: null
    }
  },
  methods: {
    update: function () {
      this.loading = true
      axios.get("/contests/amount", {
        params: {
          "key": this.key,
        }
      }).then((response) => {
        this.total = response.data;
        this.pageIndex = Math.max(Math.min(this.pageIndex, Math.ceil(this.total / this.pageSize)), 1);
        axios.get("/contests", {
          params: {
            "key": this.key,
            "pageIndex": this.pageIndex,
            "pageSize": this.pageSize
          }
        }).then((response) => {
          this.contests = response.data
          this.updateStatus()
          clearInterval(this.timer)
          this.timer = setInterval(this.updateStatus, 500)
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
          this.contests[i].percentage = 0
          this.contests[i].percentageSatus = ""
          this.contests[i].statusTagType = ""
          this.contests[i].statusTagText = "未开始"
          this.contests[i].statusTipText = "距离比赛开始还有：" + this.formatTimeInterval(startTime - current)
        } else if (current >= endTime) {
          this.contests[i].statusInfo = "结束于 " + this.$moment(endTime).format("yyyy-MM-DD HH:mm")
          this.contests[i].percentage = 100
          this.contests[i].percentageSatus = "success"
          this.contests[i].statusTagType = "info"
          this.contests[i].statusTagText = "已结束"
          this.contests[i].statusTipText = "比赛已结束"
        } else {
          this.contests[i].statusInfo = "结束于 " + this.$moment(endTime).format("yyyy-MM-DD HH:mm")
          this.contests[i].percentage = Math.floor((current - startTime) / (endTime - startTime) * 100)
          this.contests[i].percentageSatus = ""
          this.contests[i].statusTagType = "success"
          this.contests[i].statusTagText = "进行中"
          this.contests[i].statusTipText  = "距离比赛结束还有：" + this.formatTimeInterval(endTime - current)
        }
      }
      this.statusColumnKey = Math.random().toString()
    },
    formatTimeInterval: function (interval, full) {
      let result = ""
      let day = Math.floor(interval / (24 * 60 * 60 * 1000)).toString()
      interval %= 24 * 60 * 60 * 1000
      let hour = Math.floor(interval / (60 * 60 * 1000)).toString()
      interval %= 60 * 60 * 1000
      let minute = Math.floor(interval / (60 * 1000)).toString()
      interval %= 60 * 1000
      let second = Math.floor(interval / 1000).toString()
      if (day > 0) {
        result += day + "天 "
      }
      if (hour > 0 || full) {
        result += hour + "时 "
      }
      if (minute > 0 || full) {
        result += minute +"分 "
      }
      if (second > 0 || full) {
        result += second +"秒"
      }
      return result
    },
  },
  mounted() {
    this.update();
  },
  destroyed: function () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.type-tag {
  height: 55px;
  width: 55px;
  padding: 0;
  line-height: 55px;
  text-align: center;
  margin-right: 10px;
  font-size: large;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.contest-info {
  margin-right: 10px;
  font-size: small;
  color: #909399;
}

::v-deep .el-progress-bar {
  padding-right: 20px;
  margin-right: -25px;
}
</style>