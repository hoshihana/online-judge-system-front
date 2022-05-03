<template>
  <div>
    <el-card>
      <template #header>
        <el-row>
          <el-col :span="8" style="text-align: left">
            <el-button type="primary" size="medium" plain @click="backToUserContestList">
              <font-awesome-icon icon="fa-solid fa-arrow-left"></font-awesome-icon>
              返回我的比赛
            </el-button>
          </el-col>
          <el-col :span="16" style="text-align: right"><b style="font-size: x-large">比赛创建</b></el-col>
        </el-row>
      </template>
      <el-tabs tab-position="left" stretch ref="table" v-model="activeName">
        <el-tab-pane label="比赛详情" name="contestDetail">
          <h3>比赛名<b style="color: #F56C6C">*</b></h3>
          <el-input type="text" v-model="name" placeholder="比赛名" maxlength="40" show-word-limit
                    style="width: 45%; margin: 15px 15px 25px;"></el-input>
          <h3>
            比赛时间<b style="color: #F56C6C">*</b>
          </h3>
          <el-date-picker style="margin: 15px 15px 25px"
                          v-model="time"
                          type="datetimerange"
                          format="yyyy/MM/dd HH:mm"
                          :picker-options="timePickerOptions"
                          @change="checkTime"
                          start-placeholder="比赛开始时间"
                          end-placeholder="比赛结束时间"></el-date-picker>
          <h3>比赛类型</h3>
          <div style="margin: 15px 15px 25px">
            <el-radio-group v-model="type">
              <el-radio label="COMP">竞赛</el-radio>
              <el-radio label="PRAC">练习</el-radio>
            </el-radio-group>
          </div>
          <h3>比赛描述</h3>
          <mavon-editor v-model="description" :toolbars="toolbars" :xssOptions="{}"
                        style="margin: 15px; min-height: 400px"></mavon-editor>
          <h3 style="margin-top: 30px">参赛设置</h3>
          <div style="margin: 15px">
            <el-switch v-model="passwordSet" active-text="需要密码" style="height: 40px"></el-switch>
            <el-input v-if="passwordSet" type="password" placeholder="密码：6到16位的数字或字母" v-model="password" show-password
                      style="margin: 0 10px; height: 40px; width: 25%"></el-input>
          </div>
          <div style="text-align: right">
            <el-button type="warning" size="medium" style="margin: 10px" plain @click="activeName = 'problemList'">
              <font-awesome-icon icon="fa-solid fa-list"></font-awesome-icon>
              题目配置
            </el-button>
            <el-button type="primary" size="medium" style="margin: 10px 20px 10px 10px" plain @click="createContest">
              <font-awesome-icon icon="fa-solid fa-floppy-disk"></font-awesome-icon>
              创建
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="题目列表" name="problemList">
          <el-row type="flex">
            <el-col :span="13">
              <h3>
                我的题目
                <el-input placeholder="题号/题目名" v-model="key" clearable size="medium" style="width: 50%"
                          maxlength="40">
                </el-input>
                <el-button type="primary" plain size="medium" @click="update" style="margin-left: 2%"
                           :disabled="loading">
                  <font-awesome-icon icon="fa-solid fa-magnifying-glass" fixed-width></font-awesome-icon>
                  搜索
                </el-button>
                <el-button type="text" @click="update" style="margin-left: 20px" :disabled="loading">
                  <font-awesome-icon icon="fa-solid fa-arrows-rotate" fixed-width></font-awesome-icon>
                  刷新
                </el-button>
              </h3>
              <el-card style="margin: 15px" body-style="padding-top: 5px">
                <el-table :data="problemEntries" stripe max-height="430">
                  <el-table-column label="#" min-width="1" align="center">
                    <template #default="scope">
                      <router-link class="el-link el-link--primary" :to="'/problem/' + scope.row.id" target="_blank">{{
                          scope.row.id
                        }}
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column label="题目名" min-width="5">
                    <template #default="scope">
                      <router-link class="el-link el-link--primary" :to="'/problem/' + scope.row.id" target="_blank">{{
                          scope.row.name
                        }}
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column min-width="2" align="center">
                    <template #header>
                      <el-dropdown trigger="click" :hide-on-click="false" placement="bottom" style="cursor: pointer">
              <span :class="{'active-filter': showPrivate || showHidden || showPublic}">状态<i
                  class="el-icon-arrow-down el-icon--right"></i></span>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-checkbox v-model="showPrivate" style="margin: 0 10px" @change="update">私密题目
                            </el-checkbox>
                            <br>
                            <el-checkbox v-model="showHidden" style="margin: 10px 10px 0" @change="update">比赛题目
                            </el-checkbox>
                            <br>
                            <el-checkbox v-model="showPublic" style="margin: 10px 10px 0" @change="update">公开题目
                            </el-checkbox>
                          </el-dropdown-menu>
                        </template>
                      </el-dropdown>
                    </template>
                    <template #default="scope">
                      <el-tag :type="getTagType(scope.row.visibility)" size="medium">{{
                          getTagText(scope.row.visibility)
                        }}
                      </el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" min-width="2" align="center" :key="Math.random().toString()">
                    <template #default="scope">
                      <el-button v-if="selectedProblemIds.has(scope.row.id)"
                                 style="padding: 0; min-height: 0; color: #F56C6C"
                                 type="text" @click="unselect(scope.row)">
                        <font-awesome-icon icon="fa-solid fa-angles-left"></font-awesome-icon>
                        删除
                      </el-button>
                      <el-button v-else style="padding: 0; min-height: 0" type="text" @click="select(scope.row)">
                        <font-awesome-icon icon="fa-solid fa-angles-right"></font-awesome-icon>
                        添加
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
            <el-col :span="1"></el-col>
            <el-col :span="10">
              <h3>
                题目列表
                <el-popconfirm
                    confirm-button-text='确定'
                    cancel-button-text='不用了'
                    icon="el-icon-warning"
                    title="确定要清空当前题目列表吗？"
                    @confirm="clear"
                >
                  <template #reference>
                    <el-button type="danger" plain size="medium" style="margin-left: 2%" :disabled="selectedProblemEntries.length === 0">
                      <font-awesome-icon icon="fa-solid fa-trash-can" fixed-width></font-awesome-icon>
                      清空
                    </el-button>
                  </template>
                </el-popconfirm>
              </h3>
              <el-card style="margin: 15px" body-style="padding-top: 5px; padding-bottom: 5px">
                <div style="max-height: 430px; overflow-y: auto;">
                  <div style="float: left;">
                    <div v-for="i in Math.max(10, selectedProblemEntries.length)" class="selected-number" :key="i">{{
                        i
                      }}
                      <font-awesome-icon icon="fa-solid fa-caret-right"></font-awesome-icon>
                    </div>
                  </div>
                  <draggable :list="selectedProblemEntries" animation="300" ghost-class="drag-ghost"
                             chosen-class="drag-chosen" :scroll="true">
                    <el-tag v-for="(problemEntry, index) in selectedProblemEntries" :key="problemEntry.id"
                            :disable-transitions="false"
                            :type="getTagType(problemEntry.visibility)" class="drag-tag">
                      <font-awesome-icon icon="fa-solid fa-grip" style="margin: auto 5px auto 0"></font-awesome-icon>
                      <router-link :to="'/problem/' + problemEntry.id" target="_blank"
                                   :class="'el-link el-link--' + getTagType(problemEntry.visibility)">
                        {{ problemEntry.id + " " + problemEntry.name }}
                      </router-link>
                      <i class="el-tag__close el-icon-close" style="margin: auto 0 auto auto"
                         @click="remove(index)"></i>
                    </el-tag>
                  </draggable>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <div style="text-align: right">
            <el-button type="primary" size="medium" style="margin: 10px 20px" plain @click="createContest">
              <font-awesome-icon icon="fa-solid fa-floppy-disk"></font-awesome-icon>
              创建
            </el-button>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {mavonEditor} from "mavon-editor";
