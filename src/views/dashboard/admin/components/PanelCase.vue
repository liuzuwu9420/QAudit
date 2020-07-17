<template>
  <el-row class="panel-case" :gutter="20">
    <el-col :xs="24" :sm="12" :lg="12">
      <el-card>
        <el-tabs v-model="activeNameUpcoming" @tab-click="handleUpcomingClick">
          <el-tab-pane name="first">
            <span slot="label">
              <el-badge :value="planList.length" :max="99" class="item">
                <el-button type="text" size="small">审核计划待办</el-button>
              </el-badge>
            </span>
            <el-table
              ref="table"
              :data="planList"
              :loading="loadingPlan"
              :show-header="false"
              header-align="center"
              highlight-current-row
              height="100%"
              row-class-name="table-row"
            >
              <el-table-column type="index" width="50" class-name="el-table-index" />
              <el-table-column prop="planName" label="审核计划名称" width="140" show-overflow-tooltip />
              <el-table-column prop="organizationName" label="单位名称" show-overflow-tooltip />
              <el-table-column label="审核计划状态" align="center" width="60">
                <template v-slot="{row}">
                  <el-tag size="mini" :type="statusObj(row).type">
                    <i :class="statusObj(row).icon" />
                    {{ statusObj(row).name }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="planYear" label="审核计划年份" width="80" />
            </el-table>
          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label">
              <el-badge :value="reportList.length" :max="99" class="item">
                <el-button type="text" size="small">审核报告待办</el-button>
              </el-badge>
            </span>
            <el-table
              ref="table"
              :data="reportList"
              :loading="loadingReport"
              :show-header="false"
              header-align="center"
              highlight-current-row
              height="100%"
              row-class-name="table-row"
            >
              <el-table-column type="index" width="50" class-name="el-table-index" />
              <el-table-column
                prop="responsibleUnit"
                label="责任审核部门"
                width="140"
                show-overflow-tooltip
              />
              <el-table-column
                prop="auditee"
                label="被审部门/项目"
                show-overflow-tooltip
              />
              <el-table-column
                label="计划审核年-月"
              >
                <template v-slot="{row}">
                  {{ row.scheduledDateYear }} - {{ row.scheduledDateMonth }}
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane name="third">
            <span slot="label">
              <el-badge :value="processingList.length" :max="99" class="item">
                <el-button type="text" size="small">问题处理待办</el-button>
              </el-badge>
            </span>
            <el-table
              ref="table"
              :data="processingList"
              :loading="loadingProcessing"
              :show-header="false"
              header-align="center"
              highlight-current-row
              height="100%"
              row-class-name="table-row"
            >
              <el-table-column type="index" width="50" class-name="el-table-index" />
              <el-table-column label="部门代码" align="center" prop="deptCode" width="80" show-overflow-tooltip />
              <el-table-column label="状态" align="center" width="60">
                <template v-slot="{row}">
                  <el-tag size="mini" :type="statusObj(row).type">
                    <i :class="statusObj(row).icon" />
                    {{ statusObj(row).name }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="审核报告编号" align="center" width="140" prop="auditReportNumber" show-overflow-tooltip />
              <el-table-column label="项次" align="center" width="50" prop="itemNo" />
              <el-table-column label="问题等级" align="center" width="50" prop="findingLevel" />
              <el-table-column label="责任经理" align="center" prop="responsibleManager" show-overflow-tooltip />
              <el-table-column label="当前流程" align="center" width="80" prop="currentProcess" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
    <el-col :xs="24" :sm="12" :lg="12">
      <el-card>
        <el-tabs v-model="activeNameProblem" @tab-click="handleProblemClick">
          <el-tab-pane name="first">
            <span slot="label">
              <el-badge :value="pendingProblemList.length" :max="99" class="item">
                <el-button type="text" size="small">待处理问题</el-button>
              </el-badge>
            </span>
            <el-table
              ref="table"
              :data="pendingProblemList"
              :loading="loadingPendingProblem"
              :show-header="false"
              header-align="center"
              highlight-current-row
              height="100%"
              row-class-name="table-row"
            >
              <el-table-column type="index" width="50" class-name="el-table-index" />
              <el-table-column label="部门代码" align="center" prop="deptCode" width="80" show-overflow-tooltip />
              <el-table-column label="状态" align="center" width="60">
                <template v-slot="{row}">
                  <el-tag size="mini" :type="statusObj(row).type">
                    <i :class="statusObj(row).icon" />
                    {{ statusObj(row).name }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="审核报告编号" align="center" width="140" prop="auditReportNumber" show-overflow-tooltip />
              <el-table-column label="项次" align="center" width="50" prop="itemNo" />
              <el-table-column label="问题等级" align="center" width="50" prop="findingLevel" />
              <el-table-column label="责任经理" align="center" prop="responsibleManager" show-overflow-tooltip />
            </el-table>
          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label">
              <el-badge :value="processingProblemList.length" :max="99" class="item">
                <el-button type="text" size="small">处理中问题</el-button>
              </el-badge>
            </span>
            <el-table
              ref="table"
              :data="processingProblemList"
              :loading="loadingprocessingProblem"
              :show-header="false"
              header-align="center"
              highlight-current-row
              height="100%"
              row-class-name="table-row"
            >
              <el-table-column type="index" width="50" class-name="el-table-index" />
              <el-table-column label="部门代码" align="center" prop="deptCode" width="80" show-overflow-tooltip />
              <el-table-column label="状态" align="center" width="60">
                <template v-slot="{row}">
                  <el-tag size="mini" :type="statusObj(row).type">
                    <i :class="statusObj(row).icon" />
                    {{ statusObj(row).name }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="审核报告编号" align="center" width="140" prop="auditReportNumber" show-overflow-tooltip />
              <el-table-column label="项次" align="center" width="50" prop="itemNo" />
              <el-table-column label="问题等级" align="center" width="50" prop="findingLevel" />
              <el-table-column label="责任经理" align="center" prop="responsibleManager" show-overflow-tooltip />
              <el-table-column label="当前流程" align="center" width="80" prop="currentProcess" />
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
const statusMap = {
  Editing: {
    name: '编辑中',
    type: 'info'
  },
  'For Check': {
    name: '待校对',
    type: 'info'
  },
  'For Approve': {
    name: '待审批',
    type: 'info'
  },
  'For Excute': {
    name: '待执行',
    type: 'warning'
  },
  Excuting: {
    name: '执行中',
    type: 'warning'
  },
  Completed: {
    name: '已完成',
    type: 'success'
  },
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
  name: 'PanelCase',
  data() {
    return {
      statusMap: statusMap,
      activeNameUpcoming: 'first',
      activeNameProblem: 'first',
      loadingPlan: false,
      loadingReport: false,
      loadingProcessing: false,
      loadingPendingProblem: false,
      loadingprocessingProblem: false,
      planList: [
        {
          qaPlanId: 1, // id
          status: 'For Approve', // 审核计划状态
          organizationName: '航空安全与质量管理部', // 单位名称
          planYear: 2020, // 计划年份
          planName: '修建1号大厅' // 审核计划名称
        },

        {
          qaPlanId: 2, // id
          status: 'For Excute', // 审核计划状态
          organizationName: '航空安全与质量管理部', // 单位名称
          planYear: 2020, // 计划年份
          planName: '修建2号大厅' // 审核计划名称
        }
      ],
      reportList: [
        {
          responsibleUnit: 'QS', // 责任审核部门
          auditee: 'SZX 深圳', // 被审部门/项目(下拉选择/数据字典（总部：选各基地；基地：选底下的部门）；数据库存代码，显示中文名。待补充)
          scheduledDateYear: 2020, // 计划审核时间（年）
          scheduledDateMonth: 2 // 计划审核时间（月）
        }
      ],
      processingList: [
        {
          deptCode: 'OBA',
          status: 'reviewing',
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
          status: 'Feedbacking',
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
          status: 'For review',
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
      pendingProblemList: [
        {
          deptCode: 'OBA',
          status: 'For Feedback',
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
          status: 'For Feedback',
          auditReportNumber: 'QS-Spec-19-101',
          itemNo: '07',
          findingLevel: 'Ⅱ',
          respdeptCodes: 'OB',
          respdeptName: 'OB',
          responsibleManager: '徐山',
          description: '维修记录抽查发现，对于涉及的记录不完整'
        }
      ],
      processingProblemList: [
        {
          deptCode: 'OBA',
          status: 'reviewing',
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
          status: 'Feedbacking',
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
          status: 'For review',
          auditReportNumber: 'QS-Spec-19-101',
          itemNo: '08',
          findingLevel: 'Ⅱ',
          respdeptCodes: 'OB',
          respdeptName: 'OB',
          responsibleManager: '',
          currentProcess: '延期流程',
          description: '抽查B-9飞机放行证书，该证书描述三个故障经用户要求保留，其中保留故障单DD No. 0220294的申请基于技术评估单No.0025102办理，但是该飞机的维修记录包中未找到该技术评估单，不符合ESM QS 001要求的“技术评估单其复印件应与保留故障单一同存档”的要求'
        }
      ]
    }
  },
  created: function() {
    // this.getData()
  },
  methods: {
    getData() {},
    handleUpcomingClick(tab, event) {
      console.log(tab, event)
    },
    handleProblemClick(tab, event) {
      console.log(tab, event)
    },
    statusObj(row) {
      if (row.status) {
        return statusMap[row.status]
      } else {
        return {
          name: 'Unknown',
          type: 'info',
          icon: 'el-icon-circle-close'
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.panel-case {
  /deep/ .el-badge__content.is-fixed {
    top: 20px;
    right: 0px;
  }
  /deep/ .table-row {
    cursor: pointer;
    &:hover {
      .el-table-index .cell div {
        background: #323159;
      }
    }
    /deep/ .el-table-index .cell div {
      width: 20px;
      height: 20px;
      border-radius: 10px;
      background: #cccccc;
      text-align: center;
      font-size: 12px;
      color: #ffffff;
      line-height: 20px;
    }
  }
}
</style>
