<template>
  <div class="app-container">
    <el-form :label-position="left" label-width="80px" :model="communityNews">
      <el-card shadow="always">
        <el-form-item label="新闻标题">
          <el-input v-model="communityNews.title" />
        </el-form-item>
      </el-card>
      <el-card shadow="always">
        <div slot="header">
          <span>新闻内容</span>
        </div>
        <editor-bar v-model="communityNews.content" :is-clear="isClear" @change="change" />
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="$router.push({name:'CommunityNewsManage'})">返回</el-button>
        </el-form-item>
      </el-card>
    </el-form>
  </div>
</template>

<script>

import EditorBar from '../../../components/WangUE'
import { createCommunityNews } from '../../../api/community'
import { Notification } from 'element-ui'
export default {
  name: 'CreateCommunityNews',
  components: { EditorBar },
  data() {
    return {
      isClear: false,
      communityNews: {
        title: undefined,
        content: ''
      }
    }
  },

  methods: {
    change(val) {
      console.log(this.communityNews.content)
    },
    onSubmit() {
      createCommunityNews(this.communityNews).then(response => {
        if (response.code === 200) {
          Notification.success('创建成功')
          this.$router.push({ name: 'CommunityNewsManage' })
        }
      }).catch(e => {
        Notification.error(e.message)
      })
    }
  }
}
</script>

