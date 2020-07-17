<template>
  <div class="app-container">
    <div class="head">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="auto">
        <el-form-item label="报告审批时间" prop="date">
          <el-date-picker
            v-model="queryParams.date"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
            style="width: 380px"
          />
        </el-form-item>
        <el-form-item label="审核部门代码" prop="auditDepartmentCode">
          <el-input
            v-model="queryParams.auditDepartmentCode"
            placeholder="请输入审核部门代码"
            clearable
            size="small"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item label="体系" prop="system">
          <el-checkbox-group v-model="queryParams.system" style="width: 380px">
            <el-checkbox label="Part 121 工程委托" name="type" />
            <el-checkbox label="Part 145 维修管理" name="type" />
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="问题责任部门" prop="problemResponsibilityDept">
          <el-input
            v-model="queryParams.problemResponsibilityDept"
            placeholder="请输入问题责任部门"
            clearable
            size="small"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="info"
            icon="el-icon-download"
            @click="handleExport"
          >导出</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="loading"
      :data="synthesisList"
      show-overflow-tooltip
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column type="selection" width="40" align="center" /> -->
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="审核报告编号:">
              <span>{{ props.row.reportNo }}</span>
            </el-form-item>
            <el-form-item label="整改要求:">
              <span>{{ props.row.actionsRequired }}</span>
            </el-form-item>
            <el-form-item label="问题描述:">
              <span>{{ props.row.description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="审核类型" align="center" prop="auditType" show-overflow-tooltip />
      <el-table-column label="责任审核员" align="center" prop="auditID" />
      <el-table-column label="体系" align="center" prop="qualitySystem" />
      <el-table-column label="项次号" align="center" prop="Itemno" />
      <el-table-column label="问题等级" align="center" prop="Findinglevel" />
      <el-table-column label="责任部门代码" align="center" prop="RespDeptCodes" />
      <el-table-column label="责任部门名称" align="center" prop="Respdeptnames" show-overflow-tooltip />
    </el-table>

    <pagination
      v-show="page.total>0"
      :total="page.total"
      :page.sync="page.currentPage"
      :limit.sync="page.pageSize"
      @pagination="getList"
    />

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'AllOpeningItems',
  components: {
    Pagination
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 查询参数
      queryParams: {
        date: undefined,
        auditDepartmentCode: undefined,
        system: [],
        problemResponsibilityDept: undefined
      },
      // 用户表格数据
      synthesisList: [
        {
          reportNo: 'QS-Spec-20-68',
          description: '审核发现，浦东85#桥航材库房内件号为MS20995C32已出库的保险丝无可用器材挂签，仍在维修过程中进行使用。',
          actionsRequired: '立即隔离并停止使用该保险丝，退回航材部门。',
          auditType: 'Customer',
          auditID: '张金颖',
          qualitySystem: 'Part 121 工程委托',
          Itemno: '1',
          Findinglevel: 'II',
          RespDeptCodes: 'LE',
          Respdeptnames: 'LE'
        },
        {
          reportNo: 'OW-Syst-20-03',
          description: '审核发现，浦东航线中队现场办公室内存放了非现行有效的授权文件，如放行人员授权书、飞机维修人员（T2）授权书等。',
          actionsRequired: '立即撤除并隔离失效的授权文件，维修人员的授权文件以TAS系统为准 浦东航线中队。',
          auditType: 'Prod',
          auditID: '郑晓松',
          qualitySystem: 'Part 145 维修管理',
          Itemno: '1',
          Findinglevel: 'II',
          RespDeptCodes: 'OWD',
          Respdeptnames: '附件大修产品部'
        }
      ],
      // 分页参数
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 2
      }
    }
  },
  created() {
    /* this.getList()
    this.getTreeselect()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('sys_user_sex').then(response => {
      this.sexOptions = response.data
    })
    this.getConfigKey('sys.user.initPassword').then(response => {
      this.initPassword = response.msg
    }) */
  },
  methods: {
    /** 查询用户列表 */
    getList() {

    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.page.currentPage = 1
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 导出按钮操作 */
    handleExport() {
      // const queryParams = this.queryParams
      this.$confirm('是否确认导出所有数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          console.log('success')
          // return exportData(queryParams)
        })
        /* .then(response => {
          this.download(response.obj)
        }) */
        .catch(function() {})
    }
  }
}
</script>
<style lang="scss" scoped>
.demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    text-align: left;
  }
</style>
