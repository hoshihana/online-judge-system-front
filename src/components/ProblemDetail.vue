<template>
  <div>
    <h3>题目描述</h3>
    <p v-html="problemDetail.description"></p>
    <h3>输入格式</h3>
    <p v-html="problemDetail.inputFormat"></p>
    <h3>输出格式</h3>
    <p v-html="problemDetail.outputFormat"></p>
    <h3>输入输出样例</h3>
    <el-row v-for="(sample, index) in problemDetail.samples" :key="index" style="margin: 15px">
      <el-col :span="6">
        <h4>输入#{{ index + 1 }}
          <el-button type="text" class="copyBtn" title="复制" :data-clipboard-text="sample.input" @click="copy"
                     style="min-height: auto; padding: 0">
            <v-icon name="regular/copy"></v-icon>
          </el-button>
        </h4>
        <el-input type="textarea" autosize :value="sample.input" readonly resize="none"></el-input>
      </el-col>
      <el-col :span="6" :offset="6">
        <h4>输出#{{ index + 1 }}</h4>
        <el-input type="textarea" autosize :value="sample.output" readonly resize="none"></el-input>
      </el-col>
    </el-row>
    <h3>说明</h3>
    <p v-html="problemDetail.explanation"></p>
  </div>
</template>

<script>
import Clipboard from 'clipboard'

export default {
  name: "ProblemDetail",
  props: ["problemDetail"],
  methods: {
    copy: function () {
      let clipboard = new Clipboard(".copyBtn");
      clipboard.on("success", () => {
        this.$message({
          message: "复制成功",
          type: "success"
        })
        clipboard.destroy();
      });
      clipboard.on("error", () => {
        this.$message.error("复制失败")
        clipboard.destroy();
      });
    }
  }
}
</script>

<style scoped>
h3 {
  margin: 6px 0;
}

h4 {
  margin: 4px 0;
}
</style>