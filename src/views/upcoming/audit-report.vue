
<template>
  <div class="app-container">
    <div class="head">
      <el-button
        type="primary"
        icon="el-icon-edit"
        size="mini"
        :disabled="single"
        @click="changeData()"
      >审核报告属性</el-button>
      <el-button
        type="warning"
        icon="el-icon-s-check"
        size="mini"
        :disabled="single"
        @click="jumpPdfDown"
      >审核</el-button>
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
        :data="reportData"
        :loading="loading"
        header-align="center"
        highlight-current-row
        height="100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column
          prop="responsibleUnit"
          label="责任审核部门"
          width="140"
          show-overflow-tooltip
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
          label="计划审核年"
        />
        <el-table-column
          prop="scheduledDateMonth"
          label="计划审核月"
        />
        <el-table-column
          prop="startingDate"
          label="审核开始日期"
        />
        <el-table-column
          prop="completionDate"
          label="审核结束日期"
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
      <!-- <sidepage v-if="sidepagedata.sidepageShow" ref="Sidepage" :sidepagedata.sync="sidepagedata" /> -->
    </div>
    <!-- 添加或修改参数配置对话框 -->
    <el-dialog title="审核报告属性" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" label-width="140px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="审核报告编号">
              <el-input v-model="form.auditReportNum" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核开始日期">
              <el-input v-model="form.startingDate" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核结束日期">
              <el-input v-model="form.completionDate" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审核报告分发">
              <el-input v-model="form.auditReportDistribute" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审核报告抄送">
              <el-input v-model="form.auditReportCC" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="被审核单位">
              <el-input v-model="form.auditedUnit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核类型">
              <el-input v-model="form.auditType" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-row>
              <el-col style="width: 140px; text-align: right; padding: 40px 12px 0 0; font-weight: 700;">
                审核组
              </el-col>
              <el-col style="width: calc(100% - 140px);">
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="责任审核员">
                      <el-input v-model="form.teamLeader" />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="组员">
                      <el-input v-model="form.teamNum" />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批准人">
              <el-input v-model="form.approver" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="批准日期">
              <el-input v-model="form.approvalDate" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFormSave">保存</el-button>
        <!-- <el-button type="primary" :disabled="true" @click="submitFormPreview">预览</el-button> -->
      </div>
    </el-dialog>
    <dialog-approve :title="title" :open="dialogCreatingReport" @close="closeReport" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { debounce } from '@/utils/index'
import DialogApprove from '../components/dialog-approve'

export default {
  name: 'AuditReport',
  components: {
    Pagination,
    DialogApprove
  },
  data() {
    return {
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
      reportData: [
        {
          responsibleUnit: 'QS', // 责任审核部门
          auditee: 'SZX 深圳', // 被审部门/项目(下拉选择/数据字典（总部：选各基地；基地：选底下的部门）；数据库存代码，显示中文名。待补充)
          description: '审核描述', // 审核描述
          scheduledDateYear: 2020, // 计划审核时间（年）
          scheduledDateMonth: 2, // 计划审核时间（月）
          startingDate: '2020-02-20', // 审核开始日期
          completionDate: '2020-02-20', // 审核结束日期
          responsibleAuditorId: 10001, // 责任审核员id
          responsibleAuditorNo: '8080', // 责任审核员工号
          responsibleAuditorName: '王宇' // 责任审核员名字
        }
      ],
      loading: false,
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        auditReportNum: '',
        startingDate: '',
        completionDate: '',
        auditReportDistribute: '',
        auditReportCC: '',
        auditedUnit: '',
        auditType: '',
        teamLeader: '',
        teamNum: '',
        approver: '',
        approvalDate: ''
      },
      dialogCreatingReport: false,
      title: ''
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
    changeData() {
      this.open = true
    },
    closeReport() {
      this.dialogCreatingReport = false
    },
    jumpPdfDown() {
      this.dialogCreatingReport = true
      this.title = '审核报告审批'
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
    submitFormSave() {
      console.log('submit!')
    },
    submitFormPreview() {
      console.log('submit!')
      this.jumpPdfDown()
    }
  }
}
</script>
