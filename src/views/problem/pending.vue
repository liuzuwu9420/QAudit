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
        <el-button type="warning" icon="el-icon-edit" size="mini" :disabled="single" @click="changeData()">问题属性</el-button>
        <el-button type="success" icon="el-icon-share" size="mini" :disabled="single" @click="correctProblem()">反馈纠正措施</el-button>
        <!-- <el-button type="success" icon="el-icon-share" size="mini" :disabled="single">复审验证</el-button> -->
        <el-button type="success" icon="el-icon-time" size="mini" :disabled="single">延期申请</el-button>
        <!-- <el-button type="primary" icon="el-icon-view" size="mini" :disabled="single">纠正措施报告</el-button>
        <el-button type="primary" icon="el-icon-view" size="mini" :disabled="single">延期申请报告</el-button>
        <el-button type="primary" icon="el-icon-view" size="mini" :disabled="single">复审验证单</el-button>
        <el-button type="primary" icon="el-icon-view" size="mini" :disabled="single">查看证据</el-button> -->
      </div>
    </div>
    <el-table
      v-loading="loading"
      :data="problemList"
      @selection-change="handleSelectionChange"
    >
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

    <!-- 添加或修改参数配置对话框 -->
    <dialog-problem :dialog-creating-problem="dialogCreatingProblem" :audit-problem-form="auditProblemForm" @close="dialogCreatingProblem=false" />
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="审核报告号">
              <el-input v-model="form.auditReportNumber" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项次号">
              <el-input v-model="form.itemNo" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="发现问题描述">
              <el-input
                v-model="form.findingProblemDesc"
                type="textarea"
                :autosize="{ minRows: 2}"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="整改要求">
              <el-input
                v-model="form.rectificationRequirements"
                type="textarea"
                :autosize="{ minRows: 2}"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择流程">
              <el-radio-group v-model="form.selectionProcess">
                <el-radio label="流程一" />
                <el-radio label="流程二" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="对问题是否接受">
              <el-radio-group v-model="form.acceptProblem">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col v-if="form.selectionProcess==='流程一'" :span="12">
            <el-form-item label="主责任科经理">
              <el-input v-model="form.responsibleManager" />
            </el-form-item>
          </el-col>
          <el-col v-if="form.selectionProcess==='流程二'" :span="12">
            <el-form-item label="协调员">
              <el-input v-model="form.coordinator" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任部门处经理">
              <el-input v-model="form.responsibleDepartmentManager" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">启动反馈</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import DialogProblem from '../components/dialog-problem'

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
  name: 'Pending',
  components: {
    Pagination,
    DialogProblem
  },
  data() {
    return {
      statusMap: statusMap,
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
          handleStarus: 'For Feedback',
          auditReportNumber: 'QS-Prod-20-41',
          itemNo: '01',
          findingLevel: 'Ⅱ',
          respdeptCodes: 'OBA',
          respdeptName: 'OBA',
          responsibleManager: '王宇',
          description: '抽查B-5919飞机放行证书，该飞机的维修记录包中未找到技术评估单'
        },
        {
          deptCode: 'OB',
          handleStarus: 'For Feedback',
          auditReportNumber: 'QS-Spec-19-101',
          itemNo: '07',
          findingLevel: 'Ⅱ',
          respdeptCodes: 'OB',
          respdeptName: 'OB',
          responsibleManager: '徐山',
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
      title: '',
      open: false,
      form: {
        auditReportNumber: '',
        itemNo: '',
        findingProblemDesc: '',
        rectificationRequirements: '',
        selectionProcess: '流程二',
        acceptProblem: '是',
        responsibleManager: '',
        coordinator: '',
        responsibleDepartmentManager: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
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
    getList() {

    },
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
      this.page.pageCount = 1
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log(valid)
          this.$message({
            message: '反馈成功',
            type: 'success'
          })
          this.open = false
        }
      })
    },
    changeData(row) {
      this.dialogCreatingProblem = true
    },
    correctProblem() {
      this.title = '纠正措施回复'
      this.open = true
      this.form.auditReportNumber = this.ids[0].auditReportNumber
      this.form.itemNo = this.ids[0].itemNo
      this.form.findingProblemDesc = this.ids[0].description
    }
  }
}
</script>
