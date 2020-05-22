<template>
  <div class="components-container">
    <div class="head">
      <div class="head-buttons">
        <el-button type="primary" size="small" class="head-button">预览检查单</el-button>
        <el-button type="primary" size="small" class="head-button">预览问题通知单</el-button>
      </div>
    </div>
    <split-pane split="vertical" @resize="resize">
      <template slot="paneL">
        <div class="left-container">
          <div class="title">检查单内容</div>
          <el-table
            :data="checkListData"
            :span-method="objectSpanMethod"
            border
            highlight-current-row
            style="width: 100%;"
            height="calc(100vh - 168px)"
            @row-click="clooseCheckItem"
          >
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
            <el-table-column label="操作" min-width="120px" fixed="right">
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
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template slot="paneR">
        <div class="top-container">
          <div class="title">审核列表</div>
          <el-table
            :data="auditConclusionData"
            border
            highlight-current-row
            style="width: 100%;"
            height="calc(50vh - 92px)"
          >
            <el-table-column
              prop="isaccord"
              label="是否符合"
            />
            <el-table-column
              prop="auditConclusion"
              label="审核结论"
            />
            <el-table-column label="操作">
              <template v-slot="{row}">
                <el-button-group>
                  <el-button
                    type="success"
                    icon="el-icon-edit"
                    size="mini"
                    @click="changeRecording(row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="warning"
                    icon="el-icon-circle-close"
                    size="mini"
                    @click="rejectRecording(row)"
                  >
                    驳回
                  </el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="deleteRecording(row)"
                  >
                    删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="bottom-container">
          <el-table
            :data="promblemData"
            border
            highlight-current-row
            style="width: 100%;"
            height="calc(50vh - 70px)"
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
            <el-table-column label="操作" min-width="100px" fixed="right">
              <template v-slot="{row}">
                <el-button-group>
                  <el-button
                    type="success"
                    icon="el-icon-edit"
                    size="mini"
                    @click="changeProblem(row)"
                  >
                    编辑
                  </el-button>
                  <el-button
                    type="warning"
                    icon="el-icon-circle-close"
                    size="mini"
                    @click="rejectProblem(row)"
                  >
                    驳回
                  </el-button>
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    size="mini"
                    @click="deleteProblem(row)"
                  >
                    删除
                  </el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </split-pane>

    <el-dialog title="审核结果" :visible.sync="dialogCreatingConclusion" width="600px">
      <el-form
        ref="auditConclusion"
        :model="auditConclusionForm"
        label-width="100px"
      >
        <el-form-item label="审核结论">
          <el-radio-group v-model="auditConclusionForm.resource">
            <el-radio label="是" />
            <el-radio label="N/A" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注">
          <el-input v-model="auditConclusionForm.desc" :autosize="{ minRows: 4}" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('auditConclusion')">保存</el-button>
          <el-button @click="resetForm('auditConclusion')">重置</el-button>
          <el-button @click="cancelForm('auditConclusion')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog title="问题属性" :visible.sync="dialogCreatingProblem" width="600px">
      <el-form
        ref="auditProblem"
        :model="auditProblemForm"
        label-width="110px"
      >
        <el-form-item label="项次">
          <el-input v-model="auditProblemForm.itemNo" />
        </el-form-item>
        <el-form-item label="责任部门">
          <el-input v-model="auditProblemForm.respDeptCodes" />
        </el-form-item>
        <el-form-item label="问题等级">
          <el-radio-group v-model="auditProblemForm.findingLevel">
            <el-radio label="Ⅰ" />
            <el-radio label="Ⅱ" />
            <el-radio label="Ⅲ" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="依据">
          <el-input v-model="auditProblemForm.basis" />
        </el-form-item>
        <el-form-item label="要求反馈日期">
          <el-date-picker v-model="auditProblemForm.date" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-form-item>
        <el-form-item label="审核发现问题描述">
          <el-input v-model="auditProblemForm.description" :autosize="{ minRows: 4}" type="textarea" />
        </el-form-item>
        <el-form-item label="责任部门类型">
          <el-radio-group v-model="auditProblemForm.responsibilityDepartment">
            <el-radio label="生产" />
            <el-radio label="支持Support" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="产品">
          <el-input v-model="auditProblemForm.product" />
        </el-form-item>
        <el-form-item label="系统">
          <el-input v-model="auditProblemForm.system" />
        </el-form-item>
        <el-form-item label="产品系统备注">
          <el-input v-model="auditProblemForm.productSystemRemarks" type="textarea" />
        </el-form-item>
        <el-form-item label="问题分类1">
          <el-input v-model="auditProblemForm.problem1" />
        </el-form-item>
        <el-form-item label="问题分类2">
          <el-input v-model="auditProblemForm.problem2" />
        </el-form-item>
        <el-form-item label="风险源">
          <el-input v-model="auditProblemForm.riskSourcces" />
        </el-form-item>
        <el-form-item label="风险源备注">
          <el-input v-model="auditProblemForm.riskSourccesNotes" type="textarea" />
        </el-form-item>
        <el-form-item label="是否重复性问题">
          <el-radio-group v-model="auditProblemForm.repeatability">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否系统问题">
          <el-radio-group v-model="auditProblemForm.systematicness">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否共性问题">
          <el-radio-group v-model="auditProblemForm.commonness">
            <el-radio label="是" />
            <el-radio label="否" />
          </el-radio-group>
        </el-form-item>
        <el-form-item label="整改要求">
          <el-input v-model="auditProblemForm.actionsRequired" :autosize="{ minRows: 4}" type="textarea" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('auditProblem')">保存</el-button>
          <el-button @click="resetForm('auditProblem')">重置</el-button>
          <el-button @click="cancelForm('auditProblem')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import splitPane from 'vue-splitpane'
