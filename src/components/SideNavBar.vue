<template>
  <div style="height: 100%">
    <el-menu router style="height: 100%" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/problem/list">题目</el-menu-item>
      <el-menu-item index="/problemSet/list">题集</el-menu-item>
      <el-menu-item index="/status/list">状态</el-menu-item>
      <el-menu-item index="/about">关于</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: "SideNavBar"
}
</script>
