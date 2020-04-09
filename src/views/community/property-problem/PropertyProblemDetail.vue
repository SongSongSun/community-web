<template>
  <div class="app-container operator-segment">
    <el-card class="box-card">
      <span>物业问题</span>
      <div class="text item">
        <el-form :model="problem">
          <el-form-item label="问题描述">
            <el-input v-model="problem.problemDescription" readonly />
          </el-form-item>
          <el-form-item label="问题详情">
            <el-input v-model="problem.problemDetail" type="textarea" readonly />
          </el-form-item>
        </el-form>
        <div class="demo-image__lazy">
          <span style="font-size: 14px;font-weight: bold;color: #606266">图片</span>
          <div v-if="problemImgUrlList.length > 0" style="margin-top: 10px">
            <el-image
              v-for="(img,index) in problemImgUrlList"
              :key="index"
              style="width: 200px; height: 200px;margin-left: 10px"
              :src="img"
              :preview-src-list="problemImgUrlList"
            />
          </div>
          <div v-if="problemImgUrlList.length <= 0">
            <span>用户未上传图片</span>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="box-card">
      <span>报修人信息</span>
      <div>
        <el-form :model="reportUser">
          <el-form-item label="姓名">
            <el-input v-model="reportUser.name" readonly />
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="reportUser.phone" readonly />
          </el-form-item>
          <el-form-item label="住址">
            <el-input v-model="reportUser.addr" readonly />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>

import { getPropertyProblemImgById, getReportUserInfoById } from '../../../api/community'

export default {
  name: 'PropertyProblemDetail',
  data() {
    return {
      problem: this.$route.query.problem,
      problemImgUrlList: [],
      reportUser: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      getPropertyProblemImgById({ problemId: this.problem.id }).then(response => {
        const problemImgList = response.data
        for (const obj of problemImgList) {
          this.problemImgUrlList.push(obj.imgAddr)
        }
      })
      getReportUserInfoById({ problemId: this.problem.id }).then(response => {
        this.reportUser = response.data
      })
    }
  }

}
</script>
