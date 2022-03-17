<template>
  <div id="app">
    <el-container style="height: 100%;">
      <el-aside>
        <side-nav-bar></side-nav-bar>
      </el-aside>
      <el-container>
        <el-header>
          <top-bar></top-bar>
        </el-header>
        <el-main style="height: 100%; background-color: #EBEEF5">
          <keep-alive>
            <router-view></router-view>
          </keep-alive>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import SideNavBar from "@/components/SideNavBar";
import TopBar from "@/components/TopBar";

export default {
  name: 'App',
  components: {
    SideNavBar,
    TopBar,
  }
}
</script>

<style>
html, body, #app {
  margin: 0;
  height: 100%;
}
</style>