export default {
  name: 'SplitpaneDemo',
  components: { splitPane },
  data() {
    return {
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
      auditConclusionData: [
        {
          isaccord: '符合',
          auditConclusion: ''
        },
        {
          isaccord: '符合',
          auditConclusion: ''
        },
        {
          isaccord: '符合',
          auditConclusion: ''
        }
      ],
      promblemData: [
        {
          itemNo: '1.1',
          description: '',
          findingLevel: 'Ⅰ',
          respDeptCodes: '',
          riskLevel: 1,
          actionsRequired: '',
          isRepeatedFinding: ''
        },
        {
          itemNo: '1.2',
          description: '',
          findingLevel: 'Ⅰ',
          respDeptCodes: '',
          riskLevel: 1,
          actionsRequired: '',
          isRepeatedFinding: ''
        },
        {
          itemNo: '1.3',
          description: '',
          findingLevel: 'Ⅰ',
          respDeptCodes: '',
          riskLevel: 1,
          actionsRequired: '',
          isRepeatedFinding: ''
        },
        {
          itemNo: '1.4',
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
    resize() {
      console.log('resize')
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      return {
        rowspan: 1,
        colspan: 1
      }
    },
    clooseCheckItem(row) {
      console.log(row)
    },
    addRecording(row) {
      console.log(row)
      this.dialogCreatingConclusion = true
    },
    changeRecording(row) {
      console.log(row)
    },
    deleteRecording(row) {
      console.log(row)
    },
    rejectRecording(row) {
      console.log(row)
    },
    addProblem(row) {
      console.log(row)
      this.dialogCreatingProblem = true
    },
    changeProblem(row) {
      console.log(row)
    },
    deleteProblem(row) {
      console.log(row)
    },
    rejectProblem(row) {
      console.log(row)
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    cancelForm(formName) {
      this.resetForm(formName)
      if (formName === 'auditConclusion') {
        this.dialogCreatingConclusion = false
      }
      if (formName === 'auditProblem') {
        this.dialogCreatingProblem = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.components-container {
  position: relative;
  height: calc(100vh - 88px);

  .left-container {
    height: 100%;
  }
  .right-container {
    height: 200px;
  }
  .top-container {
    width: 100%;
    height: 50%;
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

