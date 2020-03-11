<template>
  <div class="app-container">
    <el-table
      ref="multipleTable"
      :data="list"
      border
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column
        prop="jobName"
        label="任务名称"
        width="100"
      />
      <el-table-column
        prop="jobClassName"
        label="定时任务全类名"
      />
      <el-table-column
        prop="jobGroup"
        label="所在组"
        width="150"
      />
      <el-table-column
        prop="cronExpression"
        label="表达式"
        width="150"
      />
      <el-table-column
        prop="timeZoneId"
        label="时区"
        width="150"
      />
      <el-table-column
        prop="startTime"
        label="创建时间"
        width="200"
      />
      <el-table-column
        prop="nextFireTime"
        label="下一次运行时间"
        width="200"
      />
      <el-table-column
        prop="triggerState"
        label="运行状态"
        width="150"
      >
        <template slot-scope="scope">
          <el-tag size="medium">{{ scope.row.triggerState }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="280"
      >
        <template slot-scope="scope">
          <el-button-group>
            <el-button
              v-if="scope.row.triggerState !=='PAUSED'"
              type="warning"
              size="small"
              :loading="scope.row.pauseLoading"
              @click="pauseOne(scope.row)"
            >暂停
            </el-button>
            <el-button
              v-if="scope.row.triggerState ==='PAUSED'"
              type="success"
              size="small"
              :loading="scope.row.resumeLoading"
              @click="resumeOne(scope.row)"
            >恢复
            </el-button>
            <el-button
              type="danger"
              size="small"
              :loading="scope.row.deleteLoading"
              @click="deleteOne(scope.row)"
            >删除
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="showDialog(scope.row)"
            >修改
            </el-button>
          </el-button-group>
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
        ref="cronBox"
        :model="cronMsg"
        status-icon
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="新的表达式"
          :rules="[{ required: true, message: '表达式不能为空',trigger: 'blur'}]"
          prop="cronExpression"
        >
          <el-input
            v-model="cronMsg.cronExpression"
            :value="undefined"
            :editable="true"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConfig.visible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="updateOne('cronBox')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { pageJobList, deleteJob, pauseJob, resumeJob, updateJob } from '../../api/system'
export default {
  name: 'JobManage',
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listQuery: {
        current: 1,
        size: 10
      },
      dialogConfig: {
        visible: false,
        dialogTitle: ''
      },
      cronMsg: {
        jobClassName: null,
        jobGroupName: null,
        cronExpression: null
      },
      btnLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      pageJobList(this.listQuery).then(response => {
        if (response.code === 200) {
          this.list = response.data.records
          this.total = response.data.total
        }
      })
    },
    // 删除
    deleteOne(row) {
      row.deleteLoading = true
      this.$confirm('您确定要删除该定时任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteJob({
          jobClassName: row.jobClassName,
          jobGroupName: row.jobGroup
        }).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '删除成功！',
              type: 'success'
            })
            row.deleteLoading = false
            this.fetchData()
          }
        }).catch(e => {
          row.deleteLoading = false
        })
      }).catch(() => {
        row.deleteLoading = false
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 暂停
    pauseOne(row) {
      row.pauseLoading = true
      this.$confirm('您确定要暂停该定时任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pauseJob({
          jobClassName: row.jobClassName,
          jobGroupName: row.jobGroup
        }).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            row.pauseLoading = false
            this.fetchData()
          }
        }).catch(e => {
          row.pauseLoading = false
        })
      }).catch(() => {
        row.pauseLoading = false
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 恢复
    resumeOne(row) {
      row.resumeLoading = true
      this.$confirm('您确定要恢复该定时任务吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        resumeJob({
          jobClassName: row.jobClassName,
          jobGroupName: row.jobGroup
        }).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '操作成功！',
              type: 'success'
            })
            row.resumeLoading = false
            this.fetchData()
          }
        }).catch(e => {
          row.resumeLoading = false
        })
      }).catch(() => {
        row.resumeLoading = false
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 显示dialog
    showDialog(row) {
      this.dialogConfig.visible = true
      this.dialogConfig.dialogTitle = '修改定时时间'
      this.cronMsg.jobClassName = row.jobClassName
      this.cronMsg.jobGroupName = row.jobGroup
    },
    // 修改时间
    updateOne(formName) {
      this.btnLoading = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updateJob(this.cronMsg).then(response => {
            if (response.code === 200) {
              this.btnLoading = false
              this.$refs[formName].resetFields()
              this.dialogConfig.visible = false
              this.fetchData()
              this.$message({
                message: '操作成功！',
                type: 'success'
              })
            }
          }).catch(e => {
            this.btnLoading = false
          })
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
