
<template>
  <div class="app-container">
    <div class="head">
      <div class="datePicker">
        <el-date-picker
          v-model="dateTime"
          type="year"
          placeholder="选择年"
        />
      </div>
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
        <el-table-column align="center" width="100" label="ID" prop="qaPlanId">
          <template v-slot="{row}">
            <span>
              <el-button type="text" @click="showSidepage(row)">{{ row.qaPlanId }}</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="审核计划状态" align="center" width="150">
          <template v-slot="{row}">
            <el-tag size="mini" :type="statusObj(row).type">
              <i :class="statusObj(row).icon" />
              {{ statusObj(row).name }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="planName"
          label="审核计划名称"
        />
        <el-table-column
          prop="organizationName"
          label="单位名称"
        />
        <el-table-column
          prop="planYear"
          label="审核计划年份"
          width="120"
        />
        <el-table-column
          prop="writterName"
          label="编写人"
        />
        <el-table-column
          prop="writteDate"
          label="编写日期"
        />
        <el-table-column
          prop="approverName"
          label="审批人"
        />
        <el-table-column
          prop="approvalDate"
          label="审批日期"
        />
        <el-table-column label="操作" width="200">
          <template v-slot="{row}">
            <el-button-group>
              <!-- 查看详情 -->
              <el-tooltip class="item" effect="dark" content="查看任务" placement="top-end">
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
      <!-- <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" /> -->
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
// import Search from '@/components/Search'
import { debounce } from '@/utils/index'
// import Sidepage from './components/Sidepage/plan'
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
      dateTime: '2020',
      selected: {
        items: [
          {
            value: 'qaPlanId',
            label: '计划id'
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
          logoType: 'Ameco', // logo类型(1.Ameco 2.国航)
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
      loading: false
    }
  },
  watch: {
    dateTime(val) {
      if (!val) {
        this.taskData = []
        return
      }
      if ((typeof val[0]) === 'string') {
        val[0] = new Date(val[0])
        val[1] = new Date(val[1])
      }
      // this.resetPage()
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
      if (obj.select === 'qaPlanId') {
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
        name: 'AuditTask',
        params: {
          select: 'name',
          value: row.planName
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
