<template>
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layoutD"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <el-button :disabled="lastPageBtnDisabled" icon="el-icon-ali-right" class="first-pager pageButton" @click="toLastPage" ></el-button>
    </el-pagination>
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    >
      <el-button :disabled="firstPageBtnDisabled"  icon="el-icon-ali-left" class="last-pager pageButton" @click="toFirstPage"></el-button>
    </el-pagination>
  </div>
</template>

<script>
import { scrollTo } from '../../utils/scroll-to'

export default {
  name: 'Pagination',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 50, 100, 200, 500]
      }
    },
    layout: {
      type: String,
      default: 'total,slot,prev'
    },
    layoutD: {
      type: String,
      default: 'pager,next,slot,sizes,jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      firstPageBtnDisabled: true,
      lastPageBtnDisabled: true,
      lastPageNum: 0
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  watch: {
    total(newVal, oldVal) {
      this.lastPageNum = Math.ceil(newVal / this.pageSize)
      if (this.lastPageNum > 1) {
        this.lastPageBtnDisabled = false
      }
    },
    pageSize(val) {
      this.lastPageNum = Math.ceil(this.total / this.pageSize)
      if (this.lastPageNum > 1) {
        this.lastPageBtnDisabled = false
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.lastPageNum = Math.ceil(this.total / val)
      console.info(this.lastPageNum)
      if (this.lastPageNum < 2) {
        this.lastPageBtnDisabled = true
      }
      this.$emit('pagination', { current: this.currentPage, size: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.disabledFun(val)
      this.$emit('pagination', { current: val, size: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    toFirstPage() {
      this.currentPage = 1
      this.handleCurrentChange(1)
    },
    toLastPage() {
      this.currentPage = this.lastPageNum
      this.disabledFun(this.lastPageNum)
      this.handleCurrentChange(this.lastPageNum)
    },
    disabledFun(val) {
      if (this.total > 0) {
        if (val === 1) {
          this.firstPageBtnDisabled = true
        } else {
          this.firstPageBtnDisabled = false
        }
        if (val === this.lastPageNum) {
          this.lastPageBtnDisabled = true
        } else {
          this.lastPageBtnDisabled = false
        }
      } else {
        this.lastPageBtnDisabled = true
        this.firstPageBtnDisabled = true
      }
    }

  }
}
</script>

<style lang="scss" scoped>
  @import "../../styles/variables.scss";

  .pagination-container {
    background-color: #fdfdfe;
    padding: 21px 0px;
    text-align: right;
  }

  .pagination-container.hidden {
    display: none;
  }
  .el-pagination {
    float: right;
  }
  .pageButton{
    min-width: 32px;
    min-height: 32px;
    margin-left: 4px;
    margin-right: 4px;
    background-color: #fff;
    border: solid 1px #d9d9d9;
    border-radius: 4px;
    font-size: 16px;
    font-weight: normal;
  }
</style>
