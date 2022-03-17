<template>
  <div style="margin: 10px 35% auto">
    <el-card>
      <template #header>
        <span>注册</span>
      </template>
      <el-form :model="registerInfo" :rules="rules" status-icon hide-required-asterisk>
        <el-form-item label="用户名" prop="username">
          <el-input type="text" prefix-icon="el-icon-user" placeholder="6至16位，只含数字、字母或下划线"
                    v-model="registerInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" prefix-icon="el-icon-lock" placeholder="6至16位，可含数字、字母" show-password
                    v-model="registerInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="checkPassword">
          <el-input type="password" prefix-icon="el-icon-lock" placeholder="再次输入密码" show-password
                    v-model="registerInfo.checkPassword"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input type="email" prefix-icon="el-icon-message" placeholder="电子邮箱地址"
                    v-model="registerInfo.email"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="medium" style="width: 100%; margin: 15px 0">注册</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "RegisterView",
  data: function () {
    let validateCheckPassword = (rule, value, callback) => {
      if(value === "") {
        callback(new Error("重复密码不能为空"))
      } else if (value !== this.registerInfo.password) {
        callback(new Error("两次输入的密码不一致"))
      } else {
        callback()
      }
    }
    return {
      registerInfo: {
        username: "",
        password: "",
        checkPassword: "",
        email: "",
      },
      rules: {
        username: [
          {required: true, message: "用户名不能为空", trigger: "blur"},
          {min: 6, max: 16, message: "用户名长度必须在6到16位之间", trigger: "blur"},
          {pattern: /^\w+$/, message: "用户名只能含有数字、字母或下划线", trigger: "blur"},
        ],
        password: [
          {required: true, message: "密码不能为空", trigger: "blur"},
          {min: 6, max: 16, message: "密码长度必须在6到16位之间", trigger: "blur"},
          {pattern: /^[A-Za-z0-9]+$/, message: "密码只能含有数字或字母", trigger: "blur"},
        ],
        checkPassword:
          {validator: validateCheckPassword, trigger: "blur"},
        email: [
          {require: true, message: "邮箱不能为空", trigger: "blur"},
          {pattern: /^[\w-]+@[\w-]+(\.[\w-]+)+$/, message: "邮箱格式不正确"}
        ]
      }
    }
  }
}
</script>

<style scoped>

</style>