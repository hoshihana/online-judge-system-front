<template>
  <div style="height: 100%">
    <el-row type="flex" justify="end" align="middle" style="height: 100%">
        <el-button-group v-if="!loggedIn">
          <el-button type="primary" size="small" @click="$router.push('/login')">登录</el-button>
          <el-button size="small" @click="$router.push('/register')">注册</el-button>
        </el-button-group>
        <el-popover v-if="loggedIn" trigger="hover" placement="bottom">
          <template #reference>
            <el-button type="text" icon="el-icon-user">username</el-button>
          </template>
        </el-popover>
    </el-row>
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      loggedIn: false,
    }
  },
  name: "TopBar"
}
</script>

<style scoped>

</style>