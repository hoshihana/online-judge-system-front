<template>
  <div>
    <el-card v-loading="account.profile === null || loading" body-style="padding: 2px 0 0 0">
      <template #header>
        <el-row align="middle" type="flex">
          <el-col :span="12" style="text-align: left; color: #909399;">
            个人简介
          </el-col>
          <el-col :span="12" style="text-align: right">
            <el-button v-if="isSelf && !editing" type="primary" size="medium" plain style="margin-right: 20px"
                       @click="editProfile">
              <font-awesome-icon icon="fa-solid fa-pen-to-square" fixed-width></font-awesome-icon>
              编辑
            </el-button>
            <el-button v-if="isSelf && editing" size="medium" plain style="margin-right: 20px" @click="cancelEditProfile">
              <font-awesome-icon icon="fa-solid fa-xmark" fixed-width></font-awesome-icon>
              取消
            </el-button>
            <el-button v-if="isSelf && editing" type="primary" size="medium" plain style="margin-right: 20px" @click="saveEditProfile">
              <font-awesome-icon icon="fa-solid fa-floppy-disk" fixed-width></font-awesome-icon>
              保存
            </el-button>
          </el-col>
        </el-row>
      </template>
      <mavon-editor v-if="!editing" style="min-height: 600px; border: none" :value="account.profile" :box-shadow="false" previewBackground="#ffffff"
                    :subfield="false" default-open="preview" :toolbars-flag="false" :short-cut="false"></mavon-editor>
      <mavon-editor v-else v-model="newProfile" :toolbars="toolbars" :xssOptions="{}" :autofocus="false" style="min-height: 600px"></mavon-editor>
    </el-card>
  </div>
</template>

<script>
import {mavonEditor} from "mavon-editor";
import 'mavon-editor/dist/css/index.css'
import axios from "@/utils/axios";

export default {
  name: "UserHomeView",
  props: ["id"],
  inject: ["account"],
  components: {
    mavonEditor
  },
  data: function () {
    return {
      loading: false,
      editing: false,
      newProfile: "",
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
        imagelink: true, // 图片链接 todo 实现图片上传功能
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
    }
  },
  methods: {
    editProfile: function() {
      this.newProfile = this.account.profile
      this.editing = true
    },
    cancelEditProfile: function () {
      this.newProfile = ""
      this.editing = false
    },
    saveEditProfile: function () {
      this.loading = true
      this.editing = false
      axios.patch("/accounts/profile", {
        "profile": this.newProfile
      }).then(() => {
        this.$message.success("个人简介编辑成功")
        this.account.profile = this.newProfile
        this.loading = false
      }).catch((error) => {
        this.$message.error(error.response.data)
        this.loading = false
        this.newProfile = ""
      })
    }
  },
  computed: {
    isSelf: function () {
      return parseInt(this.id) === this.$root.loginStatus.userid
    }
  }
}
</script>

<style scoped>

</style>