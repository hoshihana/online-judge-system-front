<template>
  <div>
    <el-card body-style="padding-top: 2px">
      <template #header>
        <el-input placeholder="题号/题目名" v-model="key" clearable style="width: 250px" @input="search" maxlength="40">
          <template #prefix>
            &nbsp;<font-awesome-icon icon="fa-solid fa-magnifying-glass"></font-awesome-icon>
          </template>
        </el-input>
      </template>
      <el-table v-loading="loading" :data="problemEntries" stripe style="width: 100%">
        <el-table-column label="#" min-width="1" align="center">
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="'/problem/' + scope.row.id">{{ scope.row.id }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="题目名" min-width="10">
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="'/problem/' + scope.row.id">{{ scope.row.name }}</router-link>
          </template>
        </el-table-column>
        <el-table-column label="通过率" min-width="2" align="right">
          <template #default="scope">
            <el-tooltip effect="dark" placement="left">
              <el-tag size="small">
                {{ getPercent(scope.row.accept, scope.row.submit) }}
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

// todo 页面太宽，也许侧边可以加些其他元素，或添加算法标签
// todo 将搜索框改成点击搜索触发更新

export default {
  name: "ProblemsView",
  data: function () {
    return {
      loading: false,
      key: "",
      total: 0,
      pageIndex: 1,
      pageSize: 20,
      problemEntries: []
    }
  },
  methods: {
    update: function () {
      this.loading = true
      axios.get("/problemEntries/public/amount", {
        params: {
          "key": this.key,
        }
      }).then((response) => {
        this.total = response.data;
        this.pageIndex = Math.max(Math.min(this.pageIndex, Math.ceil(this.total / this.pageSize)), 1);
        axios.get("/problemEntries/public", {
          params: {
            "key": this.key,
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
      }).catch((error) => {
        this.loading = false
        this.$message.error(error.response.data)
      })
    },
    search: function () {
      this.update()
    },
    getPercent: function (up, down) {
      if(down === 0) {
        return "0%"
      }
      if(up * 100 % down === 0) {
        return up * 100 / down + "%"
      } else {
        return (up * 100 / down).toFixed(1) + "%"
      }
    }
  },
  mounted() {
    this.update();
  }
}
</script>

<style scoped>

</style>