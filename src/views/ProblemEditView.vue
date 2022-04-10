<template>
  <div>
    <el-card v-loading="loading">
      <template #header>
        <el-row v-if="!existent">
          <el-col :span="8" style="text-align: left">
            <el-button type="primary" size="medium" plain @click="backToUserProblemList">
              <font-awesome-icon icon="fa-solid fa-arrow-left"></font-awesome-icon>
              返回我的题库
            </el-button>
          </el-col>
          <el-col :span="16" style="text-align: right"><b style="font-size: x-large">题目创建</b></el-col>
        </el-row>
        <el-row v-else>
          <el-col :span="8" style="text-align: left">
            <el-button type="primary" size="medium" plain @click="backToProblem">
              <font-awesome-icon icon="fa-solid fa-arrow-left"></font-awesome-icon>
              返回题目
            </el-button>
            <el-button type="danger" size="medium" plain @click="deleteProblem">
              <font-awesome-icon icon="fa-solid fa-trash-can"></font-awesome-icon>
              删除题目
            </el-button>
          </el-col>
          <el-col :span="16" style="text-align: right"><b style="font-size: x-large">题目编辑：{{ id + " " + name }}</b>
          </el-col>
        </el-row>
      </template>
      <el-tabs tab-position="left" stretch>
        <el-tab-pane label="题目编辑">
          <el-alert v-if="!existent" style="margin: 10px;width: 350px" title="请保存当前内容后再进行测试点的配置" type="warning"
                    show-icon close-text="知道了"></el-alert>
          <h3>题目名<b style="color: #F56C6C">*</b></h3>
          <el-input type="text" v-model="name" placeholder="题目名" maxlength="40" show-word-limit
                    style="width: 80%; margin: 15px"></el-input>
          <h3>题目描述</h3>
          <mavon-editor v-model="description" :toolbars="toolbars" :xssOptions="{}" style="margin: 15px"></mavon-editor>
          <br>
          <h3>输入格式</h3>
          <mavon-editor v-model="inputFormat" :toolbars="toolbars" :xssOptions="{}" style="margin: 15px; z-index: inherit"></mavon-editor>
          <br>
          <h3>输出格式</h3>
          <mavon-editor v-model="outputFormat" :toolbars="toolbars" :xssOptions="{}"
                        style="margin: 15px"></mavon-editor>
          <br>
          <h3>输入输出样例
            <el-button type="text" @click="addSample">添加样例</el-button>
          </h3>
          <div class="sample-div" v-for="(sample, index) in samples" :key="index">
            <el-row>
              <el-col :span="9">
                <h4>输入#{{ index + 1 }}</h4>
                <el-input v-model="sample.input" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
              </el-col>
              <el-col :span="9" :offset="5">
                <h4>输出#{{ index + 1 }}</h4>
                <el-input v-model="sample.output" type="textarea" :autosize="{ minRows: 2, maxRows: 6}"></el-input>
              </el-col>
              <el-col :span="1" style="text-align: right">
                <el-button class="close-btn" type="text" @click="removeSample(index)" title="删除">
                  <font-awesome-icon icon="fa-solid fa-xmark"></font-awesome-icon>
                </el-button>
              </el-col>
            </el-row>
          </div>
          <br>
          <h3>说明</h3>
          <mavon-editor v-model="explanation" :toolbars="toolbars" style="margin: 15px"></mavon-editor>
          <h3 style="margin-top: 40px">题目状态</h3>
          <div style="margin: 15px">
            <el-radio-group v-model="visibility">
              <el-radio label="PRIVATE">私密题目</el-radio>
              <el-radio label="HIDDEN">练习/比赛题目</el-radio>
              <el-radio label="PUBLIC">公开题目</el-radio>
            </el-radio-group>
          </div>
          <el-alert
              type="warning"
              :closable="false"
              style="margin-top: 20px; margin-bottom: 20px; width: 700px">
            <template #title>
              <span style="font-size: larger"><i class="el-icon-warning"></i> 题目状态说明</span>
            </template>
            <ul style="padding-left: 10px; font-size: larger;">
              <li><b>私密题目：</b>仅题目作者可见，其提交记录也是仅作者可见</li>
              <li><b>练习/比赛题目：</b>仅题目作者和练习/比赛的参加者可见，其全部提交记录作者可见，当练习/比赛进行时，参加者仅能查看自己的提交记录，结束后则可以查看所有参加者的提交记录</li>
              <li><b>公开题目：</b>所有用户可见，其提交记录也是所有用户可见</li>
            </ul>
          </el-alert>
          <div style="text-align: right">
            <el-button type="primary" size="medium" style="margin: 10px 20px" plain @click="save">
              <font-awesome-icon icon="fa-solid fa-floppy-disk"></font-awesome-icon>
              保存
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="测试点配置" :disabled="!existent">
          <h3>时间限制<b style="color: #F56C6C">*</b>
            &nbsp;<el-tooltip effect="dark" content="每个测试点的最大运行时间限制，范围限制：500ms~15000ms" placement="right">
              <font-awesome-icon icon="fa-solid fa-circle-question" size="xs" color="#7F7F7F"></font-awesome-icon>
            </el-tooltip>
          </h3>
          <div style="margin: 15px 15px 25px">
            <el-input-number v-model="timeLimit"
                             controls-position="right"
                             size="medium"
                             :min="500"
                             :max="15000"
                             :step="100"
                             style="width: 150px"
                             step-strictly></el-input-number>
            ms
          </div>
          <h3>内存限制<b style="color: #F56C6C">*</b>
            &nbsp;<el-tooltip effect="dark" content="每个测试点的最大内存使用限制，范围限制：128MB~512MB" placement="right">
              <font-awesome-icon icon="fa-solid fa-circle-question" size="xs" color="#7F7F7F"></font-awesome-icon>
            </el-tooltip>
          </h3>
          <div style="margin: 15px 15px 25px">
            <el-input-number v-model="memoryLimit"
                             controls-position="right"
                             size="medium"
                             :min="128"
                             :max="512"
                             :step="1"
                             style="width: 150px"
                             step-strictly></el-input-number>
            MB
          </div>
          <h3>测试点</h3>
          <div style="margin: 15px 15px 25px;">
            <el-alert
                type="warning"
                :closable="false"
                style="margin-bottom: 20px; width: 700px">
              <template #title>
                <span style="font-size: larger"><i class="el-icon-warning"></i> 测试点上传要求</span>
              </template>
              <ul style="padding-left: 10px; font-size: larger;">
                <li>需将所有的测试点打包为zip压缩文件后进行上传，不接受其他格式</li>
                <li>对于每一组测试点文件，必须成对出现，输入文件后缀应为<code>.in</code>，输出文件后缀应为<code>.out</code></li>
                <li>
                  测试点文件应当从1开始按序号进行命名，即第一组为<code>1.in</code>和<code>1.out</code>、第二组为<code>2.in</code>和<code>2.out</code>，以此类推
                </li>
                <li>测试点文件组数不得超过20组，不能含有其他多余文件，且打包后的zip压缩文件大小不能超过30MB，同时建议单个输出不要超过2MB</li>
              </ul>
            </el-alert>
            <el-row>
              <el-col :span="7">
                <el-upload :action="uploadUrl" drag :multiple="false" :with-credentials="true" :show-file-list="false" accept=".zip"
                           :before-upload="beforeUpload"
                           :on-success="onUploadSuccess"
                           :on-error="onUploadError">
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  <template #tip>
                    <div class="el-upload__tip">只能上传zip文件，且不超过30MB，将会替换原测试点文件</div>
                  </template>
                </el-upload>
              </el-col>
              <el-col :span="4" style="text-align: center; margin-top: 80px">
                <font-awesome-icon icon="fa-solid fa-angles-right" size="3x" color="rgb(192,196,204)" fixed-width
                                   :fade="uploadLoading"></font-awesome-icon>
              </el-col>
              <el-col :span="13">
                <el-descriptions v-loading="testInfoLoading" title="测试点信息" :column="3" border>
                  <template slot="extra">
                    <el-button type="primary" size="medium" plain :disabled="!testSet" @click="downloadTestFile">
                      <font-awesome-icon icon="fa-solid fa-cloud-arrow-down"></font-awesome-icon>
                      下载测试点文件
                    </el-button>
                  </template>
                  <el-descriptions-item>
                    <template slot="label">
                      <font-awesome-icon icon="fa-solid fa-book" fixed-width></font-awesome-icon>
                      题号
                    </template>
                    {{ testInfo.problemId }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <font-awesome-icon icon="fa-solid fa-file-zipper" fixed-width></font-awesome-icon>
                      文件名
                    </template>
                    {{ testInfo.fileName }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <font-awesome-icon icon="fa-solid fa-hashtag" fixed-width></font-awesome-icon>
                      测试点组数
                    </template>
                    {{ testInfo.testAmount }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <font-awesome-icon icon="fa-solid fa-box" fixed-width></font-awesome-icon>
                      文件大小
                    </template>
                    {{ getTestSize() }}
                  </el-descriptions-item>
                  <el-descriptions-item>
                    <template slot="label">
                      <font-awesome-icon icon="fa-solid fa-clock" fixed-width></font-awesome-icon>
                      上传时间
                    </template>
                    {{ testInfo.lastModified }}
                  </el-descriptions-item>
                </el-descriptions>
              </el-col>
            </el-row>
          </div>
          <div style="text-align: right">
            <el-button type="primary" size="medium" style="margin: 10px 20px" plain @click="save">
              <font-awesome-icon icon="fa-solid fa-floppy-disk"></font-awesome-icon>
              保存
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import axios from "@/utils/axios";
import JSZip from "jszip"
import router from "@/router";

// todo 将题目创建和题目编辑页面分离

export default {
  name: "ProblemEditView",
  components: {
    mavonEditor
  },
  props: ["id"],
  data: function () {
    return {
      loading: false,
      uploadLoading: false,
      testInfoLoading: false,
      saved: false,
      existent: false,
      currentTab: "problemEdit",
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: false, // 图片链接 todo 实现图片上传功能
        code: true, // code
        table: true, // 表格
        fullscreen: false, // 全屏编辑
        readmodel: false, // 沉浸式阅读
        htmlcode: false, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        save: false, // 保存（触发events中的save事件）
        /* 1.4.2 */
        navigation: false, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true, // 预览
      },
      name: "",
      authorId: null,
      description: "",
      inputFormat: "",
      outputFormat: "",
      explanation: "",
      timeLimit: 500,
      memoryLimit: 128,
      visibility: 'PRIVATE',
      samples: [],
      uploadUrl: "",
      testSet: false,
      testInfo: {
        problemId: "--",
        fileName: "--",
        length: "--",
        testAmount: "--",
        lastModified: "--"
      },
    }
  },
  beforeRouteEnter: function (to, from, next) {
    if (to.fullPath === "/problem/new") {
      next()
    } else {
      axios.get("/problems/" + to.params.id + "/authorId")
          .then((response) => {
            if (response.data !== router.app.$root.loginStatus.userid) {
              router.app.$message.error("无权编辑该题目")
              next(false)
            } else {
              next()
            }
          })
          .catch((error) => {
            router.app.$message.error(error.response.data)
            next(false)
          })
    }
  },
  beforeRouteLeave: function (to, from, next) {
    if (this.saved) {
      next()
    } else {
      this.$confirm(this.existent ? '可能有未保存的修改, 是否继续离开?' : '创建的题目尚未保存，是否继续离开？', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        next()
      }).catch(() => {
        next(false)
      });
    }
  },
  mounted: function () {
    if (this.$route.fullPath === "/problem/new") {
      this.existent = false
    } else {
      // todo 部署时修改该url
      this.uploadUrl = "http://localhost:8088/problems/" + this.id + "/test"
      this.existent = true
      this.loading = true
      axios.get("/problems/" + this.id)
          .then((response) => {
            this.loading = false
            this.name = response.data.name
            this.authorId = response.data.authorId
            this.description = response.data.description
            this.inputFormat = response.data.inputFormat
            this.outputFormat = response.data.outputFormat
            this.samples = eval(response.data.samples)
            this.explanation = response.data.explanation
            this.timeLimit = response.data.timeLimit
            this.memoryLimit = response.data.memoryLimit
            this.visibility = response.data.visibility
          })
          .catch((error) => {
            this.loading = false
            this.$message.error(error.response.data)
          })
      this.testInfoLoading = true
      axios.get("/problems/" + this.id + "/testInfo")
          .then((response) => {
            this.testInfo = response.data
            this.testSet = true
            this.testInfoLoading = false
          })
          .catch((error) => {
            if (error.response.status !== 404) {
              this.$message.error(error.response.data)
            }
            this.testInfoLoading = false
          })
    }
  },
  methods: {
    addSample: function () {
      this.samples.push({
        input: "",
        output: ""
      })
    },
    removeSample: function (index) {
      this.samples.splice(index, 1)
    },
    save: function () {
      if (!this.existent) {
        this.newProblem()
      } else {
        this.editProblem()
      }
    },
    newProblem: function () {
      if (this.name === "") {
        this.$message.error("题目名不能为空")
      } else {
        this.loading = true
        axios.post("/problems/", {
          "name": this.name,
          "description": this.description,
          "inputFormat": this.inputFormat,
          "outputFormat": this.outputFormat,
          "explanation": this.explanation,
          "samples": JSON.stringify(this.samples),
          "timeLimit": this.timeLimit,
          "memoryLimit": this.memoryLimit,
          "visibility": this.visibility
        }).then((response) => {
          this.loading = false
          this.$message({
            message: "题目创建成功",
            type: "success"
          })
          this.saved = true
          this.$router.replace("/problem/" + response.data)
        }).catch((error) => {
          this.loading = false
          this.$message.error(error.response.data)
        })
      }
    },
    editProblem: function () {
      if (this.name === "") {
        this.$message.error("题目名不能为空")
      } else {
        this.loading = true
        axios.patch("/problems/" + this.id, {
          "name": this.name,
          "description": this.description,
          "inputFormat": this.inputFormat,
          "outputFormat": this.outputFormat,
          "explanation": this.explanation,
          "samples": JSON.stringify(this.samples),
          "timeLimit": this.timeLimit,
          "memoryLimit": this.memoryLimit,
          "visibility": this.visibility
        }).then((response) => {
          this.loading = false
          this.$message.success(response.data)
          this.saved = true
          this.$router.replace("/problem/" + this.id)
        }).catch((error) => {
          this.loading = false
          this.$message.error(error.response.data)
        })
      }
    },
    deleteProblem: function () {
      this.$confirm('此操作将永久删除该题目, 是否继续?', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        axios.delete("/problems/" + this.id)
            .then(() => {
              this.loading = false
              this.$message({
                type: 'success',
                message: '题目删除成功'
              });
              this.saved = true
              this.$router.go(-1)
            }).catch((error) => {
          this.loading = false
          this.$message.error(error.response.data)
        })
      }).catch(() => {
      })
    },
    backToProblem: function () {
      this.$router.replace("/problem/" + this.id)
    },
    backToUserProblemList: function () {
      this.$router.replace("/user/" + this.$root.loginStatus.userid + "/problem/list")
    },
    getTestSize: function () {
      if (this.testInfo.length === "--") {
        return "--"
      } else {
        let length = this.testInfo.length
        if (length < 1024) {
          return length + " B"
        } else if (length < 1024 * 1024) {
          return (length / 1024).toFixed(1) + " KB"
        } else {
          return (length / (1024 * 1024)).toFixed(1) + " MB"
        }
      }
    },
    beforeUpload: async function (file) {
      this.uploadLoading = true
      if (this.testSet) {
        let cancel = true;
        await this.$confirm('上传后将会替换原测试点文件, 是否继续上传?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          cancel = false
        }).catch(() => {
          cancel = true
        })
        if (cancel) {
          this.uploadLoading = false
          throw new Error("用户取消上传")
        }
      }
      if (file.size > 30 * 1024 * 1024) {
        this.$message.error("上传的zip压缩文件超过了30MB，请严格遵循上传要求")
        this.uploadLoading = false
        throw new Error("上传文件超出30MB限制")
      }
      let valid = true;
      await JSZip.loadAsync(file)
          .then(function (zip) {
            let cur = 0
            zip.forEach(function (relativePath, zipEntry) {
              if (valid) {
                cur++
                if (cur > 40) {
                  valid = false
                }
                if (cur % 2 === 1) {
                  if (zipEntry.name !== (cur + 1) / 2 + ".in") {
                    valid = false
                  }
                } else {
                  if (zipEntry.name !== cur / 2 + ".out") {
                    valid = false
                  }
                }
              }
            })
            if(cur === 0 || cur % 2 === 1) {
              valid = false
            }
          }, function () {
            valid = false
          });
      if (!valid) {
        this.$message.error("测试点文件内部格式不正确，请严格遵循上传要求")
        this.uploadLoading = false
        throw new Error("文件内部格式不合要求")
      }
    },
    onUploadSuccess: function (response) {
      this.testInfo = response
      this.$message.success("测试点文件上传成功")
      this.uploadLoading = false
      this.testSet = true
    },
    onUploadError: function (err) {
      this.$message.error(err)
      this.uploadLoading = false
    },
    downloadTestFile: function () {
      axios.get("/problems/" + this.id + "/test", {responseType: "blob"})
        .then((response) => {
          const blob = new Blob([response.data], {type: 'application/x-zip-compressed;charset=utf-8'});
          const href = window.URL.createObjectURL(blob);
          let filename = this.id + ".zip";
          const downloadElement = document.createElement('a');
          downloadElement.style.display = 'none';
          downloadElement.href = href;
          downloadElement.download = filename ;
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
        })
    }
  }
}
</script>

<style scoped>

.sample-div {
  width: 80%;
  margin: 13px;
  padding: 10px 10px 20px 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.sample-div:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.2);
}

.close-btn {
  padding: 8px
}

.close-btn:hover {
  color: #1776f1;
}

::v-deep .el-upload {
  width: 100%;
}

::v-deep .el-upload-dragger {
  width: 100%;
}

h3 {
  margin: 6px 0;
}

h4 {
  margin: 4px 0;
}
</style>