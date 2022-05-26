<template>
  <table>
    <tr>
      <td>
        <div class="circle-div question-circle">
          <font-awesome-icon icon="fa-solid fa-q"></font-awesome-icon>
        </div>
      </td>
      <td style="padding: 5px 0; width: 100%; line-height: 30px">
        <slot name="question"></slot>
      </td>
    </tr>
    <tr>
      <td>
        <div class="circle-div answer-circle">
          <font-awesome-icon icon="fa-solid fa-a"></font-awesome-icon>
        </div>
      </td>
      <td style="padding: 5px 0; width: 100%; line-height: 30px">
        <slot name="answer"></slot>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: "QADescription"
}
</script>

<style scoped>
.circle-div {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  line-height: 30px;
  text-align: center;
  font-size: small;
  margin: 5px;
}

.question-circle {
  background-color: rgb(251, 226, 201);
  color: rgb(254, 174, 97);
}

.answer-circle {
  background-color: rgb(220, 240, 198);
  color: rgb(98, 188, 0);
}

td {
  vertical-align: top;
}
</style>