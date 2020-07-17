<template>
  <el-dialog title="纠正措施反馈、评估及复审验证" class="dialog" :visible.sync="show" width="1000px" append-to-body>
    <div class="table-container">
      <div class="head">
        <div class="title">立即采取的纠正/补救措施</div>
        <div class="head-buttons">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="changeImmediateMeasures()"
          >编辑证据</el-button>
        </div>
        <div class="pagination">
          <pagination
            v-show="pageImmediateMeasures.total>0"
            :id="pageImmediateMeasures.id"
            :total="pageImmediateMeasures.total"
            :page.sync="pageImmediateMeasures.currentPage"
            :limit.sync="pageImmediateMeasures.pageSize"
            :layout="pageImmediateMeasures.layout"
            @pagination="GetListImmediateMeasures"
          />
        </div>
      </div>
      <el-table
        :data="immediateMeasuresData"
        highlight-current-row
        style="width: 100%;"
        height="100%"
        @selection-change="handleImmediateMeasures"
      >
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column prop="immediateCauseDesc" label="措施类型" />
        <el-table-column prop="department" show-overflow-tooltip label="措施内容" />
        <el-table-column width="140px" prop="respDeptCodes" label="责任部门代码" />
        <el-table-column width="100px" prop="writter" label="责任人" />
        <el-table-column width="150px" prop="department" label="完成时间" />
      </el-table>
    </div>
    <div class="table-container">
      <div class="head">
        <div class="title">针对根本原因分析采取的对应纠正措施</div>
        <div class="head-buttons">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            :disabled="singleLon"
            @click="changeLongTermMeasures()"
          >编辑证据</el-button>
        </div>
        <div class="pagination">
          <pagination
            v-show="pageLongTermMeasures.total>0"
            :id="pageLongTermMeasures.id"
            :total="pageLongTermMeasures.total"
            :page.sync="pageLongTermMeasures.currentPage"
            :limit.sync="pageLongTermMeasures.pageSize"
            :layout="pageLongTermMeasures.layout"
            @pagination="GetListLongTermMeasures"
          />
        </div>
      </div>
      <el-table
        :data="longTermMeasuresData"
        highlight-current-row
        style="width: 100%;"
        height="100%"
        @selection-change="handleLongTermMeasures"
      >
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column prop="immediateCauseDesc" label="措施类型" />
        <el-table-column prop="department" show-overflow-tooltip label="措施内容" />
        <el-table-column width="100px" prop="respDeptCodes" label="责任部门代码" />
        <el-table-column width="100px" prop="writter" label="责任人" />
        <el-table-column width="150px" prop="department" label="完成时间" />
      </el-table>
    </div>

    <div style="text-align: right;">
      <el-button
        type="success"
        size="mini"
        @click="startReview()"
      >启动复审</el-button>
    </div>
    <el-dialog
      width="1000px"
      title="上传证据"
      :visible.sync="innerVisible"
      append-to-body
    >
      <el-form ref="form" :model="form" label-width="140px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="纠正措施描述">
              <el-input v-model="form.correctiveActionDept" type="textarea" :autosize="{ minRows: 2}" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="责任人">
              <el-input v-model="form.writter" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="完成日期">
              <el-input v-model="form.completionDate" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="措施完成情况描述">
              <el-input v-model="form.measuresCompletionDept " type="textarea" :autosize="{ minRows: 2}" />
            </el-form-item>
          </el-col>
        </el-row>
        <div class="table-container">
          <div class="head">
            <div class="title">证据列表</div>
            <div class="head-buttons">
              <el-button type="success" size="mini" icon="el-icon-plus">上传证据</el-button>
              <el-button
                type="warning"
                icon="el-icon-view"
                size="mini"
                :disabled="singleEvi"
              >预览证据</el-button>
              <el-button
                type="warning"
                icon="el-icon-download"
                size="mini"
                :disabled="singleEvi"
              >下载证据</el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                :disabled="multipleEvi"
              >删除证据</el-button>
            </div>
            <div class="pagination">
              <pagination
                v-show="pageEvidence.total>0"
                :id="pageEvidence.id"
                :total="pageEvidence.total"
                :page.sync="pageEvidence.currentPage"
                :limit.sync="pageEvidence.pageSize"
                :layout="pageEvidence.layout"
                @pagination="GetListEvidence"
              />
            </div>
          </div>
          <el-table
            :data="evidenceData"
            highlight-current-row
            style="width: 100%;"
            height="100%"
            @selection-change="handleEvidence"
          >
            <el-table-column type="selection" width="40" align="center" />
            <el-table-column prop="flieName" show-overflow-tooltip label="文件名" />
            <el-table-column width="100px" prop="fileExtension" label="文件扩展名" />
            <el-table-column width="100px" prop="fileSize" label="文件大小" />
            <el-table-column width="100px" prop="founder" label="创建人" />
            <el-table-column width="120px" prop="creationTime" label="创建时间" />
            <el-table-column width="100px" prop="modified" label="修改人" />
            <el-table-column width="120px" prop="changeTime" label="修改时间" />
          </el-table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          type="success"
          size="mini"
          @click="submitForm('form')"
        >提交证据</el-button>
      </div>
    </el-dialog>
  </el-dialog>
