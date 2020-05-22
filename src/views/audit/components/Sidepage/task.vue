<template>
  <table-sidepage :show.sync="sidepagedata.sidepageShow" @close="sidepagedata.sidepageShow=false">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="基本属性" name="BasicAttribute">
        <el-row class="pane-part">
          <!-- <el-col :xs="24" :sm="24" :lg="16">
            <div class="left-head">
              <div class="left-head-name">
                <span class="headName">{{ sidepagedata.list.HOST_NAME }}</span>
                <span><el-tag :type="statusMap[sidepagedata.list.STATUS].type">{{ sidepagedata.list.STATUS | STAT }}</el-tag></span>
              </div>
            </div>
            <div class="left-body">
              <div class="left-head-title">
                <i class="el-icon-notebook-1" />
                <span class="head-title">概览</span>
              </div>
              <div class="detail-row">
                <div class="left-title">JL/U:</div>
                <span class="right-content">{{ sidepagedata.list['JL/U'] }}</span>
              </div>
              <div class="detail-row">
                <div class="left-title">MAX:</div>
                <span class="right-content">{{ sidepagedata.list.MAX }}</span>
              </div>
              <div class="detail-row">
                <div class="left-title">RUN:</div>
                <span class="right-content">{{ sidepagedata.list.RUN }}</span>
              </div>
              <div class="detail-row">
                <div class="left-title">NJOBS:</div>
                <div class="right-content">{{ sidepagedata.list.NJOBS }}</div>
              </div>
              <div class="detail-row">
                <div class="left-title">RSV:</div>
                <div class="right-content">{{ sidepagedata.list.RSV }}</div>
              </div>
              <div class="detail-row">
                <div class="left-title">SSUSP:</div>
                <div class="right-content">{{ sidepagedata.list.SSUSP }}</div>
              </div>
              <div class="detail-row">
                <div class="left-title">USUSP:</div>
                <div class="right-content">{{ sidepagedata.list.USUSP }}</div>
              </div>
            </div>
          </el-col> -->
        </el-row>
      </el-tab-pane>
      <!-- <el-tab-pane label="审核结论" name="taskData">
        <div class="pane-part">
          <div class="head">
            <div class="head-buttons">
              <el-button type="primary" size="small" class="head-button" @click="getHostTask">
                <i class="el-icon-refresh-right" />
              </el-button>
              <search :items="selected.items" @change="searchChanged" />

            </div>
            <div class="pagination">
              <pagination
                v-show="page.total>0"
                :total="page.total"
                :page.sync="page.currentPage"
                :limit.sync="page.pageSize"
                @pagination="getHostTask"
              />
            </div>
          </div>
          <div class="table-info">
            <el-table
              v-loading="loading"
              :data="tasksData"
              element-loading-text="Loading"
              style="width: 100%;"
              height="100%"
            >
              <el-table-column label="ID" width="100">
                <template v-slot="{row}">
                  <span>{{ row.JOBID }}</span>
                </template>
              </el-table-column>

              <el-table-column label="执行主机" show-overflow-tooltip>
                <template v-slot="{row}">
                  <span>{{ row.EXEC_HOST }}</span>
                </template>
              </el-table-column>
              <el-table-column label="作业状态" width="140">
                <template v-slot="{row}">
                  <el-tag size="mini" :type="statusMap[row.STAT].type">
                    <i :class="statusMap[row.STAT].icon" />
                    {{ row.STAT | STAT }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column label="队列">
                <template v-slot="{row}">
                  <el-tooltip class="item" effect="dark" content="跳转队列" placement="top">
                    <span class="jumpLink" @click="jumpQueue(row)">{{ row.QUEUE }}</span>
                  </el-tooltip>
                </template>
              </el-table-column>
              <el-table-column label="提交用户">
                <template v-slot="{row}">
                  <span>{{ row.USER }}</span>
                </template>
              </el-table-column>
              <el-table-column label="提交时间" show-overflow-tooltip>
                <template v-slot="{row}">
                  <span>{{ row.SUBMIT_TIME }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </table-sidepage>
</template>
<script>
// import Pagination from '@/components/Pagination'
import TableSidepage from '@/components/TableSidepage'
// import Search from '@/components/Search'
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
  name: 'TaskSidepage',
  components: {
    // Pagination,
    TableSidepage
    // Search
  },
  filters: {
    STAT(STAT) {
      return statusMap[STAT].name
    }
  },
  props: {
    sidepagedata: {
      required: true,
      type: Object,
      default() {
        return {
          list: {},
          tabName: '',
          sidepageShow: false
        }
      }
    }
  },
  data() {
    return {
      statusMap: statusMap,
      activeName: 'BasicAttribute',
      // 分页数据
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 0
      },
      // 查询数据
      selected: {
        items: [
          {
            value: 'ID',
            label: '任务ID'
          }
        ]
      },
      loading: false,
      tasksData: [{

      }],
      query: ''
    }
  },
  watch: {
    sidepagedata: {
      handler: function(val) {
        console.log(val)
        if (val.sidepageShow) {
          this.getHostTask()
        }
      },
      deep: true
    }
  },
  methods: {
    // 搜索
    searchChanged(data) {
      this.page.currentPage = 1
      if (data.select === 'jobID') {
        if (data.value === '') {
          // this.getHostTask()
        } else {
          this.query = data
          // this.getHostTask()
        }
      }
    }
    // 跳转用户
    /* jumpUser(data) {
      const _this = this
      _this.$router.push({
        name: 'role.user',
        params: {
          select: 'name',
          value: data.USER
        }
      })
    }, */
  }
}
</script>

<style lang="scss" scoped>
.pane-part {
    padding: 0 10px;
    flex-grow:1;
    display: flex;
    flex-flow: column;
    .head-button{
      margin-right: 10px;
    }
  }
  .left-head {
    margin-top: 20px;
    line-height: 20px;
    font-size: 0;
    color: #1a2736;
    .headName {
      font-size: 24px;
      line-height: 26px;
      height: 26px;
      padding: 0 0 0 1px;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .left-head-name {
      margin-bottom: 5px;
    }
    .hosts-tags {
      font-size: 16px;
      margin-right: 10px;
    }
  }
  .left-body {
    margin-top: 30px;
    .left-head-title {
      border-bottom: 1px solid #5e6978;
      padding-bottom: 8px;
      color: #1a2736;
      font-size: 18px;
      margin-right: 60px;
      margin-bottom: 5px;
    }
  }
  .head-title {
    margin-left: 5px;
  }
  .right-head-title {
    border-bottom: 1px solid #5e6978;
    padding-bottom: 8px;
    color: #1a2736;
    font-size: 18px;
    margin-right: 60px;
    margin-bottom: 5px;
    margin-top: 40px;
  }
  .detail-row {
    padding-top: 20px;
    height: 40px;
    font-size: 14px;
    line-height: 24px;
    margin-right: 60px;
  }
  .left-title {
    width: 130px;
    color: #5e6978;
    float: left;
    margin-right: 5px;
    overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
  }
  .left-content {
    color: #1a2736;
    overflow: auto;
  }
  .right-content {
    overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
  }
  .jumpLink {
    cursor: pointer;
    color: #49b0f9;
  }
</style>
