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
      <el-tabs tab-position="left" stretch ref="table">
        <el-tab-pane label="比赛编辑">
          <h3>比赛名<b style="color: #F56C6C">*</b></h3>
          <el-input type="text" v-model="name" placeholder="题目名" maxlength="40" show-word-limit
                    style="width: 60%; margin: 15px"></el-input>
          <h3>比赛类型<b style="color: #F56C6C">*</b></h3>
          <div style="margin: 15px">
            <el-radio-group v-model="type">
              <el-radio label="COMP">竞赛</el-radio>
              <el-radio label="PRAC">练习</el-radio>
            </el-radio-group>
          </div>
          <h3>
            比赛时间<b style="color: #F56C6C">*</b>
          </h3>
          <el-date-picker style="margin: 15px"
                          v-model="time"
                          type="datetimerange"
                          start-placeholder="比赛开始时间"
                          end-placeholder="比赛结束时间"></el-date-picker>
          <h3>比赛描述</h3>
          <mavon-editor v-model="description" :toolbars="toolbars" :xssOptions="{}"
                        style="margin: 15px; min-height: 400px"></mavon-editor>
          <h3 style="margin-top: 30px">参赛设置</h3>
          <div style="margin: 15px">
            <el-switch v-model="passwordSet" active-text="需要密码" style="height: 40px"></el-switch>
            <el-input v-if="passwordSet" type="password" placeholder="参赛密码" v-model="password" show-password
                      style="margin: 0 10px; height: 40px; width: 25%"></el-input>
          </div>
          <div style="text-align: right">
            <el-button type="primary" size="medium" style="margin: 10px 20px" plain>
              <font-awesome-icon icon="fa-solid fa-floppy-disk"></font-awesome-icon>
              保存
            </el-button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="题目配置">
          <el-row type="flex">
            <el-col :span="12">
              <h3>
                我的题目
                <el-input placeholder="题号/题目名" v-model="key" clearable size="medium" style="width: 50%"
                          maxlength="40">
                </el-input>
                <el-button type="primary" plain size="medium" @click="update" style="margin-left: 2%">
                  <font-awesome-icon icon="fa-solid fa-magnifying-glass" fixed-width></font-awesome-icon>
                  搜索
                </el-button>
              </h3>
              <el-card style="margin: 15px">
                <el-table :data="problemEntries" stripe :key="tableKey">
                  <el-table-column label="题号" min-width="1">
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
                      <el-dropdown trigger="click" :hide-on-click="false" placement="bottom">
              <span :class="{'active-filter': showPrivate || showHidden || showPublic}">状态<i
                  class="el-icon-arrow-down el-icon--right"></i></span>
                        <template #dropdown>
                          <el-dropdown-menu>
                            <el-checkbox v-model="showPrivate" style="margin: 0 10px" @change="update">私密题目</el-checkbox>
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
                      <el-tag v-if="scope.row.visibility === 'PRIVATE'" type="danger" size="medium">私密题目</el-tag>
                      <el-tag v-if="scope.row.visibility === 'HIDDEN'" type="warning" size="medium">比赛题目</el-tag>
                      <el-tag v-if="scope.row.visibility === 'PUBLIC'" type="success" size="medium">公开题目</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" min-width="2" align="center" :key="Math.random().toString()">
                    <template #default="scope">
                      <el-button v-if="scope.row.isSelected" style="padding: 0; min-height: 0; color: #F56C6C" type="text" @click="unselect(scope.$index)">
                        <font-awesome-icon icon="fa-solid fa-minus"></font-awesome-icon> 删除
                      </el-button>
                      <el-button v-else style="padding: 0; min-height: 0" type="text" @click="select(scope.$index)">
                        <font-awesome-icon icon="fa-solid fa-plus"></font-awesome-icon> 添加
                      </el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </el-card>
            </el-col>
            <el-col :span="2"></el-col>
            <el-col :span="10">
              <h3>题目列表</h3>
              <el-card style="margin: 15px">

              </el-card>
            </el-col>
          </el-row>

        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import {mavonEditor} from "mavon-editor";
import 'mavon-editor/dist/css/index.css'
import axios from "@/utils/axios";

export default {
  name: "ContestCreateView",
  components: {
    mavonEditor
  },
  data: function () {
    return {
      loading: false,
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
      time: [],
      description: "",
      passwordSet: false,
      password: "",
      key: "",
      showPrivate: false,
      showHidden: true,
      showPublic: false,
      problemEntries: [],
      selectedProblemEntries: [],
      tableKey: 0
    }
  },
  methods: {
    update: function () {
      this.loading = true;
      axios.get("/problemEntries/user/" + this.$root.loginStatus.userid + "/all", {
        params: {
          "key": this.key,
          "showPrivate": this.showPrivate,
          "showHidden": this.showHidden,
          "showPublic": this.showPublic,
        }
      }).then((response) => {
        this.problemEntries = response.data
        for(let i = 0; i < this.problemEntries.length; i++) {
          this.problemEntries[i].isSelected = this.isSelected(this.problemEntries[i].id);
        }
        this.loading = false
      }).catch((error) => {
        this.loading = false
        this.$message.error(error.response.data)
      })
    },
    isSelected: function (problemId) {
      for(let i = 0; i < this.selectedProblemEntries.length; i++) {
        if(this.selectedProblemEntries[i].id === problemId) {
          return true
        }
      }
      return false
    },
    select: function (index) {
      this.selectedProblemEntries.push(this.problemEntries[index])
      this.problemEntries[index].isSelected = true
      this.tableKey++
    },
    unselect: function (index) {
      for(let i = 0; i < this.selectedProblemEntries.length; i++) {
        if(this.selectedProblemEntries[i].id === this.problemEntries[index].id) {
          this.selectedProblemEntries.splice(i, 1);
          this.problemEntries[index].isSelected = false
          this.tableKey++
          break
        }
      }
    },
    backToUserContestList: function () {
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

h3 {
  margin: 6px 0;
}

h4 {
  margin: 4px 0;
}
</style>