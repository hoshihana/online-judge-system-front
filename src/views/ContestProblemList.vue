<template>
  <div>
    <el-card>
      <el-table v-loading="loading" :data="problemEntries" stripe style="width: 100%">
        <el-table-column min-width="1" align="center" :key="Math.random().toString()">
          <template #default="scope">
            <el-tooltip v-if="user.isParticipant && scope.row.selfSubmit > 0" placement="left">
              <template #content>
                提交：{{scope.row.selfSubmit}}<br>
                通过：{{scope.row.selfAccept}}
              </template>
                <font-awesome-icon v-if="scope.row.selfAccept > 0" icon="fa-solid fa-check" color="#67C23A" size="lg"></font-awesome-icon>
                <font-awesome-icon v-else icon="fa-solid fa-xmark" color="#F56C6C" size="lg"></font-awesome-icon>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="#" min-width="1">
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="basePath + '/problem/' + (scope.$index + 1)">
              {{ scope.$index + 1 }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="题目名" min-width="10">
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="basePath + '/problem/' + (scope.$index + 1)">
              {{ scope.row.name }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column label="总提交" min-width="2" align="center">
          <template #default="scope">
            {{ scope.row.submit }}
          </template>
        </el-table-column>
        <el-table-column label="总通过" min-width="2" align="center">
          <template #default="scope">
            {{ scope.row.submit }}
          </template>
        </el-table-column>
        <el-table-column label="通过率" min-width="2" align="center">
          <template #default="scope">
            <el-tag size="small">
              {{ getPercent(scope.row.accept, scope.row.submit) }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "ContestProblemList",
  props: ["id"],
  inject: ["user"],
  data: function () {
    return {
      loading: false,
      problemEntries: null,

    }
  },
  computed: {
    basePath: function () {
      return "/contest/" + this.id;
    }
  },
  methods: {
    getPercent: function (up, down) {
      if (down === 0) {
        return "0%"
      }
      if (up * 100 % down === 0) {
        return up * 100 / down + "%"
      } else {
        return (up * 100 / down).toFixed(1) + "%"
      }
    }
  },
  mounted: function () {
    this.loading = true
    axios.get("/contests/" + this.id + "/problemEntries")
        .then((response) => {
          this.problemEntries = response.data
          axios.get("/contests/" + this.id + "/problems/users/" + this.$root.loginStatus.userid)
              .then((response) => {
                if (response.data.length > 0) {
                  for (let i = 0; i < this.problemEntries.length; i++) {
                    this.problemEntries[i].selfSubmit = response.data[i].submit
                    this.problemEntries[i].selfAccept = response.data[i].accept
                  }
                }
                this.loading = false
              }).catch((error) => {
            this.$message.error(error.response.data)
            this.loading = false
          })
        }).catch((error) => {
      this.$message.error(error.response.data)
      this.loading = false
    })
  }
}
</script>

<style scoped>

</style>