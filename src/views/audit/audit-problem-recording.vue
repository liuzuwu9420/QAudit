
<template>
  <div class="app-container">
    <div class="top-container">
      <div class="title">审核记录列表</div>
      <!-- <div class="head">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="singleRec"
            @click="changeRecording()"
          >编辑</el-button>
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-circle-close"
            :disabled="multipleRec"
            @click="rejectRecording()"
          >驳回</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            :disabled="multipleRec"
            @click="deleteRecording()"
          >删除</el-button>
        </div> -->
      <el-table
        :data="recordingData"
        border
        highlight-current-row
        style="width: 100%;"
        height="100%"
        @selection-change="handleSelectionChangeRec"
      >
        <el-table-column
          width="100px"
          prop="isaccord"
          label="是否符合"
        />
        <el-table-column
          prop="auditConclusion"
          label="审核结论"
        />
      </el-table>
    </div>
    <div class="bottom-container">
      <div class="title">审核问题列表</div>
      <!-- <div class="head">
          <el-button
            type="success"
            icon="el-icon-edit"
            size="mini"
            :disabled="singlePro"
            @click="changeProblem()"
          >编辑</el-button>
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-circle-close"
            :disabled="multiplePro"
            @click="rejectProblem()"
          >驳回</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            :disabled="multiplePro"
            @click="deleteProblem()"
          >删除</el-button>
        </div> -->
      <el-table
        :data="promblemData"
        border
        highlight-current-row
        style="width: 100%;"
        height="100%"
        @selection-change="handleSelectionChangePro"
      >
        <el-table-column
          prop="itemNo"
          label="项次号"
        />
        <el-table-column
          prop="description"
          label="问题描述"
        />
        <el-table-column
          prop="findingLevel"
          label="问题等级"
        />
        <el-table-column
          prop="riskLevel"
          label="风险等级"
        />
        <el-table-column
          prop="respDeptCodes"
          label="责任部门代码"
        />
        <el-table-column
          prop="actionsRequired"
          label="整改要求"
        />
        <el-table-column
          prop="isRepeatedFinding"
          label="是否重复性问题"
        />
      </el-table>
    </div>
    <!-- <dialog-recording :dialog-creating-conclusion="dialogCreatingConclusion" :audit-conclusion-form="auditConclusionForm" @close="closeConclusion" />
    <dialog-problem :dialog-creating-problem="dialogCreatingProblem" :audit-problem-form="auditProblemForm" @close="closeProblem" /> -->
  </div>
</template>
<script>
// import DialogProblem from '../components/dialog-problem'
// import DialogRecording from '../components/dialog-recording'
export default {
  name: 'AuditProblemRecording',
  // components: { DialogProblem, DialogRecording },
  data() {
    return {
      // 选中数组
      idsPro: [],
      idsRec: [],
      // 非单个禁用
      singlePro: true,
      singleRec: true,
      // 非多个禁用
      multiplePro: true,
      multipleRec: true,
      recordingData: [],
      promblemData: [
        {
          itemNo: '1.1',
          description: '',
          findingLevel: 'Ⅰ',
          respDeptCodes: '',
          riskLevel: 1,
          actionsRequired: '',
          isRepeatedFinding: ''
        }
      ],
      dialogCreatingConclusion: false,
      auditConclusionForm: {
        resource: '是',
        desc: ''
      },
      dialogCreatingProblem: false,
      auditProblemForm: {
        itemNo: '',
        respDeptCodes: '',
        findingLevel: 'Ⅱ',
        basis: '',
        date: '',
        description: '',
        responsibilityDepartment: '',
        product: '',
        system: '',
        productSystemRemarks: '',
        problem1: '',
        problem2: '',
        riskSourcces: '',
        riskSourccesNotes: '',
        repeatability: '',
        systematicness: '',
        commonness: '',
        actionsRequired: ''
      }
    }
  },
  methods: {
    // 多选框选中数据
    handleSelectionChangePro(selection) {
      this.idsPro = [...selection]
      this.singlePro = selection.length !== 1
      this.multiplePro = !selection.length
    },
    handleSelectionChangeRec(selection) {
      this.idsRec = [...selection]
      this.singleRec = selection.length !== 1
      this.multipleRec = !selection.length
    },
    /* 记录的事件处理 */
    changeRecording() {
      this.dialogCreatingConclusion = true
      console.log(this.idsRec)
    },
    deleteRecording() {
      console.log(this.idsRec)
    },
    rejectRecording() {
      console.log(this.idsRec)
    },
    /* 问题的事件处理 */
    changeProblem() {
      this.dialogCreatingProblem = true
      console.log(this.idsPro)
    },
    deleteProblem() {
      console.log(this.idsPro)
    },
    rejectProblem() {
      console.log(this.idsPro)
    },
    /* dialog */
    closeProblem(val) {
      this.dialogCreatingProblem = val
    },
    closeConclusion(val) {
      this.dialogCreatingConclusion = val
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .top-container {
    width: 100%;
    height: 50%;
    padding-bottom: 10px;
  }
  .bottom-container {
    width: 100%;
    height: 50%;
  }
  .title {
    height: 44px;
    background-color: #f5efff;
    padding: 14px;
  }
}
</style>
