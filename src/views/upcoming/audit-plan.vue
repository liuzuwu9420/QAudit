
<template>
  <div class="app-container">
    <div class="head">
      <div class="datePicker">
        <el-date-picker
          v-model="dateTime"
          type="year"
          placeholder="选择年"
          value-format="yyyy"
        />
      </div>

      <el-button
        type="primary"
        icon="el-icon-edit"
        size="mini"
        :disabled="single"
        @click="changeData()"
      >审核计划属性</el-button>
      <el-button
        v-if="upcomingBool"
        type="warning"
        icon="el-icon-s-check"
        size="mini"
        :disabled="single"
        @click="jumpPdfDown"
      >审批</el-button>
      <!-- <el-button
        type="success"
        size="mini"
        icon="el-icon-circle-check"
        :disabled="multiple"
      >同意</el-button>
      <el-button
        type="danger"
        size="mini"
        icon="el-icon-circle-close"
        :disabled="multiple"
      >驳回</el-button> -->
    </div>
    <div class="table-info">
      <el-table
        ref="table"
        :data="taskData"
        :loading="loading"
        header-align="center"
        highlight-current-row
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40" align="center" />
        <!-- <el-table-column align="center" width="60" label="ID" prop="qaPlanId">
          <template v-slot="{row}">
            <span>
              <el-button type="text">{{ row.qaPlanId }}</el-button>
            </span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="planYear"
          label="审核计划年份"
          width="120"
        />
        <el-table-column
          prop="planName"
          label="审核计划名称"
          width="140"
          show-overflow-tooltip
        />
        <el-table-column label="审核计划状态" align="center" width="110">
          <template v-slot="{row}">
            <el-tag size="mini">
              {{ row.statusCn }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="organizationCode"
          label="单位代码"
          show-overflow-tooltip
        />
        <el-table-column
          prop="organizationName"
          label="单位名称"
          show-overflow-tooltip
        />
        <el-table-column
          prop="writterName"
          label="编写人"
        />
        <el-table-column
          prop="writteDate"
          label="编写日期"
          show-overflow-tooltip
        />
        <el-table-column
          prop="approverName"
          label="审批人"
        />
        <el-table-column
          prop="approvalDate"
          label="审批日期"
          show-overflow-tooltip
        />
      </el-table>

      <pagination
        v-show="page.total>0"
        :total="page.total"
        :page.sync="page.currentPage"
        :limit.sync="page.pageSize"
        @pagination="debounceGetList"
      />
      <!-- <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" /> -->
    </div>
    <!-- 添加或修改参数配置对话框 -->
    <dialog-audit-plan :open="dialogCreatingAuditPlan" :form="form" @close="closeAuditPlan" />
    <dialog-approve :title="title" :open="dialogCreatingApprove" @close="closeApprove" />
  </div>
</template>

<script>
import { debounce } from '@/utils/index'
import { getAuditPlan } from '@/api/auditPlan'
import Pagination from '@/components/Pagination'
// import Search from '@/components/Search'
import DialogAuditPlan from '../components/dialog-audit-plan'
import DialogApprove from '../components/dialog-approve'
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
  }
}
export default {
  name: 'AuditPlan',
  components: {
    Pagination,
    DialogAuditPlan,
    DialogApprove
    // Search,
    // Sidepage
  },
  // mixins: [SidepageMixin],
  data() {
    return {
      statusMap: statusMap,
      dateTime: '2020',
      upcomingBool: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 1
      },
      taskData: [
        {
          qaPlanId: 1, // id
          status: 'Editing', // 审核计划状态
          organizationCode: '航空安全与质量管理部', // 单位名称
          writterId: 30001, // 编写人id
          writterNo: '9527', // 编写人工号
          writterName: '方坚', // 编写人名字
          checkerId: 20001, // 校对人id
          checkerNo: '9090', // 校对人工号
          checkerName: '柳旭', // 校对人名字
          approverId: 10001, // 审批人id
          approverNo: '8080', // 审批人工号
          approverName: '王宇', // 审批人名字
          approvalDate: '2020-02-20', // 审批日期
          approvalRemark: '', // 审批备注
          qualitySystem: [], // 体系
          generalDescription: '', // 概述
          creater: 10010, // 创建人
          createrNo: '10010', // 创建人工号
          createTime: '2020-01-21', // 创建时间
          changer: 10009, // 修改人
          changerNo: '6789', // 修改人工号
          changeTime: '2020-03-20', // 修改时间
          deleter: 10005, // 删除人
          deleterNo: '10005', // 删除人工号
          deleteTime: '2020-04-01', // 删除时间
          planYear: 2020, // 计划年份
          logoType: ['1', '2'], // logo类型(1.Ameco 2.国航)
          bpmTaskId: '111', // bpm流程任务id
          planName: '修建3号大厅', // 审核计划名称
          organizationName: '航空安全与质量管理部', // 单位名称
          writteDate: '2020-01-01', // 编写时间
          checkDate: '2020-03-30', // 校对时间
          checkRemark: '' // 校对备注
        }
      ],
      sidepagedata: {
        list: {},
        sidepageShow: false
      },
      loading: false,
      // 表单参数
      form: {
        logoType: [],
        organizationName: '',
        planYear: '',
        qualitySystem: [],
        checkerName: '',
        approverName: '',
        approvalDate: ''
      },
      dialogCreatingAuditPlan: false,
      dialogCreatingApprove: false,
      title: '',
      route: {}
    }
  },
  watch: {
    dateTime(val) {
      if (!val) {
        this.taskData = []
        return
      }
      if ((typeof val) === 'object') {
        val = `${new Date(val).getFullYear()}`
        this.page.currentPage = 1
      }
      this.searchChanged()
    },
    $route(val) {
      if (val.name === 'AuditPlan') {
        this.route = val
        this.toPath()
      }
    }
  },
  mounted() {
    this.route = this.$route
    this.searchChanged()
    // this.getList()
  },
  methods: {
    /* resetPage() {
      this.page.currentPage = 1
      this.getList()
    }, */
    toPath(query = {}) {
      let params
      const val = this.route
      if (val.path === '/plan/index') {
        this.upcomingBool = false
        params = {
          pageNum: this.page.currentPage,
          pageSize: this.page.pageSize
        }
        Object.assign(params, query)
        this.getList(params)
      } else if (val.path === '/upcoming/plan') {
        this.upcomingBool = true
      }
    },
    debounceGetList() {
      debounce(this.searchChanged, 300)()
    },
    getList(params) {
      getAuditPlan(params)
        .then(res => {
          this.taskData = res.obj.map(item => {
            if (item.logoType) {
              const logo = item.logoType.split(',')
              item.logoType = logo.map(logoItem => {
                if (logoItem === '1') {
                  logoItem = 'Ameco Beijing'
                } else if (logoItem === '2') {
                  logoItem = '国航'
                }
                return logoItem
              })
            } else { item.logoType = [] }
            if (item.qualitySystem) {
              item.qualitySystem = item.qualitySystem.split(',')
            } else { item.qualitySystem = [] }
            return item
          })
          this.page.total = +res.total
        })
    },
    searchChanged() {
      const query = {
        planYear: this.dateTime
      }
      this.toPath(query)
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
    },
    changeData() {
      this.dialogCreatingAuditPlan = true
      this.form = this.ids[0]
    },
    closeAuditPlan() {
      this.dialogCreatingAuditPlan = false
    },
    closeApprove() {
      this.dialogCreatingApprove = false
    },
    /* jumpLink(row) {
      this.$router.push({
        name: 'AuditTask',
        params: {
          select: 'name',
          value: row.planName
        }
      })
    }, */
    jumpPdfDown() {
      this.dialogCreatingApprove = true
      this.title = '审核计划审批'
      /* const data = '111'
      setTimeout(() => {
        const router = this.$router.resolve({
          path: '/pdf/download',
          query: {
            value: data
          }
        })
        window.open(router.href, '_blank')
      }, 500) */
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    submitFormApprove() {
      console.log('submit!')
    },
    submitFormPreview() {
      console.log('submit!')
    }
  }
}
</script>
<style scoped lang="scss">
.datePicker{
  margin-right: 10px;
  /deep/ .el-input--medium .el-input__inner {
    height: 29px;
    line-height: 29px;
  }
  /deep/ .el-input--medium .el-input__icon {
    line-height: 29px;
  }
}
a .el-button {
  margin: 0 10px;
}
</style>
