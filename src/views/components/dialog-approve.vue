<template>
  <el-dialog :title="title" :visible.sync="show" width="1000px" append-to-body>
    <div class="pdf">PDF</div>
    <el-form ref="form" :model="form" label-width="140px">
      <el-row>
        <el-col :span="24">
          <el-form-item label="审批意见">
            <el-input v-model="form.approvalComments" type="textarea" :autosize="{ minRows: 2}" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="success" size="mini" @click="submitForm">批准</el-button>
      <el-button type="danger" size="mini" @click="submitForm">驳回</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  name: 'ApproveDialog',
  props: {
    title: {
      required: true,
      type: String,
      default() {
        return ''
      }
    },
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
      form: {
        approvalComments: ''
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
.pdf {
  font-size: 40px;
  text-align: center;
  height: 600px;
  line-height: 600px;
}
</style>
