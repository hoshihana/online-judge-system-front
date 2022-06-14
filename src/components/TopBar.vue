<template>
  <div style="height: 100%">
    <el-row type="flex" align="middle" style="height: 100%; padding: 0 20px 0 10px; box-shadow: 0 2px 10px 0 rgb(164,164,164, 0.3);">
      <el-col :span="12" style="text-align: left">
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button-group v-if="unlogin" style="font-size: small">
          <el-button type="primary" size="mini" @click="$router.push('/login')">登录</el-button>
          <el-button size="mini" @click="$router.push('/register')">注册</el-button>
        </el-button-group>
        <el-dropdown v-else @command="handleCommand">
          <el-button type="text"><font-awesome-icon icon="fa-solid fa-user"></font-awesome-icon> {{ username }}</el-button>
          <template #dropdown>
            <el-dropdown-menu style="text-align: center">
              <el-dropdown-item command="home"><font-awesome-icon icon="fa-solid  fa-home-user"></font-awesome-icon> 我的主页</el-dropdown-item>
              <el-dropdown-item v-if="isAdmin" command="problem list"><font-awesome-icon icon="fa-solid  fa-book"></font-awesome-icon> 我的题目</el-dropdown-item>
              <el-dropdown-item v-if="isAdmin" command="contest list"><font-awesome-icon icon="fa-solid  fa-clipboard-list"></font-awesome-icon> 我的比赛</el-dropdown-item>
              <el-dropdown-item command="password"><font-awesome-icon icon="fa-solid  fa-key"></font-awesome-icon> 修改密码</el-dropdown-item>
              <el-dropdown-item command="logout"><font-awesome-icon icon="fa-solid  fa-arrow-right-from-bracket"></font-awesome-icon> 登出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "TopBar",
  computed: {
    unlogin: function () {
      return !this.$root.loginStatus.login
    },
    username: function () {
      return this.$root.loginStatus.username
    },
    isAdmin: function () {
      return "ADMIN" === this.$root.loginStatus.role
    },
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
        case "password":
          this.$router.push("/user/" + this.$root.loginStatus.userid + "/password");
          break;
        case "problem list":
          this.$router.push("/user/" + this.$root.loginStatus.userid + "/problem/list");
          break;
        case "contest list":
          this.$router.push("/user/" + this.$root.loginStatus.userid + "/contest/list");
          break;
      }
    }
  }
}
</script>

<style scoped>

</style>