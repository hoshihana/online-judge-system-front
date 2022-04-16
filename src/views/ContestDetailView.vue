<template>
  <div>
    <el-card>
      <template #header>
        <el-row type="flex" align="middle">
          <el-col :span="18">
            <el-tag class="status-tag" :type="statusTagType">{{ statusTagText }}</el-tag>
            <b v-if="status !== 'after'" style="margin-left: 10px; font-size: x-large; vertical-align: middle">
              距离比赛{{status === 'before' ? '开始' : '结束'}}还有：
              <ScrollNumber v-if="statusDay > 0" :value="statusDay" :itemStyle="scrollNumberStyle" style="vertical-align: top"></ScrollNumber>{{statusDay > 0 ? '天' : ''}}&nbsp;
              <ScrollNumber :value="statusHour" :itemStyle="scrollNumberStyle" style="vertical-align: top"></ScrollNumber>时&nbsp;
              <ScrollNumber :value="statusMinute" :itemStyle="scrollNumberStyle" style="vertical-align: top"></ScrollNumber>分&nbsp;
              <ScrollNumber :value="statusSecond" :itemStyle="scrollNumberStyle" style="vertical-align: top"></ScrollNumber>秒&nbsp;
            </b>
          </el-col>
          <el-col :span="6" style="text-align: right">
            <router-link class="el-link el-link--primary" style="font-size: medium" :to="'/user/' + contest.authorId" target="_blank">{{contest.authorUsername}}</router-link>
            <el-tag size="mini" style="margin-left: 10px">作者</el-tag>
          </el-col>
        </el-row>
      </template>
      <mavon-editor class="preview" :value="contest.description" :box-shadow="false" previewBackground="#ffffff"
                    :subfield="false" default-open="preview" :toolbars-flag="false" :short-cut="false"></mavon-editor>
    </el-card>
  </div>
</template>

<script>
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
  name: "ContestDetailView",
  props: ["id"],
  inject: ["contest"],
  components: {
    mavonEditor
  },
  data: function () {
    return {
      current: null,
      timer: null,
      status: "before",
      scrollNumberStyle: {
        'font-size': '35px'
      },
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
        return "比赛未开始"
      } else if (this.status === "after") {
        return "比赛已结束"
      } else {
        return "比赛进行中"
      }
    },
    statusDay: function () {
      if(this.status === 'before') {
        return Math.floor((this.contest.startTime - this.current) / (24 * 60 * 60 * 1000))
      }
      if(this.status === 'ongoing') {
        return Math.floor((this.contest.endTime - this.current) / (24 * 60 * 60 * 1000))
      }
      return 0
    },
    statusHour: function () {
      if(this.status === 'before') {
        return Math.floor((this.contest.startTime - this.current) % (24 * 60 * 60 * 1000) / (60 * 60 * 1000))
      }
      if(this.status === 'ongoing') {
        return Math.floor((this.contest.endTime - this.current) % (24 * 60 * 60 * 1000) / (60 * 60 * 1000))
      }
      return 0
    },
    statusMinute: function () {
      if(this.status === 'before') {
        return Math.floor((this.contest.startTime - this.current) % (60 * 60 * 1000) / (60 * 1000))
      }
      if(this.status === 'ongoing') {
        return Math.floor((this.contest.endTime - this.current) % (60 * 60 * 1000) / (60 * 1000))
      }
      return 0
    },
    statusSecond: function () {
      if(this.status === 'before') {
        return Math.floor((this.contest.startTime - this.current) % (60 * 1000) / 1000)
      }
      if(this.status === 'ongoing') {
        return Math.floor((this.contest.endTime - this.current) % (60 * 1000) / 1000)
      }
      return 0
    },
  },
  methods: {
    updateStatus: function () {
      this.current = new Date()
      if (this.current < this.contest.startTime) {
        this.status = "before"
      } else if (this.current >= this.contest.endTime) {
        this.status = "after"
      } else {
        this.status = "ongoing"
      }
    },
  },
  mounted: function () {
    this.updateStatus()
    this.timer = setInterval(this.updateStatus, 500)
  },
  destroyed: function () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped>
.status-tag {
  vertical-align: center;
  padding: 0;
  width: 140px;
  height: 50px;
  font-size: large;
  text-align: center;
  line-height: 50px;
}
</style>