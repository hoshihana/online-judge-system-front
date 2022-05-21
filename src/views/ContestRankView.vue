<template>
  <div>
    <el-card body-style="padding-top: 2px">
      <el-table :data="rank.entries" border>
        <el-table-column label="#" prop="rank" fixed align="center"></el-table-column>
        <el-table-column label="参赛者" fixed align="center">
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="'/user/' + scope.row.userId" target="_blank">
              {{ scope.row.username }}
            </router-link><br>
            <span style="font-size: small; color: #909399">{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="通过" prop="totalAccept" fixed align="center"></el-table-column>
        <el-table-column label="罚时" align="center" fixed>
          <template #default="scope">
            <el-tooltip :content="formatTimeInterval(scope.row.totalTimeCost)" :disabled="scope.row.totalTimeCost === null">
              <span>{{scope.row.totalTimeCost === null ? "--" : Math.floor(scope.row.totalTimeCost / 60000)}}</span>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-for="headerUnit in rank.headerUnits" :key="headerUnit.problemNumber" align="center">
          <template #header>
            <b class="problem-number" @click="$router.push('/contest/' + id + '/problem/' + headerUnit.problemNumber)">
              <font-awesome-icon icon="fa-solid fa-caret-right" fixed-width></font-awesome-icon>{{ headerUnit.problemNumber}}&nbsp;
            </b><br>
            <el-tooltip>
              <template #content>
                <div style="margin-bottom: 5px">提交：{{headerUnit.triedParticipant}} 人</div>
                <div>通过：{{headerUnit.passedParticipant}} 人</div>
              </template>
              <span style="font-size: small">
                {{headerUnit.accept + "/" + headerUnit.submit}}
              </span>
            </el-tooltip>

          </template>
          <template #default>

          </template>
        </el-table-column>
      </el-table>
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
      rank: {
        contestId: null,
        problemAmount: null,
        participantAmount: null,
        headerUnits: null,
        entries: null,
      },
      total: 0,
      pageIndex: 1,
      pageSize: 10,
    }
  },
  methods: {
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
        result += minute +"分 "
      }
      if (second > 0) {
        result += second +"秒"
      }
      return result
    },
  },
  mounted: function () {
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
</style>