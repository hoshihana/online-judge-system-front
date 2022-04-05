<template>
  <div>
    <el-alert v-if="!problemDetail.testSet" style="margin: 10px;width: 350px" title="该题尚未配置测试点，无法提交代码" type="error"
              show-icon close-text="知道了"></el-alert>
    <h3>题目描述</h3>
    <mavon-editor class="preview" :value="problemDetail.description" :box-shadow="false" previewBackground="#ffffff"
                  :subfield="false" default-open="preview" :toolbars-flag="false" :short-cut="false"></mavon-editor>
    <h3>输入格式</h3>
    <mavon-editor class="preview" :value="problemDetail.inputFormat" :box-shadow="false" previewBackground="#ffffff"
                  :subfield="false" default-open="preview" :toolbars-flag="false" :short-cut="false"></mavon-editor>
    <h3>输出格式</h3>
    <mavon-editor class="preview" :value="problemDetail.outputFormat" :box-shadow="false" previewBackground="#ffffff"
                  :subfield="false" default-open="preview" :toolbars-flag="false" :short-cut="false"></mavon-editor>
    <h3>输入输出样例</h3>
    <el-row v-if="samples === undefined || samples.length === 0" style="margin: 15px;">无</el-row>
    <el-row v-for="(sample, index) in samples" :key="index" style="margin: 15px">
      <el-col :span="9">
        <h4>输入#{{ index + 1 }}
          <el-button type="text" class="copyBtn" title="复制" :data-clipboard-text="sample.input" @click="copy"
                     style="min-height: auto; padding: 0">
            <font-awesome-icon icon="fa-regular fa-copy" color="#409EFF"></font-awesome-icon>
          </el-button>
        </h4>
        <el-input type="textarea" autosize :value="sample.input" readonly resize="none"></el-input>
      </el-col>
      <el-col :span="9" :offset="5">
        <h4>输出#{{ index + 1 }}</h4>
        <el-input type="textarea" autosize :value="sample.output" readonly resize="none"></el-input>
      </el-col>
    </el-row>
    <h3>说明</h3>
    <mavon-editor class="preview" :value="problemDetail.explanation" :box-shadow="false" previewBackground="#ffffff"
                  :subfield="false" default-open="preview" :toolbars-flag="false" :short-cut="false"></mavon-editor>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: "ProblemDetail",
  props: ["problemDetail"],
  components: {
    mavonEditor
  },
  computed: {
    samples: function () {
      return eval(this.problemDetail.samples)
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
        this.$message.error("复制失败")
        clipboard.destroy();
      });
    },
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

.preview {
  border: none;
  min-height: 0
}
</style>