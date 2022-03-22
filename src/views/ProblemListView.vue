<template>
  <div>
    <el-card v-loading="loading">
      <template #header>
        <el-input :placeholder="placeholder" v-model="key" clearable prefix-icon="el-icon-search"
                  style="width: 250px" @input="update" maxlength="40"></el-input>
        <el-switch v-model="byId" active-text="按题号查询" style="margin-left: 10px" @change="update"></el-switch>
      </template>
      <el-table :data="problemBriefs" stripe style="width: 100%">
        <el-table-column label="题号" min-width="5">
          <template #default="scope">
            <el-link :href="'/problem/' + scope.row.id">{{ scope.row.id }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="题目名" min-width="40">
          <template #default="scope">
            <el-link :href="'/problem/' + scope.row.id">{{ scope.row.name }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="通过率" min-width="10" align="right">
          <template #default="scope">
            <el-tooltip effect="dark" placement="left">
              <el-tag size="small">
                {{ scope.row.submit === 0 ? "0%" : (scope.row.submit / scope.row.accept * 100).toFixed(1) + "%" }}
              </el-tag>
              <template #content>
                总提交：{{ scope.row.submit }}<br/>
                总通过：{{ scope.row.accept }}
              </template>
            </el-tooltip>
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
  name: "ProblemsView",
  data: function () {
    return {
      loading: false,
      key: "",
      byId: false,
      total: 0,
      pageIndex: 1,
      pageSize: 20,
      problemBriefs: []
    }
  },
  computed: {
    placeholder: function () {
      return this.byId ? "请输入题号" : "请输入题目名";
    }
  },
  methods: {
    update: function () {
      this.loading = true;
      axios.get("/problem/amount", {
        params: {
          "key": this.key,
          "byId": this.byId
        }
      }).then((response) => {
        this.total = response.data;
        axios.get("/problem", {
          params: {
            "key": this.key,
            "byId": this.byId,
            "pageIndex": this.pageIndex,
            "pageSize": this.pageSize
          }
        }).then((response) => {
          this.problemBriefs = response.data
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
    input: function () {
      this.total = 0;
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