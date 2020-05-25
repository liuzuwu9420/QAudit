
<template>
  <div class="app-container">
    <div class="head">
      <div />
    </div>
    <div class="table-info">
      <el-table
        ref="table"
        :data="taskData"
        :loading="loading"
        header-align="center"
        highlight-current-row
        height="100%"
      >
        <el-table-column align="center" width="100" label="ID" prop="qaTaskId">
          <template v-slot="{row}">
            <span>
              <el-button type="text" @click="showSidepage(row)">{{ row.qaTaskId }}</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="审核任务状态" align="center" width="150">
          <template v-slot="{row}">
            <el-tag size="mini" :type="statusObj(row).type">
              <i :class="statusObj(row).icon" />
              {{ statusObj(row).name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="responsibleUnit"
          label="责任审核部门"
        />
        <el-table-column
          prop="auditee"
          label="被审部门/项目"
        />
        <el-table-column
          prop="description"
          label="审核描述"
        />
        <el-table-column
          prop="scheduledDateYear"
          label="计划审核时间（年）"
          width="120"
        />
        <el-table-column
          prop="scheduledDateMonth"
          label="计划审核时间（月）"
          width="120"
        />
        <el-table-column
          prop="responsibleAuditorName"
          label="责任审核员"
        />
        <el-table-column label="操作" width="200">
          <template v-slot="{row}">
            <el-button-group>
              <!-- 查看详情 -->
              <el-tooltip class="item" effect="dark" content="查看检查单" placement="top-end">
                <el-button
                  type="warning"
                  icon="el-icon-view"
                  size="mini"
                  @click="jumpLink(row)"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="同意" placement="top-end">
                <el-button
                  type="success"
                  size="mini"
                  icon="el-icon-circle-check"
                />
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="驳回" placement="top-end">
                <el-button
                  type="danger"
                  size="mini"
                  icon="el-icon-circle-close"
                />
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="page.total>0"
        :total="page.total"
        :page.sync="page.currentPage"
        :limit.sync="page.pageSize"
        @pagination="debounceGetList"
      />
      <!-- sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" /> -->
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
// import Search from '@/components/Search'
import { debounce } from '@/utils/index'
// import Sidepage from './components/Sidepage/task'
// import SidepageMixin from '@/mixins/toggleSidepage'
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
  name: 'TaskList',
  components: {
    Pagination
    // Search,
    // Sidepage
  },
  // mixins: [SidepageMixin],
  data() {
    return {
      statusMap: statusMap,
      selected: {
        items: [
          {
            value: 'qaTaskId',
            label: '任务id'
          }
        ]
      },
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 1
      },
      taskData: [
        {
          qaTaskId: 101, // 审核任务id
          qaPlanId: 1, // 审核计划id
          status: 'Editing', // 审核任务状态
          reportNo: '111', // 审核报告编号(1、审核任务点执行时；2、匹配检查单时生成)
          auditDate: '2020-02-20', // 审核日期(生成审核报告时展示，默认当天，可手动修改)
          auditCategory1: '航线协议维修单位审核/评估计划', // 审核计划1级分类(下拉：数据字典，选择专项审核时，二级分类变为手动输入)
          auditCategory2: '国内航线协议维修单位', // 审核计划2级分类(下拉：数据字典（1级分类级联）)
          auditee: 'SZX 深圳', // 被审部门/项目(下拉选择/数据字典（总部：选各基地；基地：选底下的部门）；数据库存代码，显示中文名。待补充)
          itemNo: '128', // 项次
          auditTypes: [
            {
              value: 'Syst',
              label: '系统审核'
            }, {
              value: 'Prod',
              label: '产品审核'
            }, {
              value: 'Syst+Prod',
              label: '系统与产品审核'
            }, {
              value: 'Line',
              label: '航站审核'
            }, {
              value: 'Ext',
              label: '机体维修单位'
            }], // 审核类型(下拉框：系统审核（Syst） 产品审核（Prod） 系统与产品审核（Syst+Prod） 航站审核（Line） 机体维修单位（Ext） 部附件维修单位（Ext） 零部件及消耗器材制造单位（Ext） 航材分销商（Ext） 系统与产品审核，在审核报告号中自动默认为Syst )
          auditType: '系统审核', // 审核类型
          description: '审核描述', // 审核描述
          scheduledDateYear: 2020, // 计划审核时间（年）
          scheduledDateMonth: 2, // 计划审核时间（月）
          auditInterval: 2, // 审核间隔(单位：月)
          responsibleAuditorId: 10001, // 责任审核员id
          responsibleAuditorNo: '8080', // 责任审核员工号
          responsibleAuditorName: '王宇', // 责任审核员名字
          auditorNames: '方坚', // 审核组员名字
          approverId: 20001, // 报告审批人id
          approverNo: '9090', // 报告审批人工号
          approverName: '柳旭', // 报告审批人名字
          approvalDate: '2020-03-30', // 报告审批日期
          objective: '', // 审核目的
          scope: '', // 审核范围
          auditConclusion: '符合', // 审核结论
          qualitySystem: [], // 体系
          responsibleUnit: 'QS', // 责任审核部门
          auditeeProperty: '', // 被审部门性质(对应检查单中的“适用范围”)
          logoType: 'Ameco', // logo类型(1.Ameco 2.国航)
          auditType2: 'line' // 审核报告中的审核类型
        }
      ],
      sidepagedata: {
        list: {},
        sidepageShow: false
      },
      loading: false
    }
  },
  mounted() {
    // this.getList()
  },
  methods: {
    /* resetPage() {
      this.page.currentPage = 1
      this.getList()
    }, */
    debounceGetList() {
      debounce(this.getList, 300)()
    },
    getList() {

    },
    searchChanged(obj) {
      if (obj.select === 'qaTaskId') {
        obj.value = parseInt(obj.value)
      }
      this.query = obj
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
    jumpLink(row) {
      this.$router.push({
        name: 'AuditConclusion',
        params: {
          select: 'id',
          value: row.qaTaskId
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.datePicker{
  margin-right: 10px;
}
</style>
