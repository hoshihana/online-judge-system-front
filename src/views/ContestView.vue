<template>
  <div>
    <el-container>
      <el-header v-loading="loading" height="auto" style="padding-left: 0; padding-right: 0">
        <el-card body-style="padding: 0">
          <el-row style="padding: 20px;" class="contest-card" type="flex">
            <el-col :span="18">
              <div style="margin-left: 10px">
                <el-tag effect="dark" :type="getTypeTagType(contest.type)" class="type-tag">
                  {{ getTypeTagText(contest.type) }}
                </el-tag>
                <b style="line-height: 55px; font-size: x-large">{{ contest.id + " " + contest.name }}</b>
                <el-tooltip v-if="contest.passwordSet" content="需要参赛密码" placement="right">
                  <font-awesome-icon style="margin-left: 15px; margin-bottom: 2px" size="lg" color="rgb(144,147,153)"
                                     icon="fa-solid fa-lock"/>
                </el-tooltip>
              </div>
              <div style="margin: 20px 30px; color: #606266">
                <font-awesome-icon icon="fa-solid fa-calendar-days" fixed-width></font-awesome-icon>
                比赛时间：{{ $moment(contest.startTime).format("yyyy-MM-DD HH:mm") }} 至
                {{ $moment(contest.endTime).format("yyyy-MM-DD HH:mm") }}
              </div>
              <div style="margin: 20px 30px 10px; color: #606266">
                <font-awesome-icon icon="fa-solid fa-stopwatch" fixed-width></font-awesome-icon>
                比赛时长：{{ formatTimeInterval(contest.endTime - contest.startTime, false) }}
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
              <el-menu :default-active="$route.fullPath" mode="horizontal" router active-text-color="#409EFF" text-color="#606266">
                <el-menu-item :index="basePath">比赛详情</el-menu-item>
                <el-menu-item :index="basePath + '/problem/list'" :disabled="!user.isAdmin && !user.isParticipant">
                  题目列表
                </el-menu-item>
                <el-submenu :disabled="!user.isAdmin && !user.isParticipant"
                            :index="basePath + '/problem'"
                            @click.native="goProblem">
                  <template #title>
                    <font-awesome-icon icon="fa-solid fa-caret-right" fixed-width></font-awesome-icon> {{ currentMenuProblemNumber}}
                  </template>
                  <el-menu-item v-for="i in contest.problemAmount" :index="basePath + '/problem/' + i" :key="i" style="width: 50px">
                    <font-awesome-icon icon="fa-solid fa-caret-right" fixed-width></font-awesome-icon> {{i}}
                  </el-menu-item>
                </el-submenu>
                <el-menu-item :disabled="!user.isAdmin && !user.isParticipant" :index="basePath + '/record/list'">提交记录</el-menu-item>
                <el-menu-item :disabled="!user.isAdmin && !user.isParticipant">排行榜</el-menu-item>
              </el-menu>
            </el-col>
            <el-col :span="6" style="display: flex; justify-content: flex-end;">
              <el-button v-if="user.isAuthor" type="primary" size="medium" plain style="margin-right: 20px"
                         @click="editContest">
                <font-awesome-icon icon="fa-solid fa-pen-to-square" fixed-width></font-awesome-icon>
                编辑比赛
              </el-button>
              <el-button v-if="!user.isAdmin && status!=='before'" type="warning" size="medium" plain
                         style="margin-right: 20px" @click="showParticipateDialog = true"
                         :disabled="user.isParticipant">
                <font-awesome-icon icon="fa-solid fa-flag" fixed-width></font-awesome-icon>
                {{ user.isParticipant ? "已参赛" : "参加比赛" }}
              </el-button>
              <el-dialog :visible.sync="showParticipateDialog" width="40%" :destroy-on-close="true"
                         @open="nickname = password = null">
                <template #title>
                  <font-awesome-icon icon="fa-solid fa-flag" fixed-width></font-awesome-icon>
                  参加比赛
                </template>
                <div style="font-size: medium; margin-bottom: 10px">
                  <b>参赛昵称</b>
                </div>
                <div style="margin: 0 15px">
                  <el-input type="text" placeholder="参赛昵称" v-model="nickname" maxlength="30" show-word-limit></el-input>
                </div>
                <div v-if="contest.passwordSet" style="font-size: medium; margin: 20px 0 10px">
                  <b>参赛密码<span style="color: #F56C6C">*</span></b>
                </div>
                <div v-if="contest.passwordSet" style="margin: 0 15px">
                  <el-input type="password" placeholder="参赛密码" v-model="password" show-password></el-input>
                </div>
                <template #footer>
                  <div>
                    <el-button size="medium" plain @click="showParticipateDialog = false">取消</el-button>
                    <el-button type="primary" size="medium" plain @click="participate">确定</el-button>
                  </div>
                </template>
              </el-dialog>
              <el-tooltip :content="statusTipText" placement="bottom">
                <el-tag class="status-tag" :type="statusTagType">{{ statusTagText }}</el-tag>
              </el-tooltip>
            </el-col>
          </el-row>
        </el-card>
      </el-header>
      <el-main style="padding-left: 0; padding-right: 0">
        <router-view :key="this.$route.path"></router-view>
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
      currentMenuProblemNumber: 1,
      showParticipateDialog: false,
      nickname: null,
      password: null,
      current: null,
      timer: null,
      status: "before",
      user: {
        isAuthor: null,
        isParticipant: null,
        isAdmin: null,
      }
    }
  },
  provide: function () {
    return {
      contest: this.contest,
      user: this.user
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
        return "距离比赛开始还有：" + this.formatTimeInterval(this.contest.startTime - this.current, true)
      } else if (this.status === "after") {
        return "比赛已结束"
      } else {
        return "距离比赛结束还有：" + this.formatTimeInterval(this.contest.endTime - this.current, true)
      }
    },
    basePath: function () {
      return "/contest/" + this.id;
    },
  },
  beforeRouteUpdate: function (to, from, next) {
    let fullPath = to.fullPath
    if(new RegExp("^" + this.basePath + "/problem/[1-9][0-9]*$").test(fullPath)) {
      let problemNumber = parseInt(fullPath.slice(fullPath.lastIndexOf("/") + 1, fullPath.length))
      if(problemNumber <= this.contest.problemAmount) {
        this.currentMenuProblemNumber = problemNumber
      }
    }
    next()
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
    editContest: function () {
      this.$router.push("/contest/" + this.id + "/edit")
    },
    participate: function () {
      if (this.contest.passwordSet && (this.password === null || this.password === "")) {
        this.$message.error("请输入参赛密码");
      } else if (this.nickname !== null && this.nickname.length > 30) {
        this.$message.error("参赛昵称长度不能超过30");
      } else {
        axios.post("/contests/" + this.id + "/participate", {
          "nickname": this.nickname,
          "password": this.password
        }).then(() => {
          this.$message.success("参加比赛成功")
          this.user.isParticipant = true
          this.showParticipateDialog = false
        }).catch((error) => {
          this.$message.error(error.response.data)
        })
      }
    },
    goProblem: function () {
      if(this.user.isAdmin || this.user.isParticipant) {
        this.$router.push(this.basePath + '/problem/' + this.currentMenuProblemNumber)
      }
    }
  },
  mounted: function () {
    this.loading = true
    this.user.isAdmin = this.$root.loginStatus.role === "ADMIN"
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
          this.timer = setInterval(this.updateStatus, 100)
          this.contest.description = response.data.description
          this.contest.problemAmount = response.data.problemAmount
          this.contest.participantAmount = response.data.participantAmount
          this.contest.passwordSet = response.data.passwordSet
          this.user.isAuthor = this.contest.authorId === this.$root.loginStatus.userid
          this.loading = false
          // 初始化currentMenuProblemNumber
          let fullPath = this.$route.fullPath
          if(new RegExp("^" + this.basePath + "/problem/[1-9][0-9]*$").test(fullPath)) {
            let problemNumber = parseInt(fullPath.slice(fullPath.lastIndexOf("/") + 1, fullPath.length))
            if(problemNumber <= this.contest.problemAmount) {
              this.currentMenuProblemNumber = problemNumber
            }
          }
          if (!this.user.isAuthor) {
            axios.post("/contests/" + this.id + "/users/" + this.$root.loginStatus.userid + "/isParticipant")
                .then((response) => {
                  this.user.isParticipant = response.data
                }).catch((error) => {
              this.$message.error(error.response.data)
            })
          }
        }).catch((error) => {
      this.$message.error(error.response.data)
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

::v-deep .el-menu-item:hover{
  outline: 0 !important;
  color: #409EFF !important;
}
</style>