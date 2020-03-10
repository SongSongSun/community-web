<template>
  <div class="app-container operator-segment">
    <collapse>
      <div slot="controls" class="btn-item" style="display: inline-block">
        <el-button
          type="primary"
          icon="el-icon-circle-plus-outline"
          @click="showUserDialog"
        >迁入
        </el-button>
        <el-button
          icon="el-icon-delete"
          @click="batchDeleteCommunityUser"
        >迁出
        </el-button>
      </div>
      <el-form
        slot="content"
        :inline="true"
        :model="listQuery"
        class="search-form"
        style="margin-top: 20px"
      >
        <el-form-item label="用户姓名:">
          <el-input
            v-model="listQuery.name"
            placeholder="请输入"
            maxlength="21"
          />
        </el-form-item>
        <el-form-item label="联系电话:">
          <el-input
            v-model="listQuery.phone"
            placeholder="请输入"
            maxlength="21"
          />
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="listQuery.sex" placeholder="请选择">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="定居状态:">
          <el-select v-model="listQuery.settleFlag" placeholder="请选择">
            <el-option
              v-for="item in settleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <br>
        <el-form-item label="籍贯:">
          <el-cascader
            v-model="place"
            size="large"
            :options="provinceAndCityPlusOptions"
          />
        </el-form-item>
        <el-form-item label="所在楼栋:">
          <el-select v-model="listQuery.buildingId" placeholder="请选择">
            <el-option
              v-for="item in buildingOptions"
              :key="item.value"
              :label="item.buildingName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="迁入时间：">
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
      :data="communityUserList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="用户编号"
        width="100"
      >
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        width="200"
      />
      <el-table-column
        prop="phone"
        label="联系电话"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column
        prop="sex"
        label="性别"
        width="50"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="scope.row.sex === 1">男</span>
          <span v-else>女</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="nativePlace"
        label="籍贯"
        width="200"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>{{ codeToText(scope.row.nativePlace.split(',')[0])+codeToText(scope.row.nativePlace.split(',')[1]) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="buildingId"
        label="所在楼栋"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <el-select v-model="scope.row.buildingId" placeholder="请选择" disabled>
            <el-option
              v-for="item in buildingOptions"
              :key="item.value"
              :label="item.buildingName"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column
        prop="settleFlag"
        label="居住状态"
        width="150"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span v-if="scope.row.settleFlag === 1">定居</span>
          <span v-else>迁出</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="迁入时间"
        show-overflow-tooltip
      />
      <el-table-column
        label="操作"
        width="300"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.settleFlag === 1"
            type="text"
            @click="resetUsername(scope.row.id)"
          >重置用户名密码
          </el-button>
          <el-button
            v-if="scope.row.settleFlag === 1"
            type="text"
            @click="deleteOne(scope.row.id)"
          >迁出
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
      width="40%"
    >
      <el-form
        v-if="dialogConfig.visible"
        ref="CommunityUserBox"
        :model="communityUserMsg"
        status-icon
        label-width="140px"
        class="demo-ruleForm"
      >
        <el-form-item
          label="用户姓名："
          :rules="[{ required: true, message: '用户姓名不能为空',trigger: 'blur'}]"
          prop="name"
        >
          <el-col :span="12">
            <el-input
              v-model="communityUserMsg.name"
              :value="undefined"
              :editable="true"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="联系电话："
          :rules="[{ required: true, message: '联系电话不能为空',trigger: 'blur'}]"
          prop="phone"
        >
          <el-col :span="12">
            <el-input
              v-model="communityUserMsg.phone"
              :value="undefined"
              :editable="true"
            />
          </el-col>
        </el-form-item>
        <el-form-item
          label="性别："
          :rules="[{ required: true, message: '性别不能为空',trigger: 'blur'}]"
          prop="sex"
        >
          <el-select v-model="communityUserMsg.sex" placeholder="请选择">
            <el-option
              v-for="item in sexOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="籍贯："
          :rules="[{ required: true, message: '籍贯不能为空',trigger: 'blur'}]"
          prop="nativePlace"
        >
          <el-cascader
            v-model="communityUserMsg.nativePlace"
            size="large"
            :options="provinceAndCityOptions"
          />
        </el-form-item>
        <el-form-item
          label="所在楼栋："
          :rules="[{ required: true, message: '所在楼栋不能为空',trigger: 'blur'}]"
          prop="buildingId"
        >
          <el-select v-model="communityUserMsg.buildingId" placeholder="请选择">
            <el-option
              v-for="item in buildingOptions"
              :key="item.value"
              :label="item.buildingName"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="人员类别："
          :rules="[{ required: true, message: '人员类别不能为空',trigger: 'blur'}]"
          prop="userFlag"
        >
          <el-select v-model="communityUserMsg.userFlag" placeholder="请选择">
            <el-option
              v-for="item in userFlagOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否为房子所有人:">
          <el-switch v-model="communityUserMsg.ownerId" :active-value="0" :inactive-value="null" />
        </el-form-item>
        <el-form-item v-if="communityUserMsg.ownerId===null" label="房子所有人:" :rules="[{ required: true, message: '房子所有人不能为空',trigger: 'blur'}]">
          <el-select
            v-model="communityUserMsg.ownerId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入所有人电话进行搜索"
            :remote-method="remoteMethod"
            :loading="loading"
          >
            <el-option
              v-for="item in userOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
              <span style="float: left">{{ item.name }}</span>
              <span style="float: right">{{ codeToText(item.nativePlace.split(',')[0]) + codeToText(item.nativePlace.split(',')[1]) }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogConfig.visible = false">取 消</el-button>
        <el-button type="primary" :loading="btnLoading" @click="createUser('CommunityUserBox')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DateTimePicker from '@/components/Time/DateTimePicker'
import Collapse from '@/components/Collapse'
import Pagination from '@/components/Pagination'
import { provinceAndCityData, regionData, provinceAndCityDataPlus, regionDataPlus, CodeToText, TextToCode } from 'element-china-area-data'
import { pageBuildingList, pageCommunityUserList, addCommunityUser, resetAccount, deleteCommunityUser } from '../../api/community'
export default {
  name: 'CommunityUser',
  components: { Collapse, Pagination, DateTimePicker },
  data() {
    return {
      multipleSelection: [],
      place: undefined,
      btnLoading: false,
      total: 0,
      communityUserList: [],
      listQuery: {
        current: 1,
        size: 10,
        name: undefined,
        phone: undefined,
        sex: undefined,
        settleFlag: undefined,
        nativePlace: undefined,
        buildingId: undefined,
        startTime: undefined,
        endTime: undefined
      },
      communityUserMsg: {
        name: undefined,
        phone: undefined,
        sex: undefined,
        nativePlace: undefined,
        buildingId: undefined,
        userFlag: undefined,
        ownerId: undefined
      },
      sexOptions: [{
        value: undefined,
        label: '全部'
      }, {
        value: 1,
        label: '男'
      }, {
        value: 2,
        label: '女'
      }],
      settleOptions: [{
        value: undefined,
        label: '全部'
      }, {
        value: 1,
        label: '定居'
      }, {
        value: 0,
        label: '迁出'
      }],
      userFlagOptions: [{
        value: 1,
        label: '房子所属人'
      }, {
        value: 0,
        label: '外来迁入人'
      }],
      provinceAndCityPlusOptions: provinceAndCityDataPlus,
      provinceAndCityOptions: provinceAndCityData,
      buildingOptions: [],
      dialogConfig: {
        visible: false,
        dialogTitle: ''
      },
      userOptions: []
    }
  },
  mounted() {
    const buildingParams = {
      current: 1,
      size: 100
    }
    pageBuildingList(buildingParams).then(response => {
      this.buildingOptions = response.data.records
    })
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    fetchData() {
      if (this.place === undefined || this.place[0] === '') {
        this.listQuery.nativePlace = undefined
      } else {
        this.listQuery.nativePlace = this.place[0] + ',' + this.place[1]
      }
      pageCommunityUserList(this.listQuery).then(response => {
        this.communityUserList = response.data.records
        this.total = response.data.total
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
    showUserDialog() {
      this.dialogConfig.visible = true
      this.dialogConfig.dialogTitle = '新增社区用户'
    },
    remoteMethod(query) {
      const queryParams = {
        size: 10000,
        current: 1,
        phone: query,
        settleFlag: 1
      }
      if (query === undefined) {
        queryParams.phone = undefined
      }
      pageCommunityUserList(queryParams).then(response => {
        this.userOptions = response.data.records
      })
    },
    createUser(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          this.communityUserMsg.nativePlace = this.communityUserMsg[0] + ',' + this.communityUserMsg[1]
          addCommunityUser(this.communityUserMsg).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '新增成功！',
                type: 'success'
              })
              this.btnLoading = false
              this.fetchData()
              this.$refs[formName].resetFields()
              this.dialogConfig.visible = false
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
    codeToText(num) {
      return CodeToText[num]
    },
    resetUsername(id) {
      this.$confirm('您确定要重置用户名密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const params = {
          userId: id
        }
        resetAccount(params).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '重置成功！',
              type: 'success'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    batchDeleteCommunityUser() {
      const ids = []
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: '请先选择要迁出的用户！',
          type: 'warning'
        })
      } else {
        this.$confirm('您确定要迁出' + this.multipleSelection.length + '个人？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fullscreen = true
          this.multipleSelection.map(v => {
            ids.push(v.id)
          })
          deleteCommunityUser({ 'ids': ids }).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '迁出成功！',
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
    deleteOne(id) {
      const ids = []
      this.$confirm('您确定要迁出该用户吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fullscreen = true
        ids.push(id)
        deleteCommunityUser({ 'ids': ids }).then(response => {
          if (response.code === 200) {
            this.$message({
              message: '迁出成功！',
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

<style scoped>

</style>
