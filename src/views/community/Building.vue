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
      </div>
      <el-form
        slot="content"
        :inline="true"
        :model="listQuery"
        class="search-form"
        style="margin-top: 20px"
      />
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
        label="楼栋编号"
        width="100"
      >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column
        prop="buildingName"
        label="楼栋名称"
        width="300"
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
        ref="buildingBox"
        :model="buildingMsg"
        status-icon
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="楼栋名称："
          :rules="[{ required: true, message: '标题不能为空',trigger: 'blur'}]"
          prop="buildingName"
        >
          <el-input
            v-model="buildingMsg.buildingName"
            :value="undefined"
            :editable="true"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConfig.visible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="submitForm('buildingBox')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import Collapse from '@/components/Collapse'
import Pagination from '@/components/Pagination'
import { pageBuildingList, addBuilding } from '../../api/community'
export default {
  name: 'Building',
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
        startTime: null,
        endTime: null,
        title: null
      },
      fullscreen: false,
      dialogConfig: {
        visible: false,
        dialogTitle: ''
      },
      buildingMsg: {
        buildingName: null
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
      pageBuildingList(this.listQuery).then(response => {
        this.list = response.data.records
        this.total = response.data.total
        this.fullscreen = false
      }).catch(() => {
        this.fullscreen = false
      })
    },
    addNoticeKey() {
      this.dialogConfig.visible = true
      this.dialogConfig.dialogTitle = '新增楼栋'
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          addBuilding(this.buildingMsg).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '新增成功！',
                type: 'success'
              })
              this.dialogConfig.visible = false
              this.btnLoading = false
              this.fetchData()
              this.buildingMsg.buildingName = ''
            }
          }).catch(() => {
            this.btnLoading = false
          })
        } else {
          return false
        }
      })
    }
  }

}
</script>