</template>
<script>
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
    }
  },
  data() {
    return {
      show: false,
      loading: false,
      singleImm: true,
      multipleImm: true,
      idsImm: [],
      immediateMeasuresData: [],
      pageImmediateMeasures: {
        id: 'paginationImm',
        currentPage: 1,
        pageSize: 10,
        total: 1,
        layout: 'total, sizes, prev, jumper, next'
      },
      singleLon: true,
      multipleLon: true,
      idsLon: [],
      longTermMeasuresData: [],
      pageLongTermMeasures: {
        id: 'paginationLon',
        currentPage: 1,
        pageSize: 10,
        total: 1,
        layout: 'total, sizes, prev, jumper, next'
      },
      innerVisible: false,
      form: {
        correctiveActionDept: '',
        writter: '',
        completionDate: '',
        measuresCompletionDept: ''
      },
      singleEvi: true,
      multipleEvi: true,
      idsEvi: [],
      evidenceData: [],
      pageEvidence: {
        id: 'paginationEvi',
        currentPage: 1,
        pageSize: 10,
        total: 1,
        layout: 'total, sizes, prev, jumper, next'
      }
    }
  },
  watch: {
    open(val) {
      this.show = val
    },
    show(val) {
      if (!val) {
        this.$emit('close', val)
      }
    }
  },
  methods: {
    /* 立即采取的纠正/补救措施 */
    GetListImmediateMeasures() {

    },
    handleImmediateMeasures(selection) {
      this.idsImm = [...selection]
      this.singleImm = selection.length !== 1
      this.multipleImm = !selection.length
    },
    changeImmediateMeasures() {
      this.innerVisible = true
    },
    /* 针对根本原因分析采取的对应纠正措施 */
    GetListLongTermMeasures() {

    },
    handleLongTermMeasures(selection) {
      this.idsLon = [...selection]
      this.singleLon = selection.length !== 1
      this.multipleLon = !selection.length
    },
    changeLongTermMeasures() {
      this.innerVisible = true
    },
    /* 启动复审 */
    startReview() {
      this.show = false
    },
    /* 上传证据 */
    GetListEvidence() {

    },
    handleEvidence(selection) {
      this.idsEvi = [...selection]
      this.singleEvi = selection.length !== 1
      this.multipleEvi = !selection.length
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
        this.innerVisible = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-container {
  margin-bottom: 20px;
  .head {
    width: 100%;
    display: flex;
    flex-flow: row wrap;
    padding: 5px 0;
    background: #e4e4e4;
    .title {
      font-size: 16px;
      padding-left: 5px;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
    }
    .head-buttons {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      margin-left: 30px;
    }
    .pagination {
      margin-left: auto;
      /deep/ .el-pagination {
        padding: 2px 30px 2px 0;
      }
      /deep/ span.el-pagination__jump {
        margin: 0;
        font-size: 0px;
      }
    }
  }
}
.formTitle {
  font-size: 16px;
  padding: 5px 0 5px 5px;
  background: #e4e4e4;
  margin-bottom: 5px;
}
.inputAuto {
  width: auto;
}
</style>
