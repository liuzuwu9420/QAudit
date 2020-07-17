
<template>
  <div class="app-container">
    <div class="head">
      <el-form ref="queryForm" :model="queryParams" :inline="true" label-width="68px">
        <!-- <el-form-item label="任务id" prop="qaTaskId">
          <el-input
            v-model="queryParams.qaTaskId"
            placeholder="请输入任务id"
            clearable
            size="small"
            style="width: 240px"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <el-form-item label="任务状态" prop="statusEn">
          <el-select
            v-model="queryParams.statusEn"
            placeholder="请选择任务状态"
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
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            :disabled="single"
            @click="changeData()"
          >审核任务属性</el-button>
          <el-button
            type="warning"
            icon="el-icon-share"
            size="mini"
            :disabled="single"
          >提交</el-button>
          <el-button
            type="success"
            icon="el-icon-view"
            size="mini"
            :disabled="single"
            @click="jumpLink()"
          >查看检查单</el-button>
        </el-form-item>
      </el-form>
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
        <!-- <el-table-column align="center" width="100" label="ID" prop="qaTaskId">
          <template v-slot="{row}">
            <span>
              <el-button type="text">{{ row.qaTaskId }}</el-button>
            </span>
          </template>
        </el-table-column> -->
        <el-table-column label="审核任务状态" align="center" width="150">
          <template v-slot="{row}">
            <el-tag size="mini">
              {{ row.statusCn }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="responsibleUnit"
          label="责任审核部门"
          show-overflow-tooltip
        />
        <el-table-column
          prop="auditee"
          label="被审部门/项目"
          show-overflow-tooltip
        />
        <el-table-column
          prop="description"
          label="审核描述"
          show-overflow-tooltip
        />
        <el-table-column
          prop="scheduledDateYear"
          label="计划审核时间(年)"
          width="130"
        />
        <el-table-column
          prop="scheduledDateMonth"
          label="计划审核时间(月)"
          width="130"
        />
        <el-table-column
          prop="responsibleAuditorName"
          label="责任审核员"
        />
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
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="审核任务属性" :visible.sync="open" width="1000px" append-to-body>
      <el-form ref="form" :model="form" label-width="140px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="审核一级分类">
              <el-input v-model="form.auditCategory1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核二级分类">
              <el-input v-model="form.auditCategory2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核类型">
              <el-input v-model="form.auditType" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="子类型">
              <el-input v-model="form.subAuditType" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="被审部门/项目">
              <el-input v-model="form.auditee" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="被审部门/项目性质">
              <el-input v-model="form.auditeeProperty" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否EASA审核报告">
              <el-radio-group v-model="form.isEASAAuditReport">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否CAAC">
              <el-radio-group v-model="form.isCaac">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审查编号">
              <el-input v-model="form.auditNo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="项次">
              <el-input v-model="form.itemNo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否合并执行">
              <el-radio-group v-model="form.isConsolidated">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核描述">
              <el-input v-model="form.description" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否被审部门的描述">
              <el-radio-group v-model="form.isDeptDesc">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划审核年">
              <el-input v-model="form.scheduledDateYear" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="计划审核月">
              <el-input v-model="form.scheduledDateMonth" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核间隔">
              <el-input v-model="form.auditInterval" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Logo">
              <el-checkbox-group v-model="form.logoType">
                <el-checkbox label="Ameco Beijing" name="type" />
                <el-checkbox label="国航" name="type" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="外部局方或机构">
              <el-input v-model="form.outsiders" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任审核员">
              <el-input v-model="form.responsibleAuditorName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任审核单位">
              <el-input v-model="form.responsibleUnit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="体系">
              <el-checkbox-group v-model="form.qualitySystem">
                <el-checkbox label="Part 121 工程委托（Engineering Subcontracting）" name="type" />
                <el-checkbox label="Part 145 维修管理（Maintenance Management）" name="type" />
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核支援单位">
              <el-input v-model="form.supportUnitNames" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input v-model="form.remark" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="open=false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { debounce } from '@/utils/index'
import { getAuditTask } from '@/api/auditTask'
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
  name: 'AuditTask',
  components: {
    Pagination
    // Search,
    // Sidepage
  },
  // mixins: [SidepageMixin],
  data() {
    return {
      statusMap: statusMap,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 1
      },
      // 查询参数
      queryParams: {
        qaTaskId: undefined,
        statusEn: undefined,
        statusOptions: [
          {
            value: 'Editing',
            label: '编辑中'
          }, {
            value: 'For Check',
            label: '待校对'
          }, {
            value: 'For Approve',
            label: '待审批'
          }, {
            value: 'Excuting',
            label: '执行中'
          }, {
            value: 'Completed',
            label: '已完成'
          }]
      },
      taskData: [],
      sidepagedata: {
        list: {},
        sidepageShow: false
      },
      loading: false,
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {}
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    /* resetPage() {
      this.page.currentPage = 1
      this.getList()
    }, */
    debounceGetList() {
      debounce(this.getList, 300)()
    },
    getList(query = {}) {
      const params = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
        qaPlanId: this.form.qaPlanId
      }
      Object.assign(params, query)
      getAuditTask(params)
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

    /** 搜索按钮操作 */
    handleQuery() {
      this.page.currentPage = 1
      const query = {
        statusEn: this.queryParams.statusEn
      }
      this.getList(query)
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
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = [...selection]
      this.single = selection.length !== 1
    },
    changeData() {
      this.form = this.ids[0]
      this.open = true
    },
    jumpLink() {
      this.$router.push({
        name: 'AuditConclusion',
        params: {
          select: 'id',
          value: this.ids[0].qaTaskId
        }
      })
    },
    submitForm() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!!')
          return false
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
