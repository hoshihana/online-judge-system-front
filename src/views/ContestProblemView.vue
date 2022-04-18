<template>
  <div>
    <el-card>
      题目{{id + "-" + problemId}}
    </el-card>
  </div>
</template>

<script>
export default {
  name: "ContestProblemView",
  props: ["id", "problemId"],
}
</script>

<style scoped>

</style>