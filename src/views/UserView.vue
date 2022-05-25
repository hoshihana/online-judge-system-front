<template>
  <div>
    <el-container>
      <el-header height="auto" style="padding-left: 0; padding-right: 0">
        <el-card v-loading="loading" body-style="padding: 0">
          <el-row style="padding: 20px" class="user-card" type="flex">
            <el-col :span="12" style="display: flex; align-items: center; text-align: left;">
              <el-avatar v-loading="avatarLoading" v-html="avatarSvg" class="avatar" :size="100">
              </el-avatar>
              <el-avatar v-if="!avatarLoading && isSelf" class="avatar-mask" :size="100" icon="el-icon-camera"
                         @click.native="showChangeAvatarDialog = true">
              </el-avatar>
              <el-dialog :visible.sync="showChangeAvatarDialog" width="400px" :destroy-on-close="true"
                         @open="newAvatar = account.avatar">
                <template #title>
                  <font-awesome-icon icon="fa-solid fa-camera" fixed-width></font-awesome-icon>
                  更换头像
                </template>
                <div style="margin: 0 15px; text-align: center">
                  <el-avatar v-html="newAvatarSvg" class="avatar" :size="175">
                  </el-avatar>
                  <el-row style="margin: 30px 0 10px">
                    <el-col :span="18" style="text-align: left; font-size: small; color: #909399">随便输入点什么来生成你独一无二的头像
                    </el-col>
                    <el-col :span="6" style="text-align: right">
                      <el-button type="text" style="padding: 0; min-height: 0" @click="newAvatar = $randimals()">
                        <font-awesome-icon icon="fa-solid fa-dice" fixed-width></font-awesome-icon>
                        随机
                      </el-button>
                    </el-col>
                  </el-row>
                  <el-input v-model="newAvatar" placeholder="随便输入点什么吧~" :clearable="true" maxlength="40"
                            show-word-limit></el-input>
                </div>
                <template #footer>
                  <div>
                    <el-button size="medium" plain @click="showChangeAvatarDialog = false">取消</el-button>
                    <el-button type="primary" size="medium" plain @click="changeAvatar">确定</el-button>
                  </div>
                </template>
              </el-dialog>
              <div style="margin-left: 20px">
                <div style="display: flex; align-items: center; margin-bottom: 10px">
                  <b style="font-size: x-large">{{ account.username }} </b>
                  <el-tag v-if="account.role === 'ADMIN'" size="small" style="margin-left: 10px">管理员</el-tag>
                  <el-tag v-else type="info" size="small" style="margin-left: 10px">普通用户</el-tag>
                </div>
                <div>
                  <span style="font-size: small">{{ account.school || '' }} </span>
                  <el-button v-if="isSelf" type="text" style="padding: 0; min-height: 0"
                             @click="showEditSchoolDialog = true" :disabled="schoolLoading">
                    <font-awesome-icon icon="fa-solid fa-pen-to-square"></font-awesome-icon>
                    {{ account.school === null || account.school === "" ? "填写学校" : "" }}
                  </el-button>
                  <el-dialog :visible.sync="showEditSchoolDialog" width="500px" :destroy-on-close="true"
                             @open="newSchool = account.school || ''">
                    <template #title>
                      <font-awesome-icon icon="fa-solid fa-pen" fixed-width></font-awesome-icon>
                      编辑学校名称
                    </template>
                    <div style="margin: 0 15px;">
                      <div style="font-size: small; color: #909399; margin-bottom: 10px">请输入所在学校的名称，可以为空</div>
                      <el-input v-model="newSchool" placeholder="学校名称" :clearable="true" maxlength="40"
                                show-word-limit></el-input>
                    </div>
                    <template #footer>
                      <div>
                        <el-button size="medium" plain @click="showEditSchoolDialog = false">取消</el-button>
                        <el-button type="primary" size="medium" plain @click="editSchool">确定</el-button>
                      </div>
                    </template>
                  </el-dialog>
                </div>
              </div>
            </el-col>
            <el-col :span="12" style="position: relative;">
              <div style="position: absolute; bottom: 0; right: 0; color: #606266; font-size: small">
                <div class="account-status">
                  <span style="line-height: 2">通过题目</span><br>
                  <b>{{ account.passedProblemAmount }}</b>
                </div>
                <div class="vertical-divider"></div>
                <div class="account-status">
                  <span style="line-height: 2">尝试题目</span><br>
                  <b>{{ account.triedProblemAmount }}</b>
                </div>
                <template v-if="account.role === 'ADMIN'">
                  <div class="vertical-divider"></div>
                  <div class="account-status" :class="{'pointer-number': isSelf}" @click="clickOwnedProblemAmount">
                    <span style="line-height: 2">创建题目</span><br>
                    <b>{{ account.ownedProblemAmount }}</b>
                  </div>
                  <div class="vertical-divider"></div>
                  <div class="account-status"  :class="{'pointer-number': isSelf}" @click="clickOwnedContestAmount">
                    <span style="line-height: 2">创建比赛</span><br>
                    <b>{{ account.ownedContestAmount }}</b>
                  </div>
                </template>
                <template v-if="account.role === 'USER'">
                  <div class="vertical-divider"></div>
                  <div class="account-status">
                    <span style="line-height: 2">参加比赛</span><br>
                    <b>{{ account.participatedContestAmount }}</b>
                  </div>
                </template>
              </div>
            </el-col>
          </el-row>
          <el-row style="padding: 0 10px">
            <el-menu :default-active="$route.fullPath" mode="horizontal" router active-text-color="#409EFF"
                     text-color="#606266">
              <el-menu-item :index="basePath">主页</el-menu-item>
              <el-menu-item v-if="isSelf && isAdmin" :index="basePath + '/problem/list'">我的题目</el-menu-item>
              <el-menu-item v-if="isSelf && isAdmin" :index="basePath + '/contest/list'">我的比赛</el-menu-item>
              <el-menu-item v-if="isSelf" :index="basePath + '/password'">修改密码</el-menu-item>
            </el-menu>
          </el-row>
        </el-card>
      </el-header>
      <el-main style="padding-left: 0; padding-right: 0">
        <router-view :key="this.$route.path"></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import axios from "@/utils/axios";

