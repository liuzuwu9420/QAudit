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
            <el-form-item label="证据描述:">
              <span>{{ props.row.measureDescription }}</span>
            </el-form-item>
            <el-form-item label="措施内容:">
              <span>{{ props.row.measures }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="审核类型" align="center" prop="auditType" show-overflow-tooltip />
      <el-table-column label="项次号" align="center" prop="itemNo" />
      <el-table-column label="部门代码" align="center" prop="respDeptCodes" />
      <el-table-column label="责任部门" align="center" prop="respDeptNames" show-overflow-tooltip />
      <el-table-column label="措施类型" align="center" prop="measuresType" show-overflow-tooltip />
      <el-table-column label="完成日期" align="center" prop="completionDate" show-overflow-tooltip />
      <el-table-column label="是否上传证据" align="center" prop="uploadEvidence" show-overflow-tooltip />
      <el-table-column label="上传证据时间" align="center" prop="uploadEvidenceDate" show-overflow-tooltip />
      <el-table-column label="是否超时" align="center" prop="timeout" show-overflow-tooltip />
      <el-table-column label="截至日期" align="center" prop="deadline" show-overflow-tooltip />
      <el-table-column label="审核员" align="center" prop="auditID" />
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
  name: 'MeasuresOverdue',
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
          measureDescription: '已完成',
          measures: '已修正，后台添加参考文件',
          auditType: 'Customer',
          auditID: '张金颖',
          itemNo: '1',
          findingLevel: 'II',
          respDeptCodes: 'LE',
          respDeptNames: 'LE',
          measuresType: '立即措施',
          completionDate: '2020/04/22',
          uploadEvidence: '已上传',
          uploadEvidenceDate: '2020/05/28',
          timeout: '',
          deadline: '2020-05-02'
        },
        {
          reportNo: 'OW-Syst-20-03',
          measureDescription: '',
          measures: '相关手册编写人员对WS-QM-001中的要求理解不清。',
          auditType: 'Prod',
          auditID: '郑晓松',
          itemNo: '1',
          findingLevel: 'II',
          respDeptCodes: 'OWD',
          respDeptNames: '附件大修产品部',
          measuresType: '根本原因分析',
          completionDate: '2020/05/20',
          uploadEvidence: '',
          uploadEvidenceDate: '',
          timeout: '',
          deadline: ''
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
    &:nth-child(-n+2){
    width: 50%;
 }
  }
</style>
