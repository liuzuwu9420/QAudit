<template>
  <div class="app-container">
    <div class="head">
      <el-select v-model="peopleRole" style="margin-right: 10px;" placeholder="请选择角色">
        <el-option label="被审单位协调员" value="1" />
        <el-option label="主责任经理" value="2" />
        <el-option label="操作员" value="3" />
        <el-option label="责任单位领导" value="4" />
        <el-option label="审核组长" value="8" />
      </el-select>
      <!-- <el-button-group>
        <el-button type="primary" @click="peopleRole='1'">被审单位协调员</el-button>
        <el-button type="primary" @click="peopleRole='2'">主责任经理</el-button>
        <el-button type="primary" @click="peopleRole='3'">操作员</el-button>
        <el-button type="primary" @click="peopleRole='4'">责任单位领导</el-button>
        <el-button type="primary" @click="peopleRole='5'">质量协调员</el-button>
        <el-button type="primary" @click="peopleRole='6'">责任部门协调员</el-button>
        <el-button type="primary" @click="peopleRole='7'">质量经理</el-button>
        <el-button type="primary" @click="peopleRole='8'">审核组长</el-button>
      </el-button-group> -->
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
        <!-- <el-button type="warning" icon="el-icon-edit" size="mini" :disabled="single" @click="correctProblem()">回复</el-button>
        <el-button type="success" icon="el-icon-time" size="mini" :disabled="single">延期申请</el-button>
        <el-button type="primary" icon="el-icon-s-promotion" size="mini" :disabled="single" @click="submitEvidence()">提交纠正措施完成证据</el-button> -->
        <el-button type="primary" icon="el-icon-view" size="mini" :disabled="single">纠正措施报告</el-button>
        <el-button type="primary" icon="el-icon-view" size="mini" :disabled="single">延期申请报告</el-button>
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
      <el-table-column label="责任经理" align="center" width="80" prop="responsibleManager" />
      <el-table-column label="当前流程" align="center" width="80" prop="currentProcess" />
      <el-table-column label="描述" align="center" show-overflow-tooltip prop="description" />
      <!-- <el-table-column label="操作" width="120">
        <template v-slot="{row}">
          <el-button-group>
            <el-tooltip
              class="item"
              effect="dark"
              content="回复"
              placement="top-end"
            >
              <el-button
                type="primary"
                icon="el-icon-share"
                size="mini"
                @click="correctProblem(row)"
              />
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="延期"
              placement="top-end"
            >
              <el-button
                type="warning"
                icon="el-icon-time"
                size="mini"
              />
            </el-tooltip>
          </el-button-group>
        </template>
      </el-table-column> -->
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
    <!--复审对话框 -->
    <dialog-review :open="openReview" @close="openReview=false" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import DialogFeedback from '../components/dialog-feedback'
import DialogReview from '../components/dialog-review'

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
  }
}
export default {
  name: 'Processing',
  components: {
    Pagination,
    DialogFeedback,
    DialogReview
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
          handleStarus: 'reviewing',
          auditReportNumber: 'QS-Prod-20-41',
          itemNo: '01',
          findingLevel: 'Ⅱ',
          respdeptCodes: 'OBA',
          respdeptName: 'OBA',
          responsibleManager: '',
          currentProcess: '反馈流程',
          description:
            '抽查B-5919飞机放行证书，该飞机的维修记录包中未找到技术评估单'
        },
        {
          deptCode: 'OB',
          handleStarus: 'Feedbacking',
          auditReportNumber: 'QS-Spec-19-101',
          itemNo: '07',
          findingLevel: 'Ⅱ',
          respdeptCodes: 'OB',
          respdeptName: 'OB',
          responsibleManager: '',
          currentProcess: '复审流程',
          description: '维修记录抽查发现，对于涉及的记录不完整'
        },
        {
          deptCode: 'OB',
          handleStarus: 'For review',
          auditReportNumber: 'QS-Spec-19-101',
          itemNo: '08',
          findingLevel: 'Ⅱ',
          respdeptCodes: 'OB',
          respdeptName: 'OB',
          responsibleManager: '',
          currentProcess: '延期流程',
          description: '抽查B-9飞机放行证书，该证书描述三个故障经用户要求保留，其中保留故障单DD No. 0220294的申请基于技术评估单No.0025102办理，但是该飞机的维修记录包中未找到该技术评估单，不符合ESM QS 001要求的“技术评估单其复印件应与保留故障单一同存档”的要求'
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
      openReview: false,
      buttonSubmit: '分发',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      RecordingLoading: false,
      // 分页参数
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 3
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
    },
    /** 反馈按钮 */
    correctProblem() {
      this.form.auditReportNumber = this.ids[0].auditReportNumber
      this.form.itemNo = this.ids[0].itemNo
      this.form.findingProblemDesc = this.ids[0].description
      this.open = true
    },
    /* 提交证据 */
    submitEvidence() {
      this.openReview = true
    }
  }
}
</script>
