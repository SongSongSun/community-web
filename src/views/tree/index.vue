<template>
  <div>
    <el-card>
      <editor-bar v-model="detail" :is-clear="isClear" @change="change" />
    </el-card>
  </div>
</template>

<script>

import EditorBar from '../../components/WangUE'
export default {
  name: 'Tree',
  components: { EditorBar },
  data() {
    return {
      isClear: false,
      detail: ''
    }
  },

  methods: {
    change(val) {
      console.log(this.detail)
    }
  }
}
</script>

