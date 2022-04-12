<template>
  <div>
    <el-card body-style="padding-top: 5px">
      <el-table :data="problemEntries" stripe style="width: 100%">
        <el-table-column label="#" min-width="1" align="center">
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="'/problem/' + scope.row.id">{{
                scope.row.id
              }}
            </router-link>
          </template>
        </el-table-column>
        <el-table-column min-width="4">
          <template #header>
            题目名
            <el-input placeholder="题号/题目名" v-model="key" clearable size="medium" style="margin-left: 5%; width: 50%"
                      maxlength="40">
            </el-input>
            <el-button type="primary" plain size="medium" @click="update" style="margin-left: 2%" :disabled="loading">
              <font-awesome-icon icon="fa-solid fa-magnifying-glass" fixed-width></font-awesome-icon>
              搜索
            </el-button>
          </template>
          <template #default="scope">
            <router-link class="el-link el-link--primary" :to="'/problem/' + scope.row.id">{{
                scope.row.name
              }}
            </router-link>
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
        <el-table-column min-width="1" align="center">
          <template #header>
            <el-dropdown trigger="click" :hide-on-click="false" placement="bottom" style="cursor: pointer">
              <span :class="{'active-filter': showPrivate || showHidden || showPublic}">状态<i
                  class="el-icon-arrow-down el-icon--right"></i></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-checkbox v-model="showPrivate" style="margin: 0 10px" @change="update">私密题目</el-checkbox>
                  <br>
                  <el-checkbox v-model="showHidden" style="margin: 10px 10px 0" @change="update">比赛题目</el-checkbox>
                  <br>
                  <el-checkbox v-model="showPublic" style="margin: 10px 10px 0" @change="update">公开题目</el-checkbox>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template #default="scope">
            <el-tag :type="getTagType(scope.row.visibility)" size="medium">{{ getTagText(scope.row.visibility) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column min-width="1" align="center">
          <template #header>
            <el-button type="primary" size="medium" plain @click="newProblem">
              <font-awesome-icon icon="fa-solid fa-plus"></font-awesome-icon>
              创建题目
            </el-button>
          </template>
          <template #default="scope">
            <el-button class="edit-button" type="text" title="编辑" @click="editProblem(scope.row.id)">
              <el-badge is-dot :hidden="scope.row.testSet">
                <font-awesome-icon icon="fa-solid fa-pen-to-square"></font-awesome-icon>
                编辑
              </el-badge>
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

export default {
  name: "UserProblemListView",
  props: ["id"],
  data: function () {
    return {
      loading: false,
      total: 0,
      pageIndex: 1,
      pageSize: 10,
      key: "",
      showPrivate: false,
      showHidden: false,
      showPublic: false,
      problemEntries: []
    }
  },
  beforeRouteEnter: function (to, from, next) { // todo 路由权限控制交由router.index.js进行
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
      axios.get("/problemEntries/user/" + this.id + "/amount", {
        params: {
          "key": this.key,
          "showPrivate": this.showPrivate,
          "showHidden": this.showHidden,
          "showPublic": this.showPublic
        }
      }).then((response) => {
        this.total = response.data;
        this.pageIndex = Math.max(Math.min(this.pageIndex, Math.ceil(this.total / this.pageSize)), 1);
        axios.get("/problemEntries/user/" + this.id, {
          params: {
            "key": this.key,
            "showPrivate": this.showPrivate,
            "showHidden": this.showHidden,
            "showPublic": this.showPublic,
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
    getTagText: function (visibility) {
      switch (visibility) {
        case "PRIVATE":
          return "私密题目"
        case "HIDDEN":
          return "比赛题目"
        case "PUBLIC":
          return "公开题目"
      }
    },
    getTagType: function (visibility) {
      switch (visibility) {
        case "PRIVATE":
          return "danger"
        case "HIDDEN":
          return "warning"
        case "PUBLIC":
          return "success"
      }
    },
    editProblem: function (id) {
      this.$router.push("/problem/" + id + "/edit")
    },
    newProblem: function () {
      this.$router.push("/problem/new")
    },
  },
  mounted() {
    this.update();
  }
}
</script>

<style scoped>
.edit-button {
  padding: 0;
  min-height: 0;
}

.active-filter {
  color: #409EFF;
}
</style>