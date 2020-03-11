<template>
  <div class="app-container operator-segment">
    <collapse>
      <div slot="controls" class="btn-item" style="display: inline-block">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="addNoticeKey"
        >新建
        </el-button>
        <el-button
          icon="el-icon-delete"
          @click="batchDelete"
        >删除
        </el-button>
      </div>
      <el-form
        slot="content"
        :inline="true"
        :model="listQuery"
        class="search-form"
        style="margin-top: 20px"
      >
        <el-form-item label="公告标题:">
          <el-input
            v-model="listQuery.title"
            placeholder="请输入"
            maxlength="21"
          />
        </el-form-item>
        <el-form-item label="发送时间：">
          <date-time-picker @pick="pickTime" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            @click="fetchData"
          >查询
          </el-button>
        </el-form-item>
      </el-form>
    </collapse>

    <el-table
      ref="multipleTable"
      :data="list"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="公告编号"
        width="100"
      >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="公告标题"
        width="300"
      />
      <el-table-column
        prop="description"
        label="公告详情"
        width="400"
        show-overflow-tooltip
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        show-overflow-tooltip
      />
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="deleteOne(scope.row)"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.current"
      :limit.sync="listQuery.size"
      @pagination="fetchData"
    />

    <el-dialog
      v-if="dialogConfig.visible"
      :title="dialogConfig.dialogTitle"
      :visible.sync="dialogConfig.visible"
      width="35%"
    >
      <el-form
        v-if="dialogConfig.visible"
        ref="noticeBox"
        :model="noticeMsg"
        status-icon
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="公告标题："
          :rules="[{ required: true, message: '标题不能为空',trigger: 'blur'}]"
          prop="title"
        >
          <el-input
            v-model="noticeMsg.title"
            :value="undefined"
            :editable="true"
          />
        </el-form-item>
        <el-form-item
          label="公告详情："
          prop="description"
          :rules="[{ required: true, message: '详情不能为空',trigger: 'blur'}]"
        >
          <el-input
            v-model="noticeMsg.description"
            type="textarea"
            :rows="5"
            placeholder="请输入详情"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConfig.visible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitForm('noticeBox')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import Collapse from '@/components/Collapse'
import Pagination from '@/components/Pagination'
import { pageNoticeList, addNotice, batchDeleteNotice } from '@/api/community.js'
import DateTimePicker from '@/components/Time/DateTimePicker'

export default {
  name: 'Notice',
  components: { Collapse, Pagination, DateTimePicker },
  data() {
    return {
      list: null,
      btnLoading: false,
      multipleSelection: [],
      total: 0,
      listLoading: false,
      listQuery: {
        current: 1,
        size: 10,
        startTime: null,
        endTime: null,
        title: null
      },
      fullscreen: false,
      dialogConfig: {
        visible: false,
        dialogTitle: ''
      },
      noticeMsg: {
        title: null,
        description: null
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      this.fullscreen = true
      pageNoticeList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.fullscreen = false
      }).catch(() => {
        this.fullscreen = false
      })
    },
    pickTime(pick) {
      if (pick != null) {
        this.listQuery.startTime = pick[0]
        this.listQuery.endTime = pick[1]
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
    },
    addNoticeKey() {
      this.dialogConfig.visible = true
      this.dialogConfig.dialogTitle = '新增公告'
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          addNotice(this.noticeMsg).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '新增成功！',
                type: 'success'
              })
              this.dialogConfig.visible = false
              this.btnLoading = false
              this.fetchData()
              this.noticeMsg.description = ''
              this.noticeMsg.title = ''
            }
          }).catch(() => {
            this.btnLoading = false
          })
        } else {
          return false
        }
      })
    },
    batchDelete() {
      const ids = []
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请先选择要删除的数据！',
          type: 'warning'
        })
      } else {
        this.$confirm('您确定要删除' + this.multipleSelection.length + '条信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fullscreen = true
          this.multipleSelection.map(v => {
            ids.push(v.id)
          })
          batchDeleteNotice({ 'ids': ids }).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '删除成功！',
                type: 'success'
              })
              this.fetchData()
            }
          }).catch(() => {
            this.fullscreen = false
          })
        }).catch(() => {
          this.fullscreen = false
        })
      }
    },
    deleteOne(row) {
      const ids = []
      this.$confirm('您确定要删除此条公告吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fullscreen = true
        ids.push(row.id)
        batchDeleteNotice({ 'ids': ids }).then(response => {
          if (response.code === '1') {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            this.fetchData()
          }
        }).catch(() => {
          this.fullscreen = false
        })
      }).catch(() => {
        this.fullscreen = false
      })
    }
  }

}
</script>
