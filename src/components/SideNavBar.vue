<template>
  <div :class="['menu-div', {'menu-div-collapse': isCollapse}]">
    <el-tooltip :disabled="!isCollapse" content="首页" placement="right">
      <div :class="['item-div', {'item-div-active': currentPath === '/'}]" @click="goto('/')">
        <font-awesome-icon icon="fa-solid fa-home" fixed-width></font-awesome-icon>
        <span v-if="!isCollapse"> 首页</span>
      </div>
    </el-tooltip>
    <el-tooltip :disabled="!isCollapse" content="题目" placement="right">
      <div :class="['item-div', {'item-div-active': currentPath === '/problem/list'}]" @click="goto('/problem/list')">
        <font-awesome-icon icon="fa-solid  fa-book" fixed-width></font-awesome-icon>
        <span v-if="!isCollapse"> 题目</span>
      </div>
    </el-tooltip>
    <el-tooltip :disabled="!isCollapse" content="比赛" placement="right">
      <div :class="['item-div', {'item-div-active': currentPath === '/contest/list'}]"
           @click="goto('/contest/list')">
        <font-awesome-icon icon="fa-solid  fa-clipboard-list" fixed-width></font-awesome-icon>
        <span v-if="!isCollapse"> 比赛</span>
      </div>
    </el-tooltip>
    <el-tooltip :disabled="!isCollapse" content="记录" placement="right">
      <div :class="['item-div', {'item-div-active': currentPath === '/record/list'}]" @click="goto('/record/list')">
        <font-awesome-icon icon="fa-solid  fa-bars-staggered" fixed-width></font-awesome-icon>
        <span v-if="!isCollapse"> 记录</span>
      </div>
    </el-tooltip>
    <el-tooltip :disabled="!isCollapse" content="关于" placement="right">
      <div :class="['item-div', {'item-div-active': currentPath === '/about'}]" @click="goto('/about')">
        <font-awesome-icon icon="fa-solid  fa-circle-question" fixed-width></font-awesome-icon>
        <span v-if="!isCollapse"> 关于</span>
      </div>
    </el-tooltip>
    <div class="button-div" style="margin-top: auto" @click="switchCollapse">
      <font-awesome-icon :icon="switchIcon"></font-awesome-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: "SideNavBar",
  data: function () {
    return {
      isCollapse: false,
      switchIcon: "fa-solid fa-angle-left"
    }
  },
  computed: {
    currentPath: function () {
      return this.$route.path
    }
  },
  methods: {
    goto: function (path) {
      if (path !== this.currentPath) {
        this.$router.push(path)
      }
    },
    switchCollapse: function () {
      if (this.isCollapse) {
        this.isCollapse = false
        this.switchIcon = "fa-solid fa-angle-left"
      } else {
        this.isCollapse = true
        this.switchIcon = "fa-solid fa-angle-right"
      }
    }
  },
}
</script>

<style scoped>

.menu-div {
  background-color: rgb(0, 21, 41);
  height: 100%;
  width: 150px;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  -moz-transition: width 0.3s; /* Firefox 4 */
  -webkit-transition: width 0.3s; /* Safari 和 Chrome */
  -o-transition: width 0.3s; /* Opera */
}

.menu-div-collapse {
  width: 60px;
}


.item-div {
  text-align: center;
  vertical-align: center;
  color: rgb(166, 173, 180);
  padding: 15px 0;
}

.item-div:hover {
  color: #ffffff;
  cursor: pointer;
}

.button-div {
  text-align: center;
  vertical-align: center;
  color: #ffffff;
  background-color: rgb(0, 33, 64);
  padding: 15px 0;
}

.button-div:hover {
  cursor: pointer;
}

.item-div-active {
      color: #ffffff;
      background-color: rgb(24, 144, 255);
    }


  </style>