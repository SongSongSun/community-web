<template>
  <div class="app-container">
    <el-form :label-position="left" label-width="80px" :model="communityNews">
      <el-card shadow="always">
        <el-form-item label="新闻标题">
          <el-input v-model="communityNews.title" readonly />
        </el-form-item>
      </el-card>
      <el-card shadow="always">
        <div slot="header">
          <span>新闻内容</span>
        </div>
        <editor-bar v-model="communityNews.content" :is-clear="isClear" @change="change" />
      </el-card>
    </el-form>
  </div>
</template>

<script>

import EditorBar from '../../../components/WangUE'
import { createCommunityNews } from '../../../api/community'
import { Notification } from 'element-ui'
export default {
  name: 'CommunityNewsDetail',
  components: { EditorBar },
  data() {
    return {
      isClear: false,
      communityNews: this.$route.query.communityNews
    }
  },

  methods: {
    change(val) {
      console.log(this.communityNews.content)
    }
  }
}
</script>

