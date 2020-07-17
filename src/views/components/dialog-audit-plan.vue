<template>
  <el-dialog title="审核计划属性" class="dialog" :visible.sync="show" width="1000px" append-to-body>
    <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="计划属性" name="first">
        <el-form ref="form" :model="form" label-width="140px">
          <el-row>
            <el-col :span="24">
              <el-form-item label="logo">
                <el-checkbox-group v-model="form.logoType">
                  <el-checkbox label="Ameco Beijing" name="type" />
                  <el-checkbox label="国航" name="type" />
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="单位">
                <el-input v-model="form.organizationName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="审核年份">
                <el-input v-model="form.planYear" />
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
              <el-form-item label="审阅">
                <el-input v-model="form.checkerName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="批准">
                <el-input v-model="form.approverName" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="批准日期">
                <el-input v-model="form.approvalDate" />
              </el-form-item>
            </el-col>
            <!-- <el-col :span="24">
              <el-form-item>
                <el-button type="primary" @click="submitFormReview">保存</el-button>
              </el-form-item>
            </el-col> -->
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="审核任务" name="second">
        <div class="head">
          <div class="head-buttons">
            <el-button type="warning" :disabled="single" icon="el-icon-view" size="mini" @click="jumpPdfDown">预览审核报告</el-button>
            <el-button type="warning" :disabled="single" icon="el-icon-view" size="mini" @click="jumpPdfDown">预览检查单</el-button>
            <el-button type="warning" :disabled="single" icon="el-icon-view" size="mini" @click="jumpPdfDown">预览反馈措施</el-button>
            <el-button type="warning" :disabled="single" icon="el-icon-view" size="mini" @click="jumpPdfDown">预览复审验证</el-button>
            <el-button type="warning" :disabled="single" icon="el-icon-view" size="mini" @click="jumpPdfDown">预览相关证据</el-button>
          </div>
        </div>
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
                <el-button type="text" @click="showSidepage(row)">{{ row.qaTaskId }}</el-button>
              </span>
            </template>
          </el-table-column> -->
          <el-table-column label="审核任务状态" align="center" width="110">
            <template v-slot="{row}">
              <el-tag size="mini">
                {{ row.statusCn }}
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
            show-overflow-tooltip
          />
          <el-table-column
            prop="description"
            label="审核描述"
            show-overflow-tooltip
          />
          <el-table-column
            label="计划审核时间(年-月)"
            width="150"
          >
            <template v-slot="{row}">
              {{ row.scheduledDateYear }} - {{ row.scheduledDateMonth }}
            </template>
          </el-table-column>
          <el-table-column
            prop="responsibleAuditorName"
            label="责任审核员"
          />
          <!-- <el-table-column label="操作" min-width="60px" fixed="right">
            <template v-slot="{row}">
              <el-tooltip
                class="item"
                effect="dark"
                content="查看详情"
                placement="top-end"
              >
                <el-button
                  type="success"
                  icon="el-icon-view"
                  size="mini"
                  @click="jumpLink(row)"
                />
              </el-tooltip>
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
      </el-tab-pane>
    </el-tabs>

  </el-dialog>
</template>
<script>
import { getAuditTask } from '@/api/auditTask'
import Pagination from '@/components/Pagination'
export default {
  name: 'AuditPlanDialog',
  components: {
    Pagination
  },
  props: {
    open: {
      required: true,
      type: Boolean,
      default() {
        return false
      }
    },
    form: {
      required: true,
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      activeName: 'first',
      show: false,
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
      loading: false,
      taskData: []
    }
  },
  watch: {
    open(val) {
      if (val) {
        this.getList()
      }
      this.show = val
    },
    show(val) {
      if (!val) {
        this.$emit('close', val)
      }
    }
  },
  methods: {
    getList(query = {}) {
      const params = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
        qaPlanId: this.form.qaPlanId
      }
      Object.assign(params, query)
      getAuditTask(params)
        .then(res => {
          this.taskData = res.obj
          this.page.total = +res.total
        })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    jumpPdfDown() {
      const data = '111'
      setTimeout(() => {
        const router = this.$router.resolve({
          path: '/pdf/download',
          query: {
            value: data
          }
        })
        window.open(router.href, '_blank')
      }, 500)
    },
    /* 跳转至问题与记录页面 */
    jumpLink(row) {
      console.log(row)
      /* this.$router.push({
        name: 'AuditProblemRecording',
        params: {
          select: 'itemNo',
          value: row.itemNo
        }
      }) */
    },
    submitFormReview(formName) {
      this.$refs[formName].validate(valid => {
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
<style lang="scss" scoped>
.dialog {
  /deep/ .pagination-container {
    height: 25px;
  }
}
</style>
