<template>
  <div>
    <el-card>
      <template #header>
        <el-input placeholder="题号/题目名" v-model="key" clearable prefix-icon="el-icon-search"
                  style="width: 250px"></el-input>
      </template>
      <el-table :data="problemList" stripe style="width: 100%">
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
          :current-page.sync="currentPage"
          layout="prev, pager, next"
          style="margin-top: 20px; text-align: right">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ProblemsView",
  data: function () {
    return {
      key: "",
      problemTotal: 80,
      currentPage: 1,
      pageSize: 20,
      problemList: []
    }
  },
  beforeMount: function () {
    for (let i = 0; i < this.pageSize; i++) {
      this.problemList.push({
        id: i + 1001,
        name: "problemNo" + (i + 1),
        submit: 143,
        accept: 540
      })
    }
  }
}
</script>

<style scoped>

</style>