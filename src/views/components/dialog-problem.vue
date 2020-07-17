<template>
  <el-dialog title="问题属性" :visible.sync="show" width="800px">
    <el-form
      ref="auditProblem"
      :model="auditProblemForm"
      label-width="125px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="项次">
            <el-input v-model="auditProblemForm.itemNo" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任部门">
            <el-input v-model="auditProblemForm.respDeptCodes" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题等级">
            <el-radio-group v-model="auditProblemForm.findingLevel">
              <el-radio label="Ⅰ" />
              <el-radio label="Ⅱ" />
              <el-radio label="Ⅲ" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="依据">
            <el-input v-model="auditProblemForm.basis" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="要求反馈日期">
            <el-date-picker v-model="auditProblemForm.date" type="date" placeholder="选择日期" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="审核发现问题描述">
            <el-input v-model="auditProblemForm.description" :autosize="{ minRows: 4}" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="责任部门类型">
            <el-radio-group v-model="auditProblemForm.responsibilityDepartment">
              <el-radio label="生产" />
              <el-radio label="支持Support" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="产品">
            <el-input v-model="auditProblemForm.product" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="系统">
            <el-input v-model="auditProblemForm.system" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="产品系统备注">
            <el-input v-model="auditProblemForm.productSystemRemarks" :autosize="{ minRows: 2}" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题分类1">
            <el-input v-model="auditProblemForm.problem1" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="问题分类2">
            <el-input v-model="auditProblemForm.problem2" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="风险源">
            <el-input v-model="auditProblemForm.riskSourcces" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="风险源备注">
            <el-input v-model="auditProblemForm.riskSourccesNotes" :autosize="{ minRows: 1}" type="textarea" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否重复性问题">
            <el-radio-group v-model="auditProblemForm.repeatability">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否系统问题">
            <el-radio-group v-model="auditProblemForm.systematicness">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="是否共性问题">
            <el-radio-group v-model="auditProblemForm.commonness">
              <el-radio label="是" />
              <el-radio label="否" />
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="整改要求">
            <el-input v-model="auditProblemForm.actionsRequired" :autosize="{ minRows: 4}" type="textarea" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item>
        <el-button type="primary" @click="submitForm('auditProblem')">保存</el-button>
        <!-- <el-button @click="resetForm('auditProblem')">重置</el-button> -->
        <el-button @click="cancelForm('auditProblem')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
export default {
  name: 'ProblemDialog',
  props: {
    dialogCreatingProblem: {
      required: true,
      type: Boolean,
      default() {
        return false
      }
    },
    auditProblemForm: {
      required: true,
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      show: false
    }
  },
  watch: {
    dialogCreatingProblem(val) {
      this.show = val
    },
    show(val) {
      if (!val) {
        this.$emit('close', val)
      }
    }
  },
  methods: {
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
      this.show = false
    }
  }
}
</script>
