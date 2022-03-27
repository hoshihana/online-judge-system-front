<template>
  <div id="app">
    <el-container style="height: 100%;">
      <el-aside width="auto">
        <side-nav-bar></side-nav-bar>
      </el-aside>
      <el-container>
        <el-header height="50px">
          <top-bar></top-bar>
        </el-header>
        <el-main style="height: 100%; background-color: #EBEEF5">
          <router-view></router-view>
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

::-webkit-scrollbar {
  width: 8px;

}

::-webkit-scrollbar-thumb {
  background-color: #909399;
  border-radius: 3px;
}

.fa-icon {
  width: auto;
  height: 1em; /* 或任意其它字体大小相对值 */

  /* 要在 Safari 中正常工作，需要再引入如下两行代码 */
  max-width: 100%;
  max-height: 100%;
}

router-link {
  
}
</style>