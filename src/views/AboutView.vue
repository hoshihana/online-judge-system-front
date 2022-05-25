<template>
  <div>
    <el-card>
      <template #header>
        <div style="width: 100%; text-align: center">
          <b style="font-size: x-large">常见问题及解答</b>
        </div>
      </template>
      <div class="circle-div question-circle">
        <font-awesome-icon icon="fa-solid fa-q"></font-awesome-icon>
      </div>
      <div class="circle-div answer-circle">
        <font-awesome-icon icon="fa-solid fa-a"></font-awesome-icon>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AboutView"
}
</script>

<style scoped>
.circle-div {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  line-height: 30px;
  text-align: center;
  padding: 2px;
  margin: 8px;
}

.question-circle {
  background-color: rgb(251,226,201);
  color: rgb(254,174,97);
}

.answer-circle {
  background-color: rgb(220,240,198);
  color: rgb(98,188,0);
}

</style>