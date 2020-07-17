<template>
  <el-dialog title="审核结果" :visible.sync="show" width="600px">
    <el-form
      ref="auditConclusion"
      :model="auditConclusionForm"
      label-width="100px"
    >
      <el-form-item label="审核结论">
        <el-radio-group v-model="auditConclusionForm.resource">
          <el-radio label="是" />
          <el-radio label="否" />
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
</template>

<script>
export default {
  name: 'RecordingDialog',
  props: {
    dialogCreatingConclusion: {
      required: true,
      type: Boolean,
      default() {
        return false
      }
    },
    auditConclusionForm: {
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
    dialogCreatingConclusion(val) {
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
