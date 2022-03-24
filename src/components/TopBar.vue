<template>
  <div style="height: 100%">
    <el-row type="flex" justify="end" align="middle" style="height: 100%">
      <el-button-group v-if="unlogin" style="font-size: small">
        <el-button type="primary" size="mini" @click="$router.push('/login')">登录</el-button>
        <el-button size="mini" @click="$router.push('/register')">注册</el-button>
      </el-button-group>
      <el-dropdown v-else @command="handleCommand">
        <el-button type="text"><font-awesome-icon icon="fa-solid fa-user"></font-awesome-icon> {{ username }}</el-button>
        <template #dropdown>
          <el-dropdown-menu style="text-align: center">
            <el-dropdown-item command="home"><font-awesome-icon icon="fa-solid  fa-home-user"></font-awesome-icon> 我的主页</el-dropdown-item>
            <el-dropdown-item command="profile"><font-awesome-icon icon="fa-solid  fa-address-card"></font-awesome-icon> 个人信息</el-dropdown-item>
            <el-dropdown-item command="problem list"><font-awesome-icon icon="fa-solid  fa-bars-staggered"></font-awesome-icon> 我的题库</el-dropdown-item>
            <el-dropdown-item command="logout"><font-awesome-icon icon="fa-solid  fa-arrow-right-from-bracket"></font-awesome-icon> 登出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </el-row>
  </div>
</template>

<script>
import axios from "@/utils/axios";

//todo 导航栏可折叠

export default {
  name: "TopBar",
  computed: {
    unlogin: function () {
      return !this.$root.loginStatus.login
    },
    username: function () {
      return this.$root.loginStatus.username
    }
  },
  methods: {
    logout: function () {
      axios.post("/accounts/logout")
          .then((response) => {
            this.$message({
              message: response.data,
              type: "success"
            })
            this.$root.loginStatus.login = false
            this.$root.loginStatus.userid = null
            this.$root.loginStatus.username = null
            this.$router.push("/")
          })
          .catch((error) => {
            this.$message.error(error.response.data)
          })
    },
    handleCommand: function (command) {
      switch (command) {
        case "logout":
          this.logout();
          break;
        case "home":
          this.$router.push("/user/" + this.$root.loginStatus.userid);
          break;
        case "profile":
          this.$router.push("/user/" + this.$root.loginStatus.userid + "/profile");
          break;
        case "problem list":
          this.$router.push("/user/" + this.$root.loginStatus.userid + "/problem/list");
          break;
      }
    }
  }
}
</script>

<style scoped>

</style>