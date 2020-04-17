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
        <el-form-item label="公告类型:">
          <el-select v-model="listQuery.newsFlag" placeholder="请选择">
            <el-option
              v-for="item in newsOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="物品名称：">
          <el-input
            v-model="listQuery.thingName"
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
        label="序号"
        type="index"
        width="50"
      />
      <el-table-column
        prop="thingName"
        label="物品名称"
      />
      <el-table-column
        prop="thingDescription"
        label="物品描述"
      />
      <el-table-column
        label="物品图片"
      >
        <template slot-scope="scope">
          <el-image
            style="width: 100px; height: 100px"
            :src="scope.row.thingImg"
            fit="fit"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="createUserName"
        label="联系人"
      />
      <el-table-column
        prop="phone"
        label="联系电话"
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
        prop="endTime"
        label="结束时间"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span style="margin-left: 10px">{{ scope.row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="显示状态"
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
        prop="newsFlag"
        label="公告类型"
      >
        <template slot-scope="scope">
          <el-tag v-if="scope.row.newsFlag === 1" type="danger" effect="dark">寻物启示</el-tag>
          <el-tag v-if="scope.row.newsFlag === 2" type="success" effect="dark">失物招领</el-tag>
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
import { updateLostFound, pageLostFound } from '../../../api/community'
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
        showFlag: undefined,
        thingName: undefined,
        newsFlag: undefined
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
      newsOptions: [{
        value: undefined,
        label: '全部'
      }, {
        value: 1,
        label: '寻物启示'
      }, {
        value: 2,
        label: '失物招领'
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
      pageLostFound(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.fullscreen = false
      }).catch(() => {
        this.fullscreen = false
      })
    },
    changFlag(obj) {
      console.log('obj:' + JSON.stringify(obj))
      updateLostFound(obj).then(response => {
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
