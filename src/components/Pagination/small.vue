<template>
  <el-pagination
    layout="prev, pager, next"
    :total="list.length"
    :page-size="pageSize"
    :hide-on-single-page="true"
    @current-change="handleCurrentChange"
  />
</template>

<script>
export default {
  name: 'SmallPagination',
  props: {
    list: {
      required: true,
      type: Array
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  methods: {
    handleCurrentChange(page) {
      const arr = this.list.slice(this.pageSize * (page - 1), this.pageSize * page)
      this.$emit('pagination', arr)
    }
  }
}
</script>
