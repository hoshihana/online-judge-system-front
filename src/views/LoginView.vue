<template>
  <div style="margin: 10px auto auto; width: 450px">
    <el-card>
      <template #header>
        <span>登录</span>
      </template>
      <el-form :model="loginInfo" :rules="rules" status-icon hide-required-asterisk>
        <el-form-item label="用户名" prop="username">
          <el-input type="text" prefix-icon="el-icon-user" placeholder="请输入用户名" v-model="loginInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" placeholder="请输入密码"
                    v-model="loginInfo.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" style="width: 100%; margin: 15px 0" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "LoginView",
  data: function () {
    return {
      loginInfo: {
        username: "",
        password: ""
      },
      rules: {
        username: {required: true, message: "用户名不能为空", trigger: "blur"},
        password: {required: true, message: "密码不能为空", trigger: "blur"}
      }
    }
  },
  methods: {
    login: function () {
      if (this.$root.isLogin) {
        this.$message.error("已登录，如需更换账号请先登出")
      } else {
        axios.post("/account/login", this.$data.loginInfo)
            .then((response) => {
              this.$message({
                message: response.data,
                type: "success"
              })
              this.$root.isLogin = true
              this.$router.push("/")
            })
            .catch((error) => {
              this.$message.error(error.response.data)
            })
      }
    }
  }
}
</script>

<style scoped>

</style>