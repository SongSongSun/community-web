<template>
  <div class="app-container operator-segment">
    <collapse>
      <el-form
        slot="content"
        :inline="true"
        :model="listQuery"
        class="search-form"
        style="margin-top: 20px"
      >
        <el-form-item label="审核状态:">
          <el-select v-model="listQuery.approveFlag" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="活动主题：">
          <el-input
            v-model="listQuery.activityTheme"
            placeholder="请输入"
            maxlength="21"
          />
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
        prop="activityTheme"
        label="活动主题"
        width="150"
      />
      <el-table-column
        prop="activityAddress"
        label="活动地址"
        width="150"
      />
      <el-table-column
        prop="activityContent"
        label="活动内容"
      />
      <el-table-column
        prop="createUserName"
        label="创建人"
        width="100"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="alarmTime"
        label="提醒时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.alarmTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="activityStartTime"
        label="开始时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.activityStartTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="activityEndTime"
        label="结束时间"
        width="200"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.activityEndTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="approveFlag"
        label="状态"
        width="110"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.approveFlag === 0" size="small" type="primary" round>未审核</el-button>
          <el-button v-if="scope.row.approveFlag === 1" size="small" type="success" round>审核通过</el-button>
          <el-button v-if="scope.row.approveFlag === 2" size="small" type="danger" round>审核未通过</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
      >
        <template slot-scope="scope">
          <el-button v-show="scope.row.approveFlag===0" type="text" @click="dialogShow=true,activityId=scope.row.id">审核</el-button>
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
      title="审核提示"
      :visible.sync="dialogShow"
      width="30%"
      center
    >
      <span>您同意该活动发布通过吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogShow = false">取 消</el-button>
        <el-button type="danger" :loading="refuseBtnLoading" @click="approve(2)">拒绝</el-button>
        <el-button type="success" :loading="approveBtnLoading" @click="approve(1)">同意</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import Collapse from '@/components/Collapse'
import Pagination from '@/components/Pagination'
import { pageActivity, approveActivity } from '../../../api/community'
import { Notification } from 'element-ui'

export default {
  name: 'ActivityManage',
  components: { Collapse, Pagination },
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
        activityTheme: undefined,
        approveFlag: undefined
      },
      fullscreen: false,
      statusOptions: [{
        value: undefined,
        label: '全部'
      }, {
        value: 0,
        label: '未审核'
      }, {
        value: 1,
        label: '审核通过'
      }, {
        value: 2,
        label: '审核未通过'
      }],
      dialogShow: false,
      approveBtnLoading: false,
      refuseBtnLoading: false,
      activityId: undefined
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
      pageActivity(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.fullscreen = false
      }).catch(() => {
        this.fullscreen = false
      })
    },
    approve(flag) {
      console.log(this.activityId)

      console.log(flag)
      if (flag === 2) {
        this.refuseBtnLoading = true
      } else {
        this.approveBtnLoading = true
      }
      approveActivity({ id: this.activityId, approveFlag: flag }).then(response => {
        if (response.code === 200) {
          Notification.success({
            title: '操作成功',
            duration: 2000
          })
          this.fetchData()
          if (flag === 2) {
            this.refuseBtnLoading = true
          } else {
            this.approveBtnLoading = true
          }
          this.activityId = undefined
          this.dialogShow = false
        }
      }).catch(e => {
        Notification.error({
          title: e.message,
          duration: 2000
        })
        this.activityId = undefined
        if (flag === 2) {
          this.refuseBtnLoading = true
        } else {
          this.approveBtnLoading = true
        }
      })
    }
  }

}
</script>
