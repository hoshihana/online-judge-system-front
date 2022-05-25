<template>
  <div>
    <el-card v-loading="loading">
      <el-row>
        <el-col :span="12">
          <b>原密码</b><br>
          <el-input class="password-input" type="password" placeholder="原密码" show-password
                    v-model="password"></el-input>
          <br>
        </el-col>
        <el-col :span="12">
          <b>新密码</b><br>
          <el-input class="password-input" type="password" placeholder="6至16位，可含数字、字母" show-password
                    v-model="newPassword"></el-input>
          <br>
          <b>重复新密码</b><br>
          <el-input class="password-input" type="password" placeholder="再次输入新密码" show-password
                    v-model="checkNewPassword"></el-input>
          <br></el-col>
      </el-row>
      <div style="text-align: right">
        <el-button type="primary" size="medium" plain style="margin-right: 20px" @click="updatePassword">
          <font-awesome-icon icon="fa-solid fa-floppy-disk" fixed-width></font-awesome-icon>
          修改密码
        </el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "UserPasswordView",
  props: ["id"],
  data: function () {
    return {
      loading: false,
      password: "",
      newPassword: "",
      checkNewPassword: "",
    }
  },
  methods: {
    updatePassword: function () {
      if (this.password === "") {
        this.$message.error("原密码不能为空");
      } else if (this.newPassword === "") {
        this.$message.error("新密码不能为空");
      } else if (this.newPassword.length < 6 || this.newPassword.length > 16) {
        this.$message.error("新密码长度必须在6到16位之间");
      } else if (!/^[A-Za-z0-9]+$/.test(this.newPassword)) {
        this.$message.error("新密码只能含有数字或字母")
      } else if (this.checkNewPassword === "") {
        this.$message.error("重复新密码不能为空");
      } else if (this.newPassword !== this.checkNewPassword) {
        this.$message.error("两次输入的新密码不一致")
      } else {
        this.$confirm('修改密码后只能用新密码登录，是否要确认修改？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loading = true
          axios.patch("/accounts/password", {
            "password": this.password,
            "newPassword": this.newPassword
          }).then(() => {
            this.$message.success("密码修改成功")
            this.password = this.newPassword = this.checkNewPassword = ""
            this.loading = false
          }).catch((error) => {
            this.$message.error(error.response.data)
            this.loading = false
          })
        })
      }
    }
  }
}
</script>

<style scoped>
.password-input {
  width: 60%;
  margin: 10px 10px 20px;
}
</style>