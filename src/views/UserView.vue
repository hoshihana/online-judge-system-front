<template>
  <div>
    <el-container>
      <el-header height="210px">
        <el-card body-style="padding: 0">
          <el-row style="background-color: #909399; padding: 20px">
            <el-col :span="12" style="text-align: left">
              <el-avatar :size="100">
                <font-awesome-icon icon="fa-solid fa-user" size="2x"></font-awesome-icon>
              </el-avatar>
            </el-col>
            <el-col :span="12" style="text-align: right"></el-col>
          </el-row>
          <el-row style="padding: 0 10px">
            <el-menu :default-active="$route.fullPath" mode="horizontal" router>
              <el-menu-item :index="basePath">主页</el-menu-item>
              <el-menu-item v-if="parseInt(id) === $root.loginStatus.userid" :index="basePath + '/profile'">个人信息</el-menu-item>
              <el-menu-item v-if="parseInt(id) === $root.loginStatus.userid" :index="basePath + '/problem/list'">我的题库</el-menu-item>
            </el-menu>
          </el-row>
        </el-card>
      </el-header>
      <el-main>
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
    basePath: function () {
      return "/user/" + this.id;
    }
  }
}
</script>

<style scoped>

</style>