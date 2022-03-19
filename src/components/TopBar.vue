<template>
  <div style="height: 100%">
    <el-row type="flex" justify="end" align="middle" style="height: 100%">
      <el-button-group v-if="notLogin">
        <el-button type="primary" size="small" @click="$router.push('/login')">登录</el-button>
        <el-button size="small" @click="$router.push('/register')">注册</el-button>
      </el-button-group>
      <el-popover v-else trigger="hover" placement="bottom">
        <template #reference>
          <el-button type="text" icon="el-icon-user">username</el-button>
        </template>
        <el-button type="text" @click="logout">登出</el-button>
      </el-popover>
    </el-row>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "TopBar",
  computed: {
    notLogin: function () {
      return !this.$root.isLogin
    }
  },
  methods: {
    logout: function () {
      axios.post("/account/logout")
          .then((response) => {
            this.$message({
              message: response.data,
              type: "success"
            })
            this.$root.isLogin = false
            this.$router.push("/")
          })
          .catch((error) => {
            this.$message.error(error.response.data)
          })
    }
  }
}
</script>

<style scoped>

</style>