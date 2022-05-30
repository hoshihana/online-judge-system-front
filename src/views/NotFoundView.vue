<template>
  <div>
    <el-card :style="{'height': height}">
      <el-empty :image-size="300" :style="{'margin-top': marginTop}">
        <template #description>
            页面不存在，将在 {{countDown}} 秒后
            <router-link class="el-link el-link--primary" to="/" style="font-size: 16px; margin-bottom: 5px">返回首页</router-link>
        </template>
      </el-empty>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "NotFoundView",
  data: function () {
    return {
      height: "auto",
      marginTop: "auto",
      countDown: 10,
      timer: null
    }
  },
  mounted: function () {
    this.height = document.documentElement.clientHeight - 100 + "px"
    this.marginTop = document.documentElement.clientHeight * 0.1 + "px"
    this.$nextTick(() => {
      window.addEventListener('resize', () => {
        this.height = document.documentElement.clientHeight - 100 + "px"
        this.marginTop = document.documentElement.clientHeight * 0.1 + "px"
      });
    })
    this.timer = setInterval(() => {
      this.countDown = this.countDown - 1
      if(this.countDown === 0) {
        this.$router.push("/")
      }
    }, 1000)
  },
  destroyed: function () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>

</style>