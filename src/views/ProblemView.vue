<template>
  <div>
    <el-container>
      <el-main style="padding: 0 20px 20px 0">
        <el-card>
          <template #header>
            <el-page-header>
              <template #content>
                <b>{{ problem.id + ' ' + problem.name }}</b>
              </template>
            </el-page-header>
          </template>
          <el-tabs tab-position="right" >
            <el-tab-pane label="题目详情" style="height: auto">
              <h3>题目描述</h3>
              <p v-html="problem.description"></p>
              <h3>输入格式</h3>
              <p v-html="problem.inputFormat"></p>
              <h3>输出格式</h3>
              <p v-html="problem.outputFormat"></p>
              <h3>输入输出样例</h3>
              <el-row v-for="(sample, index) in problem.samples" :key="index" style="margin: 15px">
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
              <p v-html="problem.explanation"></p>
            </el-tab-pane>
            <el-tab-pane label="提交代码">
              <code-editor :code.sync="code"></code-editor>
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-main>
      <el-aside width="300px">
        <el-card style="margin-bottom: 20px"></el-card>
        <el-card style="margin-bottom: 20px"></el-card>
      </el-aside>
    </el-container>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import CodeEditor from "@/components/CodeEditor";

export default {
  name: "ProblemView",
  components: {CodeEditor},
  data: function () {
    return {
      problem: {
        id: 1000,
        name: "题目名",
        description: `<p>题目描述</p>`,
        inputFormat: `<p>输入格式</p>`,
        outputFormat: `<p>输出格式</p>`,
        explanation: `<p>说明</p>`,
        samples: [
          {input: "1 1", output: "2"},
          {input: "2 3", output: "5"}
        ]
      },
      code: ""
    }
  },
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
        this.$message.error("复制失败"),
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