export default {
  name: "UserView",
  props: ["id"],
  data: function () {
    return {
      showChangeAvatarDialog: false,
      showEditSchoolDialog: false,
      newAvatar: "",
      loading: false,
      avatarLoading: false,
      schoolLoading: false,
      newSchool: "",
      account: {
        id: null,
        username: null,
        email: null,
        role: null,
        avatar: null,
        school: null,
        profile: null,
        passedProblemAmount: null,
        triedProblemAmount: null,
        participatedContestAmount: null,
        ownedProblemAmount: null,
        ownedContestAmount: null,
      },
    }
  },
  provide: function () {
    return {
      account: this.account
    }
  },
  computed: {
    isSelf: function () {
      return parseInt(this.id) === this.$root.loginStatus.userid
    },
    isAdmin: function () {
      return "ADMIN" === this.$root.loginStatus.role
    },
    basePath: function () {
      return "/user/" + this.id;
    },
    avatarSvg: function () {
      return this.$multiavatar(this.account.avatar)
    },
    newAvatarSvg: function () {
      return this.$multiavatar(this.newAvatar)
    }
  },
  methods: {
    changeAvatar: function () {
      if (this.newAvatar === "") {
        this.$message.error("输入内容不能为空")
        return
      }
      this.showChangeAvatarDialog = false
      this.avatarLoading = true
      axios.patch("/accounts/avatar", {
        "avatar": this.newAvatar
      }).then(() => {
        this.$message.success("头像修改成功");
        this.avatarLoading = false
        this.account.avatar = this.newAvatar
      }).catch((error) => {
        this.$message.error(error.response.data)
        this.avatarLoading = false
      })
    },
    editSchool: function () {
      this.showEditSchoolDialog = false
      this.schoolLoading = true
      axios.patch("/accounts/school", {
        "school": this.newSchool
      }).then(() => {
        this.$message.success("学校编辑成功");
        this.schoolLoading = false
        this.account.school = this.newSchool
      }).catch((error) => {
        this.$message.error(error.response.data)
        this.schoolLoading = false
      })
    },
    clickOwnedProblemAmount: function () {
      if(this.isSelf) {
        this.$router.push("/user/" + this.id + "/problem/list")
      }
    },
    clickOwnedContestAmount: function () {
      if(this.isSelf) {
        this.$router.push("/user/" + this.id + "/contest/list")
      }
    }
  },
  mounted: function () {
    this.loading = true
    axios.get("/accounts/" + this.id).then((response) => {
      this.account.id = response.data.id
      this.account.username = response.data.username
      this.account.email = response.data.email
      this.account.role = response.data.role
      this.account.avatar = response.data.avatar
      this.account.school = response.data.school
      this.account.profile = response.data.profile
      this.account.passedProblemAmount = response.data.passedProblemAmount
      this.account.triedProblemAmount = response.data.triedProblemAmount
      this.account.participatedContestAmount = response.data.participatedContestAmount
      this.account.ownedProblemAmount = response.data.ownedProblemAmount
      this.account.ownedContestAmount = response.data.ownedContestAmount
      this.loading = false
    }).catch((error) => {
      this.$message.error(error.response.data)
    })
  }
}
</script>

<style scoped>
.user-card {
  background-image: linear-gradient(to top, #fff1eb 0%, #ace0f9 100%);
}

::v-deep .el-menu-item:hover {
  outline: 0 !important;
  color: #409EFF !important;
}

.avatar {
  border: #fff1eb 2px solid;
}

.avatar-mask {
  border: #fff1eb 2px solid;
  position: absolute;
  top: 20px;
  left: 20px;
  opacity: 0;
  cursor: pointer;
}

.avatar-mask {
  border: #fff1eb 2px solid;
  position: absolute;
  top: 20px;
  left: 20px;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.5s;
  -moz-transition: opacity 0.5s; /* Firefox 4 */
  -webkit-transition: opacity 0.5s; /* Safari 和 Chrome */
  -o-transition: opacity 0.5s; /* Opera */
}

.avatar-mask:hover {
  opacity: 80%;
}

.vertical-divider {
  display: inline-block;
  width: 0;
  height: 40px;
  border-left: 2px dashed #a8a8a8;
}

.account-status {
  display: inline-block;
  text-align: center;
  padding: 0 10px
}

.pointer-number {
  cursor: pointer;
}

</style>