import 'mavon-editor/dist/css/index.css'
import axios from "@/utils/axios";
import draggable from 'vuedraggable'

export default {
  name: "ContestNewView",
  components: {
    mavonEditor,
    draggable
  },
  data: function () {
    return {
      loading: false,
      saved: false,
      activeName: "contestDetail",
      timePickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < new Date().getTime() - 24 * 60 * 60 * 1000
        }
      },
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
      type: "COMP",
      time: null,
      description: "",
      passwordSet: false,
      password: "",
      key: "",
      showPrivate: false,
      showHidden: true,
      showPublic: false,
      problemEntries: [],
      selectedProblemEntries: [],
      selectedProblemIds: new Set(),
    }
  },
  methods: {
    update: function () {
      this.loading = true
      axios.get("/problemEntries/user/" + this.$root.loginStatus.userid + "/all", {
        params: {
          "key": this.key,
          "showPrivate": this.showPrivate,
          "showHidden": this.showHidden,
          "showPublic": this.showPublic,
        }
      }).then((response) => {
        this.problemEntries = response.data
        this.loading = false
      }).catch((error) => {
        this.loading = false
        this.$message.error(error.response.data)
      })
    },
    getTagText: function (visibility) {
      switch (visibility) {
        case "PRIVATE":
          return "私密题目"
        case "HIDDEN":
          return "比赛题目"
        case "PUBLIC":
          return "公开题目"
      }
    },
    getTagType: function (visibility) {
      switch (visibility) {
        case "PRIVATE":
          return "danger"
        case "HIDDEN":
          return "warning"
        case "PUBLIC":
          return "success"
      }
    },
    select: function (problemEntry) {
      if (problemEntry.visibility === "PRIVATE") {
        this.$confirm('该题目是私密题目，除作者以外的其他用户将无法查看并提交，是否继续添加至题目列表？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.selectedProblemEntries.push(problemEntry)
          this.selectedProblemIds.add(problemEntry.id)
        })
      } else if (problemEntry.visibility === "PUBLIC") {
        this.$confirm('该题目是公开题目，所有登录用户都可以不通过比赛直接查看并提交，是否继续添加至题目列表？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.selectedProblemEntries.push(problemEntry)
          this.selectedProblemIds.add(problemEntry.id)
        })
      } else {
        this.selectedProblemEntries.push(problemEntry)
        this.selectedProblemIds.add(problemEntry.id)
      }
    },
    unselect: function (problemEntry) {
      for (let i = 0; i < this.selectedProblemEntries.length; i++) {
        if (this.selectedProblemEntries[i].id === problemEntry.id) {
          this.selectedProblemEntries.splice(i, 1)
          break
        }
      }
      this.selectedProblemIds.delete(problemEntry.id)
    },
    remove: function (index) {
      this.selectedProblemIds.delete(this.selectedProblemEntries[index].id)
      this.selectedProblemEntries.splice(index, 1)
    },
    clear: function () {
      this.selectedProblemIds.clear()
      this.selectedProblemEntries.splice(0, this.selectedProblemEntries.length)
    },
    backToUserContestList: function () {
      this.$router.replace("/user/" + this.$root.loginStatus.userid + "/contest/list")
    },
    checkTime: function (time) {
      if (time[0].getTime() - new Date().getTime() < (4 * 60 + 30) * 1000) {
        this.$message.error("比赛开始时间必须至少在当前时间的5分钟之后")
        this.time = null
      } else if (time[0] >= time[1]) {
        this.$message.error("比赛结束时间必须在开始时间之后")
        this.time = null
      }
    },
    create: function () {
      let problemIds = []
      for(let problemEntry of this.selectedProblemEntries) {
        problemIds.push(problemEntry.id)
      }
      axios.post("/contests", {
        "name": this.name,
        "type": this.type,
        "description": this.description,
        "passwordSet": this.passwordSet,
        "password": this.password,
        "startTime": this.time[0],
        "endTime": this.time[1],
        "problemIds": problemIds
      }).then(() => {
        this.$message.success("比赛创建成功")
        this.saved = true
        this.$router.push("/user/" + this.$root.loginStatus.userid + "/contest/list")
      }).catch((error) => {
        this.$message.error(error.response.data)
      })
    },
    createContest: function () {
      if (this.name === "") {
        this.$message.error("比赛名不能为空")
        return
      }
      if (this.time === null) {
        this.$message.error("比赛时间不能为空")
        return
      }
      if (this.time[0].getTime() - new Date().getTime() < (4 * 60 + 30) * 1000) {
        this.$message.error("比赛开始时间必须至少在当前时间的5分钟之后")
        return
      }
      if (this.time[0] >= this.time[1]) {
        this.$message.error("比赛结束时间必须在开始时间之后")
        return
      }
      if (this.passwordSet) {
        if (this.password === "") {
          this.$message.error("参赛密码不能为空")
          return
        }
        if (!/^[A-Za-z0-9]{6,16}$/.test(this.password)) {
          this.$message.error("参赛密码不符合格式，必须由6到16位的数字或字母组成")
          return
        }
      }
      if (this.selectedProblemEntries.length === 0) {
        this.$confirm('该比赛的题目列表为空，是否继续创建？', '确认信息', {
          distinguishCancelAndClose: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          this.create()
        })
      } else {
        this.create()
      }
    }
  },
  beforeRouteLeave: function (to, from, next) {
    if (this.saved) {
      next()
    } else {
      this.$confirm('创建的比赛尚未保存，是否继续离开？', '确认信息', {
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
    this.update();
  }
}
</script>

<style scoped>
.active-filter {
  color: #409EFF;
}

.drag-chosen {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3)
}

.drag-ghost {
  opacity: 40%;
}

.selected-number {
  height: 32px;
  text-align: right;
  line-height: 32px;
  color: #909399;
  margin: 10px 5px 10px 0;
}

.drag-tag {
  display: flex;
  width: auto;
  margin: 10px 5px;
  cursor: move;
}

h3 {
  margin: 6px 0;
}

h4 {
  margin: 4px 0;
}
</style>