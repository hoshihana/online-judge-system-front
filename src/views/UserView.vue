<template>
  <div>
    <el-container>
      <el-header height="auto" style="padding-left: 0; padding-right: 0">
        <el-card body-style="padding: 0">
          <el-row style="padding: 20px" class="user-card">
            <el-col :span="12" style="text-align: left">
              <el-avatar :size="100">
                <font-awesome-icon icon="fa-solid fa-user" size="2x"></font-awesome-icon>
              </el-avatar>
            </el-col>
            <el-col :span="12" style="text-align: right"></el-col>
          </el-row>
          <el-row style="padding: 0 10px">
            <el-menu :default-active="$route.fullPath" mode="horizontal" router active-text-color="#409EFF" text-color="#606266">
              <el-menu-item :index="basePath">主页</el-menu-item>
              <el-menu-item v-if="isSelf" :index="basePath + '/profile'">个人信息</el-menu-item>
              <el-menu-item v-if="isSelf && isAdmin" :index="basePath + '/problem/list'">我的题目</el-menu-item>
              <el-menu-item v-if="isSelf && isAdmin" :index="basePath + '/contest/list'">我的比赛</el-menu-item>
            </el-menu>
          </el-row>
        </el-card>
      </el-header>
      <el-main style="padding-left: 0; padding-right: 0">
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "UserView",
  props: ["id"],
  computed: {
    isSelf: function () {
      return parseInt(this.id) === this.$root.loginStatus.userid
    },
    isAdmin: function () {
      return "ADMIN" === this.$root.loginStatus.role
    },
    basePath: function () {
      return "/user/" + this.id;
    }
  }
}
</script>

<style scoped>
.user-card {
  background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);
}

::v-deep .el-menu-item:hover{
  outline: 0 !important;
  color: #409EFF !important;
}
</style>