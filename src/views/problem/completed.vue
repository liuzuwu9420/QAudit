<template>
  <div class="app-container">
    <div class="head">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="auto">
        <el-form-item label="部门代码" prop="deptCode">
          <el-input
            v-model="queryParams.deptCode"
            placeholder="请输入部门代码"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="状态" prop="handleStarus">
          <el-select
            v-model="queryParams.handleStarus"
            placeholder="请选择状态"
            clearable
            size="small"
            style="width: 240px"
          >
            <el-option
              v-for="status in queryParams.statusOptions"
              :key="status.value"
              :label="status.label"
              :value="status.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="报告编号" prop="auditReportNumber">
          <el-input
            v-model="queryParams.auditReportNumber"
            placeholder="请输入报告编号"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="head-buttons" style="margin-top: 5px">
        <el-button type="primary" icon="el-icon-view" size="mini" :disabled="single">纠正措施报告</el-button>
        <el-button type="primary" icon="el-icon-view" size="mini" :disabled="single">延期申请报告</el-button>
        <el-button type="primary" icon="el-icon-view" size="mini" :disabled="single">复审验证单</el-button>
      </div>
    </div>
    <el-table v-loading="loading" :data="problemList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="部门代码" align="center" prop="deptCode" width="80" />
      <el-table-column label="状态" align="center" width="120">
        <template v-slot="{row}">
          <el-tag size="mini" :type="statusObj(row).type">
            <i :class="statusObj(row).icon" />
            {{ statusObj(row).name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="审核报告编号" align="center" width="140" prop="auditReportNumber" />
      <el-table-column label="项次" align="center" width="50" prop="itemNo" />
      <el-table-column label="问题等级" align="center" width="80" prop="findingLevel" />
      <!-- <el-table-column label="责任部门" align="center" prop="respdeptCodes" />
      <el-table-column label="责任部门名称" align="center" prop="respdeptName" /> -->
      <el-table-column label="责任经理" align="center" width="140" prop="responsibleManager" />
      <el-table-column label="描述" align="center" show-overflow-tooltip prop="description" />
    </el-table>

    <pagination
      v-show="page.total>0"
      :total="page.total"
      :page.sync="page.currentPage"
      :limit.sync="page.pageSize"
      @pagination="getList"
    />

    <!--反馈对话框 -->
    <dialog-feedback :people-role="peopleRole" :open="open" :form="form" @close="open=false" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import DialogFeedback from '../components/dialog-feedback'

const statusMap = {
  reviewing: {
    name: '反馈中',
    type: 'warning'
  },
  'For review': {
    name: '待复审',
    type: ''
  },
  'For Feedback': {
    name: '待反馈',
    type: ''
  },
  Feedbacking: {
    name: '复审中',
    type: 'warning'
  },
  Completed: {
    name: '已完成',
    type: 'success'
  }
}
export default {
  name: 'Completed',
  components: {
    Pagination,
    DialogFeedback
  },
  data() {
    return {
      statusMap: statusMap,
      peopleRole: '1',
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
        deptCode: '',
        handleStarus: undefined,
        statusOptions: [
          {
            value: 'reviewing',
            label: '反馈中'
          }, {
            value: 'For review',
            label: '待复审'
          }, {
            value: 'For Feedback',
            label: '待反馈'
          }, {
            value: 'Feedbacking',
            label: '复审中'
          }],
        auditReportNumber: ''
      },
      // 用户表格数据
      problemList: [
        {
          deptCode: 'OBA',
          handleStarus: 'Completed',
          auditReportNumber: 'QS-Prod-20-41',
          itemNo: '01',
          findingLevel: 'Ⅱ',
          respdeptCodes: 'OBA',
          respdeptName: 'OBA',
          responsibleManager: '',
          description:
            '抽查B-5919飞机放行证书，该飞机的维修记录包中未找到技术评估单'
        },
        {
          deptCode: 'OB',
          handleStarus: 'Completed',
          auditReportNumber: 'QS-Spec-19-101',
          itemNo: '07',
          findingLevel: 'Ⅱ',
          respdeptCodes: 'OB',
          respdeptName: 'OB',
          responsibleManager: '',
          description: '维修记录抽查发现，对于涉及的记录不完整'
        }
      ],
      dialogCreatingProblem: false,
      auditProblemForm: {
        itemNo: '',
        respDeptCodes: '',
        findingLevel: 'Ⅱ',
        basis: '',
        date: '',
        description: '',
        responsibilityDepartment: '',
        product: '',
        system: '',
        productSystemRemarks: '',
        problem1: '',
        problem2: '',
        riskSourcces: '',
        riskSourccesNotes: '',
        repeatability: '',
        systematicness: '',
        commonness: '',
        actionsRequired: ''
      },
      open: false,
      form: {
        auditReportNumber: '',
        itemNo: '',
        findingProblemDesc: '',
        rectificationRequirements: '',
        remarks: '',
        approvalComments: '',
        acceptProblem: '是',
        requestFeedbackTime: '',
        coordinator: '',
        responsibleManager: '',
        qualityManager: '',
        operator: '',
        responsibleUnitLeader: '',
        auditTeamLeader: '',
        resDepartmentManagerSign: '',
        evaluatedBy: '',
        evaluationAccept: '是',
        evaluatedDate: '',
        eventConsequence: '',
        evaluationProcessDesc: '',
        suggestion: '',
        problemRecordingList: [
          {
            auditStage: '任务反馈',
            approver: '张三',
            approvalResults: '开启反馈',
            approvalComments: '无',
            processingTime: '2020-06-10'
          }
        ]
      },
      // 分页参数
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 2
      }
    }
  },
  created() {
    /* this.getList() */
  },
  methods: {
    /** 查询用户列表 */
    getList() {},
    statusObj(row) {
      if (row.handleStarus) {
        return statusMap[row.handleStarus]
      } else {
        return {
          name: 'Unknown',
          type: 'info',
          icon: 'el-icon-circle-close'
        }
      }
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
    }
  }
}
</script>
