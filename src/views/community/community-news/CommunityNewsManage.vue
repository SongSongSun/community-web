<template>
  <div class="app-container operator-segment">
    <collapse>
      <div slot="controls" class="btn-item" style="display: inline-block">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="$router.push({name:'CreateCommunityNews'})"
        >创建
        </el-button>
      </div>
      <el-form
        slot="content"
        :inline="true"
        :model="listQuery"
        class="search-form"
        style="margin-top: 20px"
      >
        <el-form-item label="是否显示:">
          <el-select v-model="listQuery.showFlag" placeholder="请选择">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="新闻标题：">
          <el-input
            v-model="listQuery.title"
            placeholder="请输入"
            maxlength="21"
          />
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
        type="index"
        width="50"
      />
      <el-table-column
        prop="title"
        label="新闻标题"
      />
      <el-table-column
        prop="createUserId"
        label="创建人"
      />
      <el-table-column
        prop="createTime"
        label="创建时间"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.showFlag" placeholder="请选择" @change="changFlag(scope.row)">
            <el-option
              v-for="item in statusOptions1"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
              <span style="float: left">{{ item.label }}</span>
            </el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="text" @click="$router.push({name:'CommunityNewsDetail',query:{communityNews:scope.row}})">详情</el-button>
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
import DateTimePicker from '../../../components/Time/DateTimePicker'
import { pageCommunityNews, updateCommunityNews } from '../../../api/community'
import { Notification } from 'element-ui'
export default {
  name: 'ActivityManage',
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
        startTime: undefined,
        endTime: undefined,
        title: undefined,
        showFlag: undefined
      },
      fullscreen: false,
      statusOptions: [{
        value: undefined,
        label: '全部'
      }, {
        value: 0,
        label: '未显示'
      }, {
        value: 1,
        label: '显示'
      }],
      statusOptions1: [{
        value: 0,
        label: '未显示'
      }, {
        value: 1,
        label: '显示'
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
      pageCommunityNews(this.listQuery).then(response => {
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
    changFlag(obj) {
      console.log('obj:' + JSON.stringify(obj))
      updateCommunityNews(obj).then(response => {
        if (response.code === 200) {
          Notification.success('修改显示状态成功')
          this.fetchData()
        }
      }).catch(e => {
        Notification.error(e.message)
      })
    }
  }

}
</script>
