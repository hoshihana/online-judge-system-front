<template>
  <div>
    <el-card v-loading="loading">
      <template #header>
        <el-row>
          <el-col :span="8" style="text-align: left">
            <el-button type="primary" size="medium" plain @click="backToContest">
              <font-awesome-icon icon="fa-solid fa-arrow-left"></font-awesome-icon>
              返回比赛
            </el-button>
            <el-button type="danger" size="medium" plain @click="deleteContest">
              <font-awesome-icon icon="fa-solid fa-trash-can"></font-awesome-icon>
              删除比赛
            </el-button>
            <el-button v-if="status !== 'before'" type="warning" size="medium" plain @click="showResetContestDialog = true">
              <font-awesome-icon icon="fa-solid fa-clock-rotate-left" fixed-width></font-awesome-icon> 重置比赛
            </el-button>
            <el-dialog :visible.sync="showResetContestDialog" width="40%" :destroy-on-close="true" @open="pickedTime=[startTime, endTime]">
              <template #title>
                <font-awesome-icon icon="fa-solid fa-clock-rotate-left" fixed-width></font-awesome-icon> 重置比赛
              </template>
              <div style="font-size: medium; margin-bottom: 10px">
                <b>比赛时间</b>
              </div>
              <div style="margin: 0 15px">
                <div style="font-size: small; color: #909399; margin-bottom: 10px">比赛开始时间必须至少在当前时间的5分钟之后，结束时间必须在开始时间之后</div>
                <el-date-picker style="width: 90%"
                                v-model="pickedTime"
                                type="datetimerange"
                                format="yyyy/MM/dd HH:mm"
                                :picker-options="timePickerOptions"
                                start-placeholder="比赛开始时间"
                                end-placeholder="比赛结束时间"></el-date-picker>
              </div>
              <div style="font-size: medium; color: #F56C6C; margin-top: 25px; text-align: center">
                <i class="el-icon-warning"></i> 注意：重置比赛将会删除该比赛当前所有的参赛记录和提交记录
              </div>
              <template #footer>
                <div>
                  <el-button size="medium" plain @click="showResetContestDialog = false">取消</el-button>
                  <el-button type="primary" size="medium" plain @click="resetContest">确定</el-button>
                </div>
              </template>
            </el-dialog>
          </el-col>
          <el-col :span="16" style="text-align: right"><b style="font-size: x-large">比赛编辑：{{ id }} {{ name }}</b>
          </el-col>
        </el-row>
      </template>
      <el-tabs tab-position="left" stretch ref="table" v-model="activeName">
        <el-tab-pane label="比赛详情" name="contestDetail">
          <el-alert
              type="info"
              :style="{margin: '15px 15px 25px', width: '80%', 'background-color': statusBgColor, 'color': statusColor}"
              :closable="false"
              show-icon>
            <template #title>
              <div class="title-div">
                {{ statusTipText }}
              </div>
            </template>
            <div class="description-div" :style="{color: statusColor}">
              <span v-if="status === 'before'">
                比赛尚未开始，各项内容均可作修改
              </span>
              <span v-if="status === 'ongoing'">
                比赛正在进行中，无法修改题目列表，如有需要请"重置比赛"
              </span>
              <span v-if="status === 'after' && !open">
                比赛已经结束但未开放，无法修改比赛信息和题目列表，且用户不可参赛或提交，如有需要请"修改比赛结束时间"、"开放比赛"或"重置比赛"
              </span>
              <span v-if="status === 'after' && open">
                比赛已经结束且已开放，无法修改比赛信息和题目列表，用户可参赛或提交但不会改变排行榜，如有需要请"重置比赛"
              </span>
            </div>
          </el-alert>
          <h3>
            比赛状态
            <el-button v-if="status === 'before'" type="primary" size="medium" plain style="margin: 0 10px"
                       @click="showUpdateTimeDialog = true">
              <font-awesome-icon icon="fa-solid fa-pen" fixed-width></font-awesome-icon>
              修改比赛时间
            </el-button>
            <el-dialog :visible.sync="showUpdateTimeDialog" width="40%" :destroy-on-close="true" @open="pickedTime=[startTime, endTime]">
              <template #title>
                <font-awesome-icon icon="fa-solid fa-pen" fixed-width></font-awesome-icon>
                修改比赛时间
              </template>
              <div style="margin: 0 15px">
                <div style="font-size: small; color: #909399; margin-bottom: 10px">比赛开始时间必须至少在当前时间的5分钟之后，结束时间必须在开始时间之后</div>
                <el-date-picker style="width: 90%"
                                v-model="pickedTime"
                                type="datetimerange"
                                format="yyyy/MM/dd HH:mm"
                                :picker-options="timePickerOptions"
                                start-placeholder="比赛开始时间"
                                end-placeholder="比赛结束时间"></el-date-picker>
              </div>
              <template #footer>
                <div>
                  <el-button size="medium" plain @click="showUpdateTimeDialog = false">取消</el-button>
                  <el-button type="primary" size="medium" plain @click="updateTime">确定</el-button>
                </div>
              </template>
            </el-dialog>
            <el-button v-if="status !== 'before' && !open" type="primary" size="medium" plain style="margin: 0 10px"
                       @click="showUpdateEndTimeDialog = true">
              <font-awesome-icon icon="fa-solid fa-pen" fixed-width></font-awesome-icon>
              修改结束时间
            </el-button>
            <el-dialog :visible.sync="showUpdateEndTimeDialog" width="40%" :destroy-on-close="true" @open="pickedEndtime = endTime">
              <template #title>
                <font-awesome-icon icon="fa-solid fa-pen" fixed-width></font-awesome-icon>
                修改结束时间
              </template>
              <div style="margin: 0 15px">
                <div style="font-size: small; color: #909399; margin-bottom: 10px">比赛结束时间必须至少在当前时间的5分钟之后</div>
                <el-date-picker style="width: 90%"
                                v-model="pickedEndtime"
                                type="datetime"
                                format="yyyy/MM/dd HH:mm"
                                :picker-options="timePickerOptions"
                                placeholder="比赛结束时间"></el-date-picker>
              </div>
              <template #footer>
                <div>
                  <el-button size="medium" plain @click="showUpdateEndTimeDialog = false">取消</el-button>
                  <el-button type="primary" size="medium" plain @click="updateEndTime">确定</el-button>
                </div>
              </template>
            </el-dialog>
            <el-button v-if="status === 'after'" type="warning" size="medium" plain style="margin: 0 10px" :disabled="openContestLoading || open" @click="openContest">
              <font-awesome-icon icon="fa-solid fa-door-open" fixed-width></font-awesome-icon>
              {{ open ? "比赛已开放" : "开放比赛"}}
            </el-button>
          </h3>
          <el-descriptions style="margin: 15px 15px 25px; width: 80%" :column="3" border>
            <el-descriptions-item>
              <template slot="label">
                <font-awesome-icon icon="fa-solid fa-scale-balanced" fixed-width></font-awesome-icon>
                状态
              </template>
              <el-tooltip :content="statusTipText" placement="top" effect="light">
                <el-tag :type="statusTagType">{{ statusTagText }}</el-tag>
              </el-tooltip>
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font-awesome-icon icon="fa-solid fa-hourglass-start" fixed-width></font-awesome-icon>
                开始时间
              </template>
              {{ $moment(startTime).format("yyyy-MM-DD HH:mm") }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font-awesome-icon icon="fa-solid fa-hourglass-end" fixed-width></font-awesome-icon>
                结束时间
              </template>
              {{ $moment(endTime).format("yyyy-MM-DD HH:mm") }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font-awesome-icon icon="fa-solid fa-stopwatch" fixed-width></font-awesome-icon>
                比赛时长
              </template>
              {{ formatTimeInterval(endTime - startTime) }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font-awesome-icon icon="fa-solid fa-users" fixed-width></font-awesome-icon>
                参加人数
              </template>
              {{ status === "before" ? "--" : participantAmount }}
            </el-descriptions-item>
            <el-descriptions-item>
              <template slot="label">
                <font-awesome-icon icon="fa-solid fa-list" fixed-width></font-awesome-icon>
                题目数
              </template>
              {{ problemAmount === 0 ? "--" : problemAmount }}
            </el-descriptions-item>
          </el-descriptions>
          <h3>比赛名<b style="color: #F56C6C">*</b></h3>
          <el-input type="text" v-model="name" placeholder="比赛名" maxlength="40" show-word-limit
                    style="width: 45%; margin: 15px 15px 25px" :readonly="status === 'after'"></el-input>
          <h3>比赛类型</h3>
          <div style="margin: 15px 15px 25px">
            <el-radio-group v-model="type" :disabled="status === 'after'">
              <el-radio label="COMP">竞赛</el-radio>
              <el-radio label="PRAC">练习</el-radio>
            </el-radio-group>
          </div>
          <h3>比赛描述</h3>
          <mavon-editor v-model="description" :toolbars="toolbars" :xssOptions="{}" :autofocus="false"
                        :editable="status !== 'after'" style="margin: 15px; min-height: 400px"></mavon-editor>
          <h3 style="margin-top: 30px">参赛设置</h3>
          <div style="margin: 15px">
            <el-switch v-model="passwordSet" active-text="需要密码" style="height: 40px"
                       :disabled="status === 'after'"></el-switch>
            <el-input v-if="passwordSet" v-loading="passwordLoading" type="text" placeholder="密码：6到16位的数字或字母" v-model="password"
                      :readonly="status === 'after'" style="margin: 0 10px; height: 40px; width: 25%"></el-input>
          </div>
          <div style="text-align: right">
            <el-tooltip placement="top" :disabled="status === 'before'">
              <template #content>
                <span v-if="status === 'ongoing'">
                  比赛进行中，无法修改题目列表
                </span>
                <span v-if="status === 'after'">
                  比赛已结束，无法修改题目列表
                </span>
              </template>
              <div style="display: inline-block; margin: 10px;">
                <el-button type="warning" size="medium" plain @click="activeName = 'problemList'"
                           :disabled="status !== 'before'">
                  <font-awesome-icon icon="fa-solid fa-list"></font-awesome-icon>
                  题目配置
                </el-button>
              </div>
            </el-tooltip>
            <el-tooltip placement="top" :disabled="status !== 'after'">
              <template #content>
                比赛已结束，无法修改比赛信息
              </template>
              <div style="display:inline-block; margin: 10px 20px 10px 10px">
                <el-button type="primary" size="medium" plain @click="updateContest" :disabled="status === 'after'">
                  <font-awesome-icon icon="fa-solid fa-floppy-disk" fixed-width></font-awesome-icon>
                  保存
                </el-button>
              </div>
            </el-tooltip>
          </div>
        </el-tab-pane>
        <el-tab-pane label="题目列表" name="problemList" :disabled="status !== 'before'">
          <el-row type="flex">
            <el-col :span="13">
              <h3>
                我的题目
                <el-input placeholder="题号/题目名" v-model="key" clearable size="medium" style="width: 50%"
                          maxlength="40">
                </el-input>
                <el-button type="primary" plain size="medium" @click="update" style="margin-left: 2%"
                           :disabled="problemListLoading">
                  <font-awesome-icon icon="fa-solid fa-magnifying-glass" fixed-width></font-awesome-icon>
                  搜索
                </el-button>
                <el-button type="text" @click="update" style="margin-left: 20px" :disabled="problemListLoading">
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
                    <el-button type="danger" plain size="medium" style="margin-left: 2%"
                               :disabled="selectedProblemEntries.length === 0">
                      <font-awesome-icon icon="fa-solid fa-trash-can" fixed-width></font-awesome-icon>
                      清空
                    </el-button>
                  </template>
                </el-popconfirm>
              </h3>
              <el-card v-loading="selectedProblemListLoading" style="margin: 15px"
                       body-style="padding-top: 5px; padding-bottom: 5px">
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
            <el-button type="primary" size="medium" style="margin: 10px 20px" plain @click="updateContest"
                       :disabled="status !== 'before'">
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
import {mavonEditor} from "mavon-editor";
import 'mavon-editor/dist/css/index.css'
import axios from "@/utils/axios";
import draggable from 'vuedraggable'

export default {
  name: "ContestEditView",
  props: ["id"],
  components: {
    mavonEditor,
    draggable
  },
  data: function () {
    return {
      loading: false,
      passwordLoading: false,
      selectedProblemListLoading: false,
      problemListLoading: false,
      openContestLoading: false,
      saved: false,
      activeName: "contestDetail",
      statusBgColor: "",
      statusColor: "",
      showUpdateTimeDialog: false,
      showUpdateEndTimeDialog: false,
      showResetContestDialog: false,
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
        imagelink: false, // 图片链接
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
      authorId: null,
      authorUsername: "",
      name: "",
      type: "COMP",
      pickedTime: null,
      pickedEndtime: null,
      startTime: null,
      endTime: null,
      current: null,
      timer: null,
      status: "before",
      description: "",
      problemAmount: null,
      participantAmount: null,
      passwordSet: false,
      password: "",
      open: false,
      key: "",
      showPrivate: false,
      showHidden: true,
      showPublic: false,
      problemEntries: [],
      selectedProblemEntries: [],
      selectedProblemIds: new Set(),
    }
  },
  computed: {
    statusTagType: function () {
      if (this.status === "before") {
        return ""
      } else if (this.status === "after") {
        return "info"
      } else {
        return "success"
      }
    },
    statusTagText: function () {
      if (this.status === "before") {
        return "未开始"
      } else if (this.status === "after") {
        if(this.open) {
          return "已结束 (已开放)"
        } else {
          return "已结束 (未开放)"
        }
      } else {
        return "进行中"
      }
    },
    statusTipText: function () {
      if (this.status === "before") {
        return "距离比赛开始还有：" + this.formatTimeInterval(this.startTime - this.current)
      } else if (this.status === "after") {
        if(this.open) {
          return "比赛已结束且已开放"
        } else {
          return "比赛已结束但未开放"
        }
      } else {
        return "距离比赛结束还有：" + this.formatTimeInterval(this.endTime - this.current)
      }
    },
  },
  methods: {
    update: function () {
      this.problemListLoading = true
      axios.get("/problemEntries/users/" + this.$root.loginStatus.userid + "/all", {
        params: {
          "key": this.key,
          "showPrivate": this.showPrivate,
          "showHidden": this.showHidden,
          "showPublic": this.showPublic,
        }
      }).then((response) => {
        this.problemEntries = response.data
        this.problemListLoading = false
      }).catch((error) => {
        this.problemListLoading = false
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
    formatTimeInterval: function (interval) {
      let result = ""
      if (interval > 24 * 60 * 60 * 1000) {
        result += Math.floor(interval / (24 * 60 * 60 * 1000)).toString() + "天 "
        interval %= 24 * 60 * 60 * 1000
      }
      result += Math.floor(interval / (60 * 60 * 1000)).toString() + "时 "
      interval %= 60 * 60 * 1000
      result += Math.floor(interval / (60 * 1000)).toString() + "分 "
      interval %= 60 * 1000
      result += Math.floor(interval / 1000).toString() + "秒"
      return result
    },
    updateStatus: function () {
      this.current = new Date()
      if (this.current < this.startTime) {
        this.status = "before"
        this.statusBgColor = "rgb(236,245,255)"
        this.statusColor = "#409EFF"
      } else if (this.current >= this.endTime) {
        this.status = "after"
        this.statusBgColor = "rgb(244,244,245)"
        this.statusColor = "#909399"
      } else {
        this.status = "ongoing"
        this.statusBgColor = "rgb(240,249,235)"
        this.statusColor = "#67C23A"
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
    backToContest: function () {
      this.$router.replace("/contest/" + this.id)
    },
    updateOngoingContest: function () {
      axios.patch("/contests/" + this.id + "/detail", {
        "name": this.name,
        "type": this.type,
        "description": this.description,
        "passwordSet": this.passwordSet,
        "password": this.password,
      }).then(() => {
        this.$message.success("比赛编辑成功")
        this.saved = true
        this.backToContest()
      }).catch((error) => {
        this.$message.error(error.response.data)
      })
    },
    updateBeforeContest: function () {
      let problemIds = []
      for (let problemEntry of this.selectedProblemEntries) {
        problemIds.push(problemEntry.id)
      }
      axios.patch("/contests/" + this.id + "/detail", {
        "name": this.name,
        "type": this.type,
        "description": this.description,
        "passwordSet": this.passwordSet,
        "password": this.password,
      }).then(() => {
        axios.post("/contests/" + this.id + "/problems", {
          "problemIds": problemIds
        }).then(() => {
          this.$message.success("比赛编辑成功")
          this.saved = true
          this.backToContest()
        }).catch((error) => {
          this.$message.error(error.response.data)
          this.saved = true
          this.backToContest()
        })
      }).catch((error) => {
        this.$message.error(error.response.data)
      })
    },
    updateContest: function () {
      if (this.name === "") {
        this.$message.error("比赛名不能为空")
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
      if (this.status === "before") {
        if (this.selectedProblemEntries.length === 0) {
          this.$confirm('该比赛尚未配置题目列表，是否继续创建？', '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            this.updateBeforeContest()
          })
        } else {
          this.updateBeforeContest()
        }
      } else {
        this.updateOngoingContest()
      }
    },
    updateTime: function () {
      if(this.pickedTime === null) {
        this.$message.error("比赛时间不能为空")
      } if (this.pickedTime[0].getTime() - new Date().getTime() < (4 * 60 + 30) * 1000) {
        this.$message.error("比赛开始时间必须至少在当前时间的5分钟之后")
      } else if (this.pickedTime[0] >= this.pickedTime[1]) {
        this.$message.error("比赛结束时间必须在开始时间之后")
      } else {
        axios.patch("/contests/" + this.id + "/time", {
          "startTime": this.pickedTime[0],
          "endTime": this.pickedTime[1]
        }).then(() => {
          this.showUpdateTimeDialog = false
          this.startTime = this.pickedTime[0]
          this.endTime = this.pickedTime[1]
          this.$message.success("比赛时间修改成功")
        }).catch((error) => {
          this.$message.error(error.response.data)
        })
      }
    },
    updateEndTime: function () {
      if(this.pickedEndtime === null) {
        this.$message.error("比赛结束时间不能为空")
      } else if (this.pickedEndtime.getTime() - new Date().getTime() < (4 * 60 + 30) * 1000) {
        this.$message.error("比赛结束时间必须至少在当前时间的5分钟之后")
      } else {
        axios.patch("/contests/" + this.id + "/endTime", {
          "endTime": this.pickedEndtime
        }).then(() => {
          this.showUpdateEndTimeDialog = false
          this.endTime = this.pickedEndtime
          this.$message.success("比赛结束时间修改成功")
        }).catch((error) => {
          this.$message.error(error.response.data)
        })
      }
    },
    resetContest: function () {
      if(this.pickedTime === null) {
        this.$message.error("比赛时间不能为空")
      } if (this.pickedTime[0].getTime() - new Date().getTime() < (4 * 60 + 30) * 1000) {
        this.$message.error("比赛开始时间必须至少在当前时间的5分钟之后")
      } else if (this.pickedTime[0] >= this.pickedTime[1]) {
        this.$message.error("比赛结束时间必须在开始时间之后")
      } else {
        axios.post("/contests/" + this.id + "/reset", {
          "startTime": this.pickedTime[0],
          "endTime": this.pickedTime[1]
        }).then(() => {
          this.showUpdateTimeDialog = false
          this.$message.success("比赛重置成功")
          this.saved = true
          this.backToContest()
        }).catch((error) => {
          this.$message.error(error.response.data)
        })
      }
    },
    openContest: function () {
      this.$confirm('此操作将开放比赛，开放后将无法取消开放或修改比赛时间(可重置比赛)，用户可以继续参赛或提交，但不会改变排行榜, 是否继续?', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.openContestLoading = true
        axios.post("/contests/" + this.id + "/open")
            .then(() => {
              this.openContestLoading = false
              this.$message.success('开放比赛成功')
              this.open = true
            }).catch((error) => {
          this.openContestLoading = false
          this.$message.error(error.response.data)
        })
      })
    },
    deleteContest: function () {
      this.$confirm('此操作将永久删除该比赛及其参赛记录和提交记录, 是否继续?', '确认信息', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true
        axios.delete("/contests/" + this.id)
            .then(() => {
              this.loading = false
              this.$message.success("比赛删除成功")
              this.saved = true
              this.$router.replace("/user/" + this.$root.loginStatus.userid + "/contest/list")
            }).catch((error) => {
          this.loading = false
          this.$message.error(error.response.data)
        })
      })
    }
  },
  beforeRouteLeave: function (to, from, next) {
    if (this.saved) {
      next()
    } else {
      this.$confirm('可能存在尚未保存内容，是否继续离开？', '确认信息', {
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
    this.loading = true
    axios.get("/contests/" + this.id)
        .then((response) => {
          this.authorId = response.data.authorId
          this.authorUsername = response.data.authorUsername
          this.name = response.data.name
          this.type = response.data.type
          this.startTime = new Date(response.data.startTime)
          this.endTime = new Date(response.data.endTime)
          this.updateStatus()
          this.timer = setInterval(this.updateStatus, 500)
          this.description = response.data.description
          this.problemAmount = response.data.problemAmount
          this.participantAmount = response.data.participantAmount
          this.passwordSet = response.data.passwordSet
          this.open = response.data.open
          this.loading = false
          if (this.passwordSet) {
            this.passwordLoading = true
            axios.get("/contests/" + this.id + "/password")
                .then((response) => {
                  this.password = response.data
                  this.passwordLoading = false
                }).catch((error) => {
              this.$message.error(error.response.data)
              this.passwordLoading = false
            })
          }
        }).catch((error) => {
      this.$message.error(error.response.data)
      this.loading = false
    })
    this.selectedProblemListLoading = true
    axios.get("/contests/" + this.id + "/problemEntries")
        .then((response) => {
          this.selectedProblemEntries = response.data
          for (let problemEntry of this.selectedProblemEntries) {
            this.selectedProblemIds.add(problemEntry.id)
          }
          this.selectedProblemListLoading = false
        }).catch((error) => {
      this.$message.error(error.response.data)
      this.selectedProblemListLoading = false
    })
    this.update();
  },
  destroyed: function () {
    clearInterval(this.timer)
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


.title-div {
  padding: 5px;
  font-size: medium;
}

.description-div {
  padding: 5px;
  font-size: small;
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