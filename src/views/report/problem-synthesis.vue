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
            <el-checkbox label="Part 21 生产制造" name="type" />
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
            <el-form-item label="审核描述:">
              <span>{{ props.row.taskDescription }}</span>
            </el-form-item>
            <el-form-item label="原因分析:">
              <span>{{ props.row.reasonAnalysis }}</span>
            </el-form-item>
            <el-form-item label="问题描述:">
              <span>{{ props.row.description }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="审核子类型" align="center" prop="subAuditType" show-overflow-tooltip />
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
  name: 'ProblemSynthesis',
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
          taskDescription: '国航股份维修工程管理委托工作监督检查',
          description: `适航指令管理

适航指令的评估、执行、反馈环节存在不满足程序要求的情况，如

1）ESM LE 018《工程文件管理程序》 5.3.3.2 要求“MRO完成后5个工作日内将执行结果录入TDMS”，但EAD2019-0291R1的执行文件MRO-A330-AMM-2021-R03机上配备时限要求是2020年3月15日之前，2020年3月20日前应在TDMS系统反馈，但实际反馈日期为3月23日。

2）ESM LE 003《适航指令管理程序》5.3.5.4要求“参考文件：相关 SB/SL、MDA、STC、厂家电传等”，检查发现，适航指令AD2020-04-19和EAD2019-0203中列有SB 等参考文件，但其对应的适航指令评估单中未填写。

3）EAD2019-0203评估单触发的AEO-A350-42-0005-R00计划颁发时间是2019年12月30日，实际颁发时间为2020年2月20日。

`,
          reasonAnalysis: '工程师漏填适航指令AD2020-04-19参考文件，审核时未发现。',
          subAuditType: 'Customer',
          auditID: '张金颖',
          qualitySystem: 'Part 121 工程委托',
          Itemno: '1',
          Findinglevel: 'II',
          RespDeptCodes: 'LE',
          Respdeptnames: 'LE'
        },
        {
          reportNo: 'OW-Syst-20-03',
          taskDescription: 'ATA21  ATA28',
          description: `Q.DOC-CP-004规定附件修理工作中，针对出现的故障及处理记录需要填入《车间故检单》或工卡中，目前OWD的工卡格式，不能满足Q.DOC中“对发现的故障必须经合格的技术员/检验人员评估并判定是否需要RII”的要求。

Q.doc-cp-004 describe, the fault and processing records shall be filled into the "Shop Finding sheet" or job card. The job card format of OWD cannot meet the requirement in q.doc that "the fault found must be evaluated by qualified technicians/inspectors to determine whether RII is needed".

`,
          reasonAnalysis: '之前SOP程序对此问题未做明确要求，对于新程序新要求，认为工卡按 WS-QM-042 部件必检项目规定，在工卡中标注必检项目，对于在技术资料规定的限制或范围内的故障或缺陷在工卡“发现问题与采取措施”栏中填写，对于超出技术资料规定的限制或范围的故障或缺陷，利用车间故障检查单填写，判断RII，即满足要求。',
          subAuditType: 'Prod',
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
    &:nth-child(-n+2){
    width: 50%;
 }
  }
</style>
