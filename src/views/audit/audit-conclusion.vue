<template>
  <div class="app-container">
    <div class="head">
      <div class="head-buttons">
        <el-button type="warning" :disabled="single" icon="el-icon-view" size="mini" @click="jumpPdfDown">预览检查单</el-button>
        <el-button type="warning" :disabled="single" icon="el-icon-view" size="mini" @click="jumpPdfDown">预览问题通知单</el-button>
        <el-button type="primary" :disabled="single" icon="el-icon-plus" size="mini" @click="addRecording()">添加记录</el-button>
        <el-button type="primary" :disabled="single" icon="el-icon-plus" size="mini" @click="addProblem()">添加问题</el-button>
        <el-button type="success" :disabled="single" icon="el-icon-view" size="mini" @click="jumpLink()">查看记录与问题</el-button>
      </div>
    </div>
    <div class="left-container">
      <div class="title">检查单内容</div>
      <el-table
        :data="checkListData"
        :span-method="objectSpanMethod"
        highlight-current-row
        style="width: 100%;"
        height="calc(100vh - 168px)"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column
          prop="checkItem"
          label="检查项目"
        />
        <el-table-column
          prop="itemNo"
          label="项目号"
        />
        <el-table-column
          prop="nameCn"
          label="中文名称"
        />
        <el-table-column
          prop="isaccord"
          label="审核结论"
        />
        <el-table-column
          prop="changerNo"
          label="审核人"
        />
        <!-- <el-table-column label="操作" min-width="120px" fixed="right">
          <template v-slot="{row}">
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="addRecording(row)"
              >
                添加记录
              </el-button>
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="mini"
                @click="addProblem(row)"
              >
                添加问题
              </el-button>
              <el-button
                type="success"
                icon="el-icon-view"
                size="mini"
                @click="jumpLink(row)"
              >查看记录与问题</el-button>
            </el-button-group>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <dialog-recording :dialog-creating-conclusion="dialogCreatingConclusion" :audit-conclusion-form="auditConclusionForm" @close="closeConclusion" />
    <dialog-problem :dialog-creating-problem="dialogCreatingProblem" :audit-problem-form="auditProblemForm" @close="closeProblem" />
  </div>
</template>

<script>
// import splitPane from 'vue-splitpane'
import DialogProblem from '../components/dialog-problem'
import DialogRecording from '../components/dialog-recording'
export default {
  name: 'AuditConclusion',
  components: { DialogProblem, DialogRecording },
  data() {
    return {
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      checkListData: [
        {
          checkItem: '1.1.9 人员管理', // 检查项目
          itemNo: '1.1.9.15', // 项目号
          nameCn: '外站勤务人员资格是否满足', // 中文名称
          isaccord: '符合', // 审核结论
          changerNo: '方坚'
        },
        {
          checkItem: '1.1.16 人员管理', // 检查项目
          itemNo: '1.1.9.15', // 项目号
          nameCn: '外站勤务人员资格是否满足', // 中文名称
          isaccord: '符合', // 审核结论
          changerNo: '方坚'
        },
        {
          checkItem: '1.1.17 人员管理', // 检查项目
          itemNo: '1.1.9.15', // 项目号
          nameCn: '外站勤务人员资格是否满足', // 中文名称
          isaccord: '符合', // 审核结论
          changerNo: '方坚'
        },
        {
          checkItem: '1.1.18 人员管理', // 检查项目
          itemNo: '1.1.9.15', // 项目号
          nameCn: '外站勤务人员资格是否满足', // 中文名称
          isaccord: '符合', // 审核结论
          changerNo: '方坚'
        },
        {
          checkItem: '1.1.19 人员管理', // 检查项目
          itemNo: '1.1.9.15', // 项目号
          nameCn: '外站勤务人员资格是否满足', // 中文名称
          isaccord: '符合', // 审核结论
          changerNo: '方坚'
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
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      return {
        rowspan: 1,
        colspan: 1
      }
    },
    clooseCheckItem() {
      console.log(this.ids)
    },
    /* 预览 */
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
    /* 添加记录 */
    addRecording() {
      console.log(this.ids)
      this.dialogCreatingConclusion = true
    },
    /* 添加问题 */
    addProblem() {
      console.log(this.ids)
      this.dialogCreatingProblem = true
    },
    /* 跳转至问题与记录页面 */
    jumpLink() {
      this.$router.push({
        name: 'AuditProblemRecording',
        params: {
          select: 'itemNo',
          value: this.ids[0].itemNo
        }
      })
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /* 关闭dialog */
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
  .left-container {
    height: 100%;
  }
  .title {
    height: 44px;
    background-color: #f5efff;
    padding: 14px;
  }
</style>

