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
        <el-form-item label="状态:">
          <el-select v-model="listQuery.cancelFlag" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间：">
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
        prop="problemDescription"
        label="问题描述"
        width="300"
      />
      <el-table-column
        prop="createTime"
        label="报修时间"
        width="300"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="处理时间"
        width="300"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.handleTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="结束时间"
        width="300"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cancelFlag"
        label="状态"
      >
        <template slot-scope="scope">
          <el-button v-if="scope.row.cancelFlag === 0" size="small" type="danger" round>未处理</el-button>
          <el-button v-if="scope.row.cancelFlag === 1" size="small" type="primary" round>处理中</el-button>
          <el-button v-if="scope.row.cancelFlag === 2" size="small" type="success" round>已结束</el-button>
          <el-button v-if="scope.row.cancelFlag === -1" size="small" type="info" round>已撤销</el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.cancelFlag === 0"
            type="text"
            @click="changeStatusToHandle(scope.row.id)"
          >确认处理
          </el-button>
          <el-button
            v-if="scope.row.cancelFlag === 1"
            type="text"
            @click="changeStatusToFinished(scope.row.id)"
          >处理完成
          </el-button>
          <el-button
            type="text"
            @click="$router.push({name:'PropertyProblemDetail',query:{problem:scope.row}})"
          >详情
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
  </div>
</template>

<script>

import Collapse from '@/components/Collapse'
import Pagination from '@/components/Pagination'
import { pagePropertyProblemList, updateStatusToHandle, updateStatusToFinished } from '../../../api/community'
import DateTimePicker from '../../../components/Time/DateTimePicker'
import { Notification } from 'element-ui'

export default {
  name: 'PropertyProblem',
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
        cancelFlag: undefined
      },
      fullscreen: false,
      statusOptions: [{
        value: undefined,
        label: '全部'
      }, {
        value: 0,
        label: '未处理'
      }, {
        value: 1,
        label: '处理中'
      }, {
        value: 2,
        label: '已结束'
      }, {
        value: -1,
        label: '已撤销'
      }]
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
      pagePropertyProblemList(this.listQuery).then(response => {
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
    changeStatusToHandle(id) {
      updateStatusToHandle({ problemId: id }).then(response => {
        if (response.code === 200) {
          Notification.success({
            title: '操作成功',
            duration: 2000
          })
          this.fetchData()
        }
      }).catch(e => {
        Notification.error({
          title: e.message,
          duration: 2000
        })
      })
    },
    changeStatusToFinished(id) {
      this.$confirm('您确定已经成功地解决问题了吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateStatusToFinished({ problemId: id }).then(response => {
          if (response.code === 200) {
            Notification.success({
              title: '操作成功',
              duration: 2000
            })
            this.fetchData()
          }
        }).catch(e => {
          Notification.error({
            title: e.message,
            duration: 2000
          })
        })
      })
    }
  }

}
</script>
