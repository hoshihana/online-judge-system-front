<template>
  <div>
    <el-card body-style="padding-top: 2px">
      <el-row align="middle" type="flex" style="margin: 15px">
        <el-col :span="12" style="text-align: left; color: #909399; font-size: small">
          <div style="display: inline-block" v-if="user.isParticipant">
            我的名次：<b style="font-size: medium">{{entry.rank}}</b>
          </div>
          <div style="display: inline-block; margin-left: 20px" v-if="user.isParticipant">
            参赛昵称：<b style="font-size: medium">{{entry.nickname}}</b>&nbsp;
            <el-button type="text" style="padding: 0; min-height: 0" @click="showEditNicknameDialog = true" :disabled="nicknameLoading">
              <font-awesome-icon icon="fa-solid fa-pen-to-square"></font-awesome-icon>
            </el-button>
            <el-dialog :visible.sync="showEditNicknameDialog" width="500px" style="font-size: medium; color: black" :destroy-on-close="true"
                       @open="newNickname = entry.nickname">
              <template #title>
                <font-awesome-icon icon="fa-solid fa-pen" fixed-width></font-awesome-icon>
                编辑参赛昵称
              </template>
              <div style="margin: 0 15px;">
                <div style="font-size: small; color: #909399; margin-bottom: 10px">请输入参赛昵称</div>
                <el-input v-model="newNickname" placeholder="参赛昵称" :clearable="true" maxlength="30" show-word-limit></el-input>
              </div>
              <template #footer>
                <div>
                  <el-button size="medium" plain @click="showEditNicknameDialog = false">取消</el-button>
                  <el-button type="primary" size="medium" plain @click="editNickname">确定</el-button>
                </div>
              </template>
            </el-dialog>
          </div>
        </el-col>
        <el-col :span="12" style="text-align: right; color: #909399; font-size: small">
          <div class="unit-sample" style="background-color: rgb(139, 232, 91)"></div>
          首个通过
          <div class="unit-sample" style="background-color: rgb(225,243,216)"></div>
          提交并通过
          <div class="unit-sample" style="background-color: rgb(253,226,226)"></div>
          提交但未通过
          <div class="unit-sample"></div>
          未提交
          <el-button type="text" @click="update" style="margin-left: 20px; min-height: 0; padding: 0" :disabled="loading">
            <font-awesome-icon icon="fa-solid fa-arrows-rotate" fixed-width></font-awesome-icon> 刷新
          </el-button>
        </el-col>
      </el-row>
      <el-table v-loading="loading" :data="rank.entries" border :cell-style="getCellColorStyle">
        <el-table-column label="#" prop="rank" fixed align="center"></el-table-column>
        <el-table-column label="参赛者" fixed align="center">
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="'/user/' + scope.row.userId" target="_blank">
              {{ scope.row.username }}
            </router-link>
            <br>
            <span style="font-size: small; color: #909399">{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="通过" prop="totalAccept" fixed align="center"></el-table-column>
        <el-table-column label="罚时" align="center" fixed>
          <template #default="scope">
            <el-tooltip :content="formatTimeInterval(scope.row.totalTimeCost)"
                        :disabled="scope.row.totalTimeCost === null">
              <span>{{ scope.row.totalTimeCost === null ? "--" : Math.floor(scope.row.totalTimeCost / 60000) }}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-for="headerUnit in rank.headerUnits" :key="headerUnit.problemNumber" align="center">
          <template #header>
            <b class="problem-number" @click="$router.push('/contest/' + id + '/problem/' + headerUnit.problemNumber)">
              <font-awesome-icon icon="fa-solid fa-caret-right" fixed-width></font-awesome-icon>
              {{ headerUnit.problemNumber }}&nbsp;
            </b><br>
            <el-tooltip>
              <template #content>
                <div style="margin-bottom: 5px">提交：{{ headerUnit.triedParticipant }} 人</div>
                <div>通过：{{ headerUnit.passedParticipant }} 人</div>
              </template>
              <span style="font-size: small">
                {{ headerUnit.accept + "/" + headerUnit.submit }}
              </span>
            </el-tooltip>
          </template>
          <template #default="scope">
            <div v-if="scope.row.units[headerUnit.problemNumber - 1].timeCost !== null">
              <el-tooltip :content="formatTimeInterval(scope.row.units[headerUnit.problemNumber - 1].timeCost)">
                <span>{{ Math.floor(scope.row.units[headerUnit.problemNumber - 1].timeCost / 60000) }}</span>
              </el-tooltip>
            </div>
            <div v-if="scope.row.units[headerUnit.problemNumber - 1].attempt > 0">
              {{ "(-" + scope.row.units[headerUnit.problemNumber - 1].attempt + ")" }}
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
  name: "ContestRankView",
  props: ["id"],
  inject: ["user"],
  data: function () {
    return {
      loading: false,
      nicknameLoading: false,
      showEditNicknameDialog: false,
      rank: {
        contestId: null,
        problemAmount: null,
        participantAmount: null,
        headerUnits: null,
        entries: null,
      },
      entry: null,
      newNickname: "",
      total: 0,
      pageIndex: 1,
      pageSize: 50,
    }
  },
  methods: {
    update: function () {
      this.loading = true
      axios.get("/contests/" + this.id + "/rank", {
        params: {
          "pageIndex": this.pageIndex,
          "pageSize": this.pageSize
        }
      }).then((response) => {
        this.rank = response.data
        this.loading = false
      }).catch((error) => {
        this.$message.error(error.response.data)
        this.loading = false
      })
    },
    formatTimeInterval: function (interval) {
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
      if (hour > 0) {
        result += hour + "时 "
      }
      if (minute > 0) {
        result += minute + "分 "
      }
      if (second > 0) {
        result += second + "秒"
      }
      return result
    },
    getCellColorStyle: function ({row, columnIndex}) {
      if (columnIndex < 4) {
        return ""
      }
      let unit = row.units[columnIndex - 4]
      let headerUnit = this.rank.headerUnits[columnIndex - 4]
      if (unit.timeCost !== null) {
        if (row.userId === headerUnit.first) {
          return "background-color: rgb(139, 232, 91)"
        } else {
          return "background-color: rgb(225,243,216)"
        }
      } else {
        if (unit.attempt > 0) {
          return "background-color: rgb(253,226,226)"
        } else {
          return ""
        }
      }
    },
    editNickname: function () {
      this.showEditNicknameDialog = false
      this.nicknameLoading = true
      axios.patch("/contests/" + this.id + "/nickname", {
        "nickname": this.newNickname
      }).then(() => {
        this.$message.success("参赛昵称修改成功");
        this.nicknameLoading = false
        this.entry.nickname = this.newNickname
        this.update()
      }).catch((error) => {
        this.$message.error(error.response.data)
        this.nicknameLoading = false
      })
    }
  },
  mounted: function () {
    this.loading = true
    axios.get("/contests/" + this.id + "/rank", {
      params: {
        "pageIndex": this.pageIndex,
        "pageSize": this.pageSize
      }
    }).then((response) => {
      this.rank = response.data
      this.total = this.rank.participantAmount
      this.loading = false
    }).catch((error) => {
      this.$message.error(error.response.data)
      this.loading = false
    })
    axios.get("/contests/" + this.id + "/rank/entry").then((response) => {
        this.entry = response.data
    }).catch((error) => {
      this.$message.error(error.response.data)
    })
  }
}
</script>

<style scoped>
.problem-number {
  cursor: pointer;
}

.problem-number:hover {
  color: #409EFF
}

.unit-sample {
  display: inline-block;
  width: 15px;
  height: 15px;
  margin-left: 15px;
  vertical-align: middle;
  border: rgb(235, 238, 245) solid 1px;
}
</style>