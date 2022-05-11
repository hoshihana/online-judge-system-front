<template>
  <div style="margin: 10px auto auto; width: 450px">
    <el-card>
      <template #header>
        <div style="width: 100%; text-align: center">
          <h1 style="margin: 0;">登&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;录</h1>
        </div>
      </template>
      <el-form ref="loginForm" :model="loginInfo" :rules="rules" status-icon hide-required-asterisk>
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
      if (this.$root.loginStatus.login) {
        this.$message.error("已登录，如需切换账号请先登出")
        return
      }
      this.$refs.loginForm.validate().then(() => {
            axios.post("/accounts/login", this.loginInfo)
                .then((response) => {
                  this.$message.success("登录成功")
                  this.$root.loginStatus = response.data
                  this.$router.push("/")
                })
                .catch((error) => {
                  this.$message.error(error.response.data)
                })
          }
      )
    }
  }
}
</script>

<style scoped>

</style>