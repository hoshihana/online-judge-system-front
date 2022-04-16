<template>
  <div>
    <el-container>
      <el-header v-loading="loading" height="auto">
        <el-card body-style="padding: 0">
          <el-row style="padding: 20px;" class="contest-card" type="flex">
            <el-col :span="18">
              <div style="margin-left: 10px">
                <el-tag effect="dark" :type="getTypeTagType(contest.type)" class="type-tag">{{ getTypeTagText(contest.type) }}</el-tag>
                <b style="line-height: 55px; font-size: x-large">{{ contest.id + " " + contest.name }}</b>
                <el-tooltip v-if="contest.passwordSet" content="需要参赛密码" placement="right">
                  <font-awesome-icon style="margin-left: 15px; margin-bottom: 2px" size="lg" color="rgb(144,147,153)" icon="fa-solid fa-lock"/>
                </el-tooltip>
              </div>
              <div style="margin: 20px 30px; color: #606266">
                <font-awesome-icon icon="fa-solid fa-calendar-days" fixed-width></font-awesome-icon>
                比赛时间：{{ $moment(contest.startTime).format("yyyy-MM-DD HH:mm") }} 至
                {{ $moment(contest.endTime).format("yyyy-MM-DD HH:mm") }}
              </div>
              <div style="margin: 20px 30px 10px; color: #606266">
                <font-awesome-icon icon="fa-solid fa-stopwatch" fixed-width></font-awesome-icon>
                比赛时长：{{ formatTimeInterval(contest.endTime - contest.startTime) }}
              </div>
            </el-col>
            <el-col :span="6" style="position: relative">
              <div style="position: absolute; bottom: 0; right: 0; color: #606266;">
                <div style="display: inline-block; text-align: center; padding: 0 20px">
                  <span style="line-height: 2">参加人数</span><br>
                  <b>{{ contest.participantAmount }}</b>
                </div>
                <div class="vertical-divider"></div>
                <div style="display: inline-block; text-align: center; padding: 0 20px;">
                  <span style="line-height: 2">题目数</span><br>
                  <b>{{ contest.problemAmount }}</b>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row style="padding: 0 10px" type="flex" align="middle">
            <el-col :span="18">
              <el-menu :default-active="$route.fullPath" mode="horizontal" router>
                <el-menu-item :index="basePath">比赛详情</el-menu-item>
                <el-menu-item :index="basePath + '/problem/list'">题目列表</el-menu-item>
                <el-menu-item>题目...</el-menu-item>
                <el-menu-item>提交记录</el-menu-item>
                <el-menu-item>排行榜</el-menu-item>
              </el-menu>
            </el-col>
            <el-col :span="6" style="text-align: right">
              <el-tooltip :content="statusTipText" placement="bottom">
                <el-tag class="status-tag" :type="statusTagType">{{ statusTagText }}</el-tag>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-card>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "ContestView",
  props: ["id"],
  data: function () {
    return {
      loading: false,
      isAuthor: false,
      contest: {
        id: null,
        authorId: null,
        authorUsername: "",
        name: "",
        type: "COMP",
        startTime: null,
        endTime: null,
        description: "",
        problemAmount: null,
        participantAmount: null,
        passwordSet: false,
      },
      current: null,
      timer: null,
      status: "before",
    }
  },
  provide: function () {
    return {
      contest: this.contest
    }
  },
  computed: {
    statusTagType: function () {
      if (this.status === "before") {
        return ""
      } else if (this.status === "after") {
        return "info"
      } else {
        return "success"
      }
    },
    statusTagText: function () {
      if (this.status === "before") {
        return "未开始"
      } else if (this.status === "after") {
        return "已结束"
      } else {
        return "进行中"
      }
    },
    statusTipText: function () {
      if (this.status === "before") {
        return "距离比赛开始还有：" + this.formatTimeInterval(this.contest.startTime - this.current)
      } else if (this.status === "after") {
        return "比赛已结束"
      } else {
        return "距离比赛结束还有：" + this.formatTimeInterval(this.contest.endTime - this.current)
      }
    },
    basePath: function () {
      return "/contest/" + this.id;
    }
  },
  methods: {
    updateStatus: function () {
      this.current = new Date()
      if (this.current < this.contest.startTime) {
        this.status = "before"
      } else if (this.current >= this.contest.endTime) {
        this.status = "after"
      } else {
        this.status = "ongoing"
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
    formatTimeInterval: function (interval) {
      let result = ""
      if (interval > 24 * 60 * 60 * 1000) {
        result += Math.floor(interval / (24 * 60 * 60 * 1000)).toString() + "天 "
        interval %= 24 * 60 * 60 * 1000
      }
      result += Math.floor(interval / (60 * 60 * 1000)).toString() + "时 "
      interval %= 60 * 60 * 1000
      result += Math.floor(interval / (60 * 1000)).toString() + "分 "
      interval %= 60 * 1000
      result += Math.floor(interval / 1000).toString() + "秒"
      return result
    },
  },
  mounted: function () {
    this.loading = true
    axios.get("/contests/" + this.id)
        .then((response) => {
          this.contest.id = response.data.id
          this.contest.authorId = response.data.authorId
          this.contest.authorUsername = response.data.authorUsername
          this.contest.name = response.data.name
          this.contest.type = response.data.type
          this.contest.startTime = new Date(response.data.startTime)
          this.contest.endTime = new Date(response.data.endTime)
          this.updateStatus()
          this.timer = setInterval(this.updateStatus, 500)
          this.contest.description = response.data.description
          this.contest.problemAmount = response.data.problemAmount
          this.contest.participantAmount = response.data.participantAmount
          this.contest.passwordSet = response.data.passwordSet
          this.loading = false
        }).catch((error) => {
      this.$message.error(error.response.data)
      this.isAuthor = this.contest.authorId === this.$root.loginStatus.userid
      this.loading = false
    })
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
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
}

.status-tag {
  vertical-align: center;
  padding: 0;
  width: 90px;
  height: 40px;
  font-size: medium;
  text-align: center;
  line-height: 40px;
}

.contest-card {
  background-image: linear-gradient(-20deg, #e9defa 0%, #fbfcdb 100%);
}

.vertical-divider {
  display: inline-block;
  width: 0;
  height: 40px;
  border-left: 2px dashed #a8a8a8;
}
</style>