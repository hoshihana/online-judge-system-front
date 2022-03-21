<template>
  <div>
    <el-card v-loading="loading">
      <template #header>
        <el-input placeholder="题号/题目名" v-model="key" clearable prefix-icon="el-icon-search"
                  style="width: 250px" @input="update"></el-input>
      </template>
      <el-table :data="problemBriefs" stripe style="width: 100%">
        <el-table-column label="题号" min-width="5">
          <template #default="scope">
            <el-link>{{ scope.row.id }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="题目名" min-width="40">
          <template #default="scope">
            <el-link>{{ scope.row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="通过率" min-width="10" align="right">
          <template #default="scope">
            <el-tooltip effect="dark" placement="top">
              <el-tag size="small">{{ (scope.row.submit / scope.row.accept * 100).toFixed(1) + "%" }}
              </el-tag>
              <template #content>
                提交：{{ scope.row.submit }}<br/>
                通过：{{ scope.row.accept }}
              </template>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
          :total="problemTotal"
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
  name: "ProblemsView",
  data: function () {
    return {
      loading: false,
      key: "",
      problemTotal: 80,
      pageIndex: 1,
      pageSize: 20,
      problemBriefs: []
    }
  },
  methods: {
    // todo problemTotal动态获取，通过率NaN，设置未登录用户只能访问首页，否则跳转
    update: function () {
      this.loading = true;
      axios.get("/problem/list", {
        params: {
          "key": this.key,
          "pageIndex": this.pageIndex,
          "pageSize": this.pageSize,
        }
      }).then((response) => {
        this.problemBriefs = response.data;
        this.loading = false;
      }).catch((error) => {
        this.loading = false;
        this.$message.error(error.response.data)
      })
    },
    input: function () {
      this.pageIndex = 0;
      this.pageSize = 0;
      this.update();
    },
  },
  mounted() {
    this.update();
  }
}
</script>

<style scoped>

</style>