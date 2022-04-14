<template>
  <div>
    <el-card body-style="padding-top: 5px">
      <el-table :data="contests" stripe style="width: 100%" @sort-change="sortChange">
        <el-table-column min-width="4" align="center">
          <template #default="scope">
            <el-tooltip v-if="scope.row.passwordSet" content="需要参赛密码" placement="bottom">
              <font-awesome-icon color="rgb(144,147,153)" icon="fa-solid fa-lock"/>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="#" min-width="6">
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="'/contest/' + scope.row.id">{{
                scope.row.id
              }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column min-width="50">
          <template #header>
            比赛名
            <el-input placeholder="比赛号/比赛名" v-model="key" clearable size="medium" style="margin-left: 5%; width: 50%"
                      maxlength="40">
            </el-input>
            <el-button type="primary" plain size="medium" @click="update" style="margin-left: 2%"
                       :disabled="problemListLoading">
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" fixed-width></font-awesome-icon>
              搜索
            </el-button>
          </template>
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="'/contest/' + scope.row.id">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column min-width="8" align="center">
          <template #header>
            <el-dropdown trigger="click" :hide-on-click="false" placement="bottom" style="cursor: pointer">
              <span :class="{'active-filter': showPractice || showCompetition}">类型<i
                  class="el-icon-arrow-down el-icon--right"></i></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-checkbox v-model="showPractice" style="margin: 0 10px" @change="update">练习</el-checkbox>
                  <br>
                  <el-checkbox v-model="showCompetition" style="margin: 10px 10px 0" @change="update">竞赛</el-checkbox>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #default="scope">
            <el-tag :type="getTypeTagType(scope.row.type)" effect="dark">
              {{ getTypeTagText(scope.row.type) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" min-width="10" align="center" sortable="custom">
          <template #default="scope">
            {{ $moment(scope.row.startTime).format("yyyy-MM-DD") }}<br>
            {{ $moment(scope.row.startTime).format("HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column label="结束时间" min-width="10" align="center">
          <template #default="scope">
            {{ $moment(scope.row.endTime).format("yyyy-MM-DD") }}<br>
            {{ $moment(scope.row.endTime).format("HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column label="状态" min-width="10" align="center" :key="statusColumnKey">
          <template #default="scope">
            <el-tooltip placement="top" effect="light" :content="scope.row.statusTipText">
              <el-tag :type="scope.row.statusTagType">
                {{ scope.row.statusTagText }}
              </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column min-width="8">
          <template #header>
            <el-button type="primary" size="medium" plain @click="createContest">
              <font-awesome-icon icon="fa-solid fa-plus"></font-awesome-icon>
              创建比赛
            </el-button>
          </template>
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="'/contest/' + scope.row.id">
              <font-awesome-icon icon="fa-solid fa-list"></font-awesome-icon>&nbsp;&nbsp;{{ scope.row.problemAmount }} 题
            </router-link>
          </template>
        </el-table-column>
        <el-table-column min-width="8">
          <template #default="scope">
            <el-button class="edit-button" type="text" @click="editContest(scope.row.id)">
              <font-awesome-icon icon="fa-solid fa-pen-to-square"></font-awesome-icon>
              编辑
            </el-button>
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
  name: "UserContestListView",
  props: ["id"],
  data: function () {
    return {
      problemListLoading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      key: "",
      showPractice: false,
      showCompetition: false,
      orderByStartTimeAsc: null,
      statusColumnKey: "",
      contests: [],
      tipTexts: [],
      timer: null,
    }
  },
  methods: {
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
    updateStatus: function () {
      let current = new Date()
      for(let i = 0; i < this.contests.length; i++) {
        let startTime = new Date(this.contests[i].startTime)
        let endTime = new Date(this.contests[i].endTime)
        if (current < startTime) {
          this.contests[i].statusTagType = ""
          this.contests[i].statusTagText = "未开始"
          this.contests[i].statusTipText = "距离比赛开始还有：" + this.formatTimeInterval(startTime - current)
        } else if (current >= endTime) {
          this.contests[i].statusTagType = "info"
          this.contests[i].statusTagText = "已结束"
          this.contests[i].statusTipText = "比赛已结束"
        } else {
          this.contests[i].statusTagType = "success"
          this.contests[i].statusTagText = "进行中"
          this.contests[i].statusTipText  = "距离比赛结束还有：" + this.formatTimeInterval(endTime - current)
        }
      }
      this.statusColumnKey = Math.random().toString()
    },
    update: function () {
      this.problemListLoading = true;
      axios.get("/contests/users/" + this.id + "/amount", {
        params: {
          "key": this.key,
          "showPractice": this.showPractice,
          "showCompetition": this.showCompetition
        }
      }).then((response) => {
        this.total = response.data;
        this.pageIndex = Math.max(Math.min(this.pageIndex, Math.ceil(this.total / this.pageSize)), 1);
        axios.get("/contests/users/" + this.id, {
          params: {
            "key": this.key,
            "showPractice": this.showPractice,
            "showCompetition": this.showCompetition,
            "orderByStartTimeAsc": this.orderByStartTimeAsc,
            "pageIndex": this.pageIndex,
            "pageSize": this.pageSize
          }
        }).then((response) => {
          this.contests = response.data
          this.mergeHeader()
          this.updateStatus()
          clearInterval(this.timer)
          this.timer = setInterval(this.updateStatus, 500)
          this.problemListLoading = false
        }).catch((error) => {
          this.problemListLoading = false
          this.$message.error(error.response.data)
        })
      }).catch((error) => {
        this.problemListLoading = false
        this.$message.error(error.response.data)
      })
    },
    mergeHeader: function () {
      let cells = document.getElementsByClassName("el-table__header")[0].rows[0].cells;
      cells[7].colSpan = 2;
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
    sortChange: function (column) {
      if (column.order === null) {
        this.orderByStartTimeAsc = null
      } else {
        this.orderByStartTimeAsc = (column.order === "ascending")
      }
      this.update()
    },
    createContest: function () {
      this.$router.push("/contest/new")
    },
    editContest: function (contestId) {
      this.$router.push("/contest/" + contestId + "/edit")
    }
  },
  mounted: function () {
    this.update();
  },
  destroyed: function () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.active-filter {
  color: #409EFF;
}

</style>