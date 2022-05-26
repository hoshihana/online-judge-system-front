<template>
  <div>
    <el-card>
      <template #header>
        <div style="width: 100%; text-align: center">
          <b style="font-size: x-large">常见问题及解答</b>
        </div>
      </template>
      <q-a-description>
        <template #question>
          <b>系统支持哪些代码语言？</b>
        </template>
        <template #answer>
          支持C, C++, C++11, C++14, C++17, Java, Python2, Python3，具体的编译器版本和编译选项如下表所示。
          <el-table :data="compileInfos" stripe size="medium" style="width: 650px;margin: 10px">
            <el-table-column label="#" prop="number" align="center" width="50"></el-table-column>
            <el-table-column label="语言" prop="language" align="center" width="100"></el-table-column>
            <el-table-column label="编译器版本" prop="compiler" align="center" width="200"></el-table-column>
            <el-table-column label="编译选项" prop="option" align="center" width="300"></el-table-column>
          </el-table>
        </template>
      </q-a-description>
      <el-divider></el-divider>
      <q-a-description>
        <template #question>
          <b>允许提交的代码最大长度？</b>
        </template>
        <template #answer>
          所提交的代码最大不能超过1048576字节
        </template>
      </q-a-description>
      <el-divider></el-divider>
      <q-a-description>
        <template #question>
          <b>各个评测结果的含义？</b>
        </template>
        <template #answer>
          Pending(PD)：您所提交的代码正在排队等待评测。<br>
          Judge(JD)：您所提交的代码正在评测中。<br>
          Compile Error(CE)：您所提交的代码在未通过编译，请检查提交时所选择的代码语言是否正确及代码本身是否存在语法错误。<br>
          Accepted(AC)：恭喜！您所提交的代码通过了该题目的所有测试点！<br>
          Wrong Answer(WA)：您所提交的代码未通过该题目的所有测试点。<br>
          Runtime Error(RE)：您所提交的代码在运行时发生错误，可能发生了段错误、除零错误等。<br>
          Time Limit Exceeded(TLE)：您所提交的代码运行时间超过了题目所限制的运行时间，请检查程序是否存在死循环及时间复杂度是否过高。<br>
          Memory Limit Exceeded(MLE)：您所提交的代码运行内存超过了题目所限制的运行内存，请检查程序的空间复杂度是否过高。<br>
          System Error(SE)：评测机发生了未知问题，请联系管理员。<br>
        </template>
      </q-a-description>
      <el-divider></el-divider>
      <q-a-description>
        <template #question>
          <b>找不到自己的提交记录？</b>
        </template>
        <template #answer>
          比赛中的提交只能在该比赛中的提交记录列表中找到。
        </template>
      </q-a-description>
      <el-divider></el-divider>
      <q-a-description>
        <template #question>
          <b>比赛排名方式？</b>
        </template>
        <template #answer>
          比赛采用ACM赛制：
          <ol>
            <li>每题耗时：成功通过题目的那一刻距离比赛开始的时间。</li>
            <li>总罚时：所有通过了的题（耗时 + 错误次数 * 20分钟）的和，没通过的题目和通过后的提交均不算罚时。</li>
            <li>排名时，解题数优先，题数相同时按罚时排序。</li>
            <li>比赛进行中的排名为实时排名，可多次提交，比赛结束的那一刻封榜。</li>
          </ol>
        </template>
      </q-a-description>
    </el-card>
  </div>
</template>

<script>
import QADescription from "@/components/QADescription";

export default {
  name: "AboutView",
  components: {
    QADescription,
  },
  data: function () {
    return {
      compileInfos: [{
        number: 1,
        language: "C",
        compiler: "GCC 9.2.0",
        option: "-O2 -w -fmax-errors=3 -std=c11 -lm"
      }, {
        number: 2,
        language: "C++",
        compiler: "GCC 9.2.0",
        option: "-O2 -w -fmax-errors=3 -lm"
      }, {
        number: 3,
        language: "C++11",
        compiler: "GCC 9.2.0",
        option: "-O2 -w -fmax-errors=3 -std=c++11 -lm"
      }, {
        number: 4,
        language: "C++14",
        compiler: "GCC 9.2.0",
        option: "-O2 -w -fmax-errors=3 -std=c++14 -lm"
      }, {
        number: 5,
        language: "C++17",
        compiler: "GCC 9.2.0",
        option: "-O2 -w -fmax-errors=3 -std=c++17 -lm"
      }, {
        number: 6,
        language: "Java",
        compiler: "OpenJDK 13.0.1",
        option: "-encoding UTF8"
      }, {
        number: 7,
        language: "Python2",
        compiler: "2.7.17",
        option: "无"
      }, {
        number: 8,
        language: "Python3",
        compiler: "3.8.1",
        option: "无"
      },]
    }
  }
}
</script>

<style scoped>

</style>