<template>
  <div>
    <el-card body-style="padding-top: 2px">
      <el-table :data="problemEntries" stripe style="width: 100%">
        <el-table-column label="题号" min-width="1">
          <template #default="scope">
            <el-link :href="'/problem/' + scope.row.id">{{ scope.row.id }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="题目名" min-width="8">
          <template #default="scope">
            <el-link :href="'/problem/' + scope.row.id">{{ scope.row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="总通过" min-width="1" align="center">
          <template #default="scope">
            {{ scope.row.accept }}
          </template>
        </el-table-column>
        <el-table-column label="总提交" min-width="1" align="center">
          <template #default="scope">
            {{ scope.row.submit }}
          </template>
        </el-table-column>
        <el-table-column min-width="2" align="center">
          <template #header>
            <el-button  type="primary" size="medium" plain @click="newProblem">
              <font-awesome-icon icon="fa-solid fa-plus"></font-awesome-icon> 创建题目
            </el-button>
          </template>
          <template #default="scope">
            <el-button style="padding: 0; min-height: 0" type="text" title="编辑" @click="editProblem(scope.row.id)">
              <font-awesome-icon icon="fa-solid fa-pen-to-square"></font-awesome-icon> 编辑
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
import router from "@/router";

//todo 增加筛选和排序功能

export default {
  name: "UserProblemListView",
  props: ["id"],
  data: function () {
    return {
      loading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 20,
      problemEntries: []
    }
  },
  beforeRouteEnter: function (to, from, next) {
    if (parseInt(to.params.id) === router.app.$root.loginStatus.userid) {
      next()
    } else {
      router.app.$message.error("无权访问该页面")
      next(false)
    }
  },
  methods: {
    update: function () {
      this.loading = true;
      axios.get("/problemEntries/user/" + this.id + "/amount")
          .then((response) => {
            this.total = response.data;
            axios.get("/problemEntries/user/" + this.id, {
              params: {
                "pageIndex": this.pageIndex,
                "pageSize": this.pageSize
              }
            }).then((response) => {
              this.problemEntries = response.data
              this.loading = false
            }).catch((error) => {
              this.loading = false
              this.$message.error(error.response.data)
            })
          })
          .catch((error) => {
            this.loading = false
            this.$message.error(error.response.data)
          })
    },
    editProblem: function (id) {
      this.$router.push("/problem/" + id + "/edit")
    },
    newProblem: function () {
      this.$router.push("/problem/new")
    }
  },
  mounted() {
    this.update();
  }
}
</script>

<style scoped>

</style>