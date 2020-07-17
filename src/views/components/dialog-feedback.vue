<template>
  <el-dialog :title="title" :visible.sync="show" width="1000px" append-to-body>
    <el-form ref="form" :model="form" label-width="140px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="审核报告号">
            <el-input v-model="form.auditReportNumber" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="项次号">
            <el-input v-model="form.itemNo" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="发现问题描述">
            <el-input v-model="form.findingProblemDesc" :disabled="true" type="textarea" :autosize="{ minRows: 2}" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="整改要求">
            <el-input
              v-model="form.rectificationRequirements"
              :disabled="true"
              type="textarea"
              :autosize="{ minRows: 2}"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="对问题是否接受">
            <el-radio-group v-model="form.acceptProblem" :disabled="peopleRole!=='1'">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="要求反馈时间">
            <el-input v-model="form.requestFeedbackTime" :disabled="true" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="主责任科经理">
            <el-input v-model="form.responsibleManager" :disabled="peopleRole!=='1'" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="操作员">
            <el-input v-model="form.operator" class="inputAuto" :disabled="peopleRole!=='2'" />
            <el-button v-if="peopleRole==='2'" type="primary" size="mini" @click="submitForm">转操作员</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="table-container">
        <div class="head">
          <div class="title">直接原因</div>
          <div class="head-buttons">
            <el-button type="success" size="mini" icon="el-icon-plus" @click="addReason()">添加</el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              :disabled="singleRea"
              @click="changeReason()"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              :disabled="multipleRea"
              @click="deleteReason()"
            >删除</el-button>
          </div>
          <div class="pagination">
            <pagination
              v-show="pageReason.total>0"
              :id="pageReason.id"
              :total="pageReason.total"
              :page.sync="pageReason.currentPage"
              :limit.sync="pageReason.pageSize"
              :layout="pageReason.layout"
              @pagination="GetListReason"
            />
          </div>
        </div>
        <el-table
          :data="reasonData"
          highlight-current-row
          style="width: 100%;"
          height="100%"
          @selection-change="handleReason"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column prop="immediateCauseDesc" label="直接原因描述" />
          <el-table-column width="150px" prop="department" label="部门" />
          <el-table-column width="100px" prop="writter" label="填写人" />
        </el-table>
      </div>
      <div class="table-container">
        <div class="head">
          <div class="title">发现问题根本原因分析</div>
          <div class="head-buttons">
            <el-button type="success" size="mini" icon="el-icon-plus" @click="addCauseAnalysis()">添加</el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              :disabled="singleCau"
              @click="changeCauseAnalysis()"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              :disabled="multipleCau"
              @click="deleteCauseAnalysis()"
            >删除</el-button>
          </div>
          <div class="pagination">
            <pagination
              v-show="pageCauseAnalysis.total>0"
              :id="pageCauseAnalysis.id"
              :total="pageCauseAnalysis.total"
              :page.sync="pageCauseAnalysis.currentPage"
              :limit.sync="pageCauseAnalysis.pageSize"
              :layout="pageCauseAnalysis.layout"
              @pagination="GetListCauseAnalysis"
            />
          </div>
        </div>
        <el-table
          :data="causeAnalysisData"
          highlight-current-row
          style="width: 100%;"
          height="100%"
          @selection-change="handleCauseAnalysis"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column prop="findingRootCauseAnalysis" label="发现问题根本原因分析" />
          <el-table-column prop="cause" label="诱因" />
          <el-table-column prop="eventConsequence" label="事件后果" />
          <el-table-column width="150px" prop="department" label="部门" />
          <el-table-column width="100px" prop="writter" label="填写人" />
        </el-table>
      </div>
      <div class="table-container">
        <div class="head">
          <div class="title">立即采取的纠正/补救措施</div>
          <div class="head-buttons">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-plus"
              @click="addTemporaryMeasures()"
            >添加</el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              :disabled="singleTem"
              @click="changeTemporaryMeasures()"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              :disabled="multipleTem"
              @click="deleteTemporaryMeasures()"
            >删除</el-button>
          </div>
          <div class="pagination">
            <pagination
              v-show="pageTemporaryMeasures.total>0"
              :id="pageTemporaryMeasures.id"
              :total="pageTemporaryMeasures.total"
              :page.sync="pageTemporaryMeasures.currentPage"
              :limit.sync="pageTemporaryMeasures.pageSize"
              :layout="pageTemporaryMeasures.layout"
              @pagination="GetListTemporaryMeasures"
            />
          </div>
        </div>
        <el-table
          :data="temporaryMeasuresData"
          highlight-current-row
          style="width: 100%;"
          height="100%"
          @selection-change="handleTemporaryMeasures"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column prop="immediateAction" label="立即采取的纠正/补救措施" />
          <el-table-column prop="dueDate" label="完成日期" />
          <el-table-column width="150px" prop="department" label="责任部门" />
          <el-table-column width="100px" prop="resPerson" label="责任人" />
        </el-table>
      </div>
      <div class="table-container">
        <div class="head">
          <div class="title">针对根本原因分析采取的对应纠正措施</div>
          <div class="head-buttons">
            <el-button type="success" size="mini" icon="el-icon-plus" @click="addMeasures()">添加</el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              :disabled="singleMea"
              @click="changeMeasures()"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              :disabled="multipleMea"
              @click="deleteMeasures()"
            >删除</el-button>
          </div>
          <div class="pagination">
            <pagination
              v-show="pageMeasures.total>0"
              :id="pageMeasures.id"
              :total="pageMeasures.total"
              :page.sync="pageMeasures.currentPage"
              :limit.sync="pageMeasures.pageSize"
              :layout="pageMeasures.layout"
              @pagination="GetListMeasures"
            />
          </div>
        </div>
        <el-table
          :data="measuresData"
          highlight-current-row
          style="width: 100%;"
          height="100%"
          @selection-change="handleMeasures"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column prop="RootCauseAction" label="针对根本原因分析采取的对应纠正措施" />
          <el-table-column prop="dueDate" label="完成日期" />
          <el-table-column width="150px" prop="department" label="责任部门" />
          <el-table-column width="100px" prop="resPerson" label="责任人" />
        </el-table>
      </div>
      <div class="table-container">
        <div class="head">
          <div class="title">月度纠正措施计划</div>
          <div class="head-buttons">
            <el-button type="success" size="mini" icon="el-icon-plus" @click="addMonthlyPlan()">添加</el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              :disabled="singleMon"
              @click="changeMonthlyPlan()"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              :disabled="multipleMon"
              @click="deleteMonthlyPlan()"
            >删除</el-button>
          </div>
          <div class="pagination">
            <pagination
              v-show="pageMonthlyPlan.total>0"
              :id="pageMonthlyPlan.id"
              :total="pageMonthlyPlan.total"
              :page.sync="pageMonthlyPlan.currentPage"
              :limit.sync="pageMonthlyPlan.pageSize"
              :layout="pageMonthlyPlan.layout"
              @pagination="GetListMonthlyPlan"
            />
          </div>
        </div>
        <el-table
          :data="monthlyPlanData"
          highlight-current-row
          style="width: 100%;"
          height="100%"
          @selection-change="handleMonthlyPlan"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column prop="monthlyPlan" label="月度纠正措施计划" />
          <el-table-column width="150px" prop="department" label="责任部门" />
          <el-table-column width="100px" prop="resPerson" label="责任人" />
        </el-table>
      </div>
      <div class="table-container">
        <div class="head">
          <div class="title">附件</div>
          <div class="head-buttons">
            <el-button type="success" size="mini" icon="el-icon-plus" @click="addAttachment()">添加</el-button>
            <el-button
              type="warning"
              icon="el-icon-edit"
              size="mini"
              :disabled="singleAtt"
              @click="changeAttachment()"
            >编辑</el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              :disabled="multipleAtt"
              @click="deleteAttachment()"
            >删除</el-button>
          </div>
          <div class="pagination">
            <pagination
              v-show="pageAttachment.total>0"
              :id="pageAttachment.id"
              :total="pageAttachment.total"
              :page.sync="pageAttachment.currentPage"
              :limit.sync="pageAttachment.pageSize"
              :layout="pageAttachment.layout"
              @pagination="GetListAttachment"
            />
          </div>
        </div>
        <el-table
          :data="attachmentData"
          highlight-current-row
          style="width: 100%;"
          height="100%"
          @selection-change="handleAttachment"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column prop="fileName" label="文件名称" />
        </el-table>
      </div>
      <div class="table-container">
        <div class="head">
          <div class="title">交流意见</div>
          <div class="head-buttons">
            <el-button
              type="success"
              size="mini"
              icon="el-icon-plus"
              :disabled="singleSug"
              @click="viewSuggestion()"
            >意见查看</el-button>
          </div>
          <div class="pagination">
            <pagination
              v-show="pageSuggestion.total>0"
              :id="pageSuggestion.id"
              :total="pageSuggestion.total"
              :page.sync="pageSuggestion.currentPage"
              :limit.sync="pageSuggestion.pageSize"
              :layout="pageSuggestion.layout"
              @pagination="GetListSuggestion"
            />
          </div>
        </div>
        <el-table
          :data="SuggestionData"
          highlight-current-row
          style="width: 100%;"
          height="100%"
          @selection-change="handleSuggestion"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column prop="contennt" label="内容" />
          <el-table-column width="100px" prop="name" label="提出人" />
          <el-table-column prop="time" label="提出时间" />
        </el-table>
      </div>
      <el-row v-if="peopleRole==='8'">
        <el-col :span="24">
          <el-form-item label="责任部门经理签批">
            <el-input v-model="form.resDepartmentManagerSign" />
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="peopleRole==='8'">
        <div class="formTitle">审核组评估</div>
        <el-row>
          <el-col :span="12">
            <el-form-item label="评估人">
              <el-input v-model="form.evaluatedBy" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评估时间">
              <el-input v-model="form.evaluatedDate" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评估是否接受">
              <el-radio-group v-model="form.evaluationAccept">
                <el-radio label="是" />
                <el-radio label="否" />
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="选择后果">
              <el-input v-model="form.eventConsequence" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="评估和验证过程描述及进一步措施">
              <el-input
                v-model="form.evaluationProcessDesc"
                type="textarea"
                :autosize="{ minRows: 2}"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="相关意见">
              <el-input v-model="form.suggestion" type="textarea" :autosize="{ minRows: 2}" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row>
        <div class="formTitle">审批过程</div>
        <el-table :data="form.problemRecordingList">
          <el-table-column label="审核阶段" align="center" width="100" prop="auditStage" />
          <el-table-column label="审批人" align="center" width="150" prop="approver" />
          <el-table-column label="审批结果" align="center" width="80" prop="approvalResults" />
          <el-table-column label="审批意见" align="center" prop="approvalComments" />
          <el-table-column label="审批时间" align="center" width="180" prop="processingTime" />
        </el-table>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button v-if="peopleRole==='1'" type="primary" size="mini" @click="submitForm">分发</el-button>
      <el-button
        v-if="peopleRole==='1' || peopleRole==='2' || peopleRole==='3'"
        type="success"
        size="mini"
        @click="submitForm"
      >提交</el-button>
      <el-button v-if="peopleRole==='4'" type="success" size="mini" @click="submitForm">批准</el-button>
      <el-button v-if="peopleRole==='4'" type="danger" size="mini" @click="submitForm">驳回</el-button>
      <el-button v-if="peopleRole==='8'" type="success" size="mini" @click="submitForm">保存</el-button>
      <el-button v-if="peopleRole==='8'" type="danger" size="mini" @click="submitForm">评估结束</el-button>
    </div>
  </el-dialog>
</template>
<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'FeedbackDialog',
  components: {
    Pagination
  },
  props: {
    peopleRole: {
      required: true,
      type: String,
      default() {
        return '1'
      }
    },
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
      title: '纠正措施回复及跟踪单',
      show: false,
      singleRea: true,
      multipleRea: true,
      idsReason: [],
      reasonData: [],
      pageReason: {
        id: 'paginationRea',
        currentPage: 1,
        pageSize: 10,
        total: 1,
        layout: 'total, sizes, prev, jumper, next'
      },
      singleCau: true,
      multipleCau: true,
      idsCau: [],
      causeAnalysisData: [],
      pageCauseAnalysis: {
        id: 'paginationCau',
        currentPage: 1,
        pageSize: 10,
        total: 1,
        layout: 'total, sizes, prev, jumper, next'
      },
      singleTem: true,
      multipleTem: true,
      idsTem: [],
      temporaryMeasuresData: [],
      pageTemporaryMeasures: {
        id: 'paginationTem',
        currentPage: 1,
        pageSize: 10,
        total: 1,
        layout: 'total, sizes, prev, jumper, next'
      },
      singleMea: true,
      multipleMea: true,
      idsMea: [],
      measuresData: [],
      pageMeasures: {
        id: 'paginationMea',
        currentPage: 1,
        pageSize: 10,
        total: 1,
        layout: 'total, sizes, prev, jumper, next'
      },
      singleMon: true,
      multipleMon: true,
      idsMon: [],
      monthlyPlanData: [],
      pageMonthlyPlan: {
        id: 'paginationMon',
        currentPage: 1,
        pageSize: 10,
        total: 1,
        layout: 'total, sizes, prev, jumper, next'
      },
      singleAtt: true,
      multipleAtt: true,
      idsAtt: [],
      attachmentData: [],
      pageAttachment: {
        id: 'paginationAtt',
        currentPage: 1,
        pageSize: 10,
        total: 1,
        layout: 'total, sizes, prev, jumper, next'
      },
      singleSug: true,
      idsSug: [],
      SuggestionData: [],
      pageSuggestion: {
        id: 'paginationSug',
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
    /* 直接原因 */
    addReason() {},
    changeReason() {},
    deleteReason() {},
    GetListReason() {},
    handleReason(selection) {
      this.idsReason = selection.map(item => item)
      this.singleRea = selection.length !== 1
      this.multipleRea = !selection.length
    },
    /* 发现问题根本原因分析 */
    addCauseAnalysis() {},
    changeCauseAnalysis() {},
    deleteCauseAnalysis() {},
    GetListCauseAnalysis() {},
    handleCauseAnalysis(selection) {
      this.idsCau = selection.map(item => item)
      this.singleCau = selection.length !== 1
      this.multipleCau = !selection.length
    },
    /* 立即采取的纠正/补救措施 */
    addTemporaryMeasures() {},
    changeTemporaryMeasures() {},
    deleteTemporaryMeasures() {},
    GetListTemporaryMeasures() {},
    handleTemporaryMeasures(selection) {
      this.idsTem = selection.map(item => item)
      this.singleTem = selection.length !== 1
      this.multipleTem = !selection.length
    },
    /* 针对根本原因分析采取的对应纠正措施 */
    addMeasures() {},
    changeMeasures() {},
    deleteMeasures() {},
    GetListMeasures() {},
    handleMeasures(selection) {
      this.idsMea = selection.map(item => item)
      this.singleMea = selection.length !== 1
      this.multipleMea = !selection.length
    },
    /* 月度纠正措施计划 */
    addMonthlyPlan() {},
    changeMonthlyPlan() {},
    deleteMonthlyPlan() {},
    GetListMonthlyPlan() {},
    handleMonthlyPlan(selection) {
      this.idsMon = selection.map(item => item)
      this.singleMon = selection.length !== 1
      this.multipleMon = !selection.length
    },
    /* 附件 */
    addAttachment() {},
    changeAttachment() {},
    deleteAttachment() {},
    GetListAttachment() {},
    handleAttachment(selection) {
      this.idsAtt = selection.map(item => item)
      this.singleAtt = selection.length !== 1
      this.multipleAtt = !selection.length
    },
    /* 交流意见 */
    viewSuggestion() {},
    GetListSuggestion() {},
    handleSuggestion(selection) {
      this.idssug = selection.map(item => item)
      this.singlesug = selection.length !== 1
      this.multiplesug = !selection.length
    },
    submitForm(formName) {
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
