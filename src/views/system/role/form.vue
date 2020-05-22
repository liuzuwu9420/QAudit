<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增功能' : '编辑功能'"
    custom-class="common_dialog"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="70px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.roleDesc" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="角色编码">
        <el-input v-model="form.code" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="角色排序">
        <el-input-number v-model="form.sn" :min="0" :max="1000" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, modify } from '@/api/role'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false,
      form: {
        roleDesc: '',
        code: 'ROLE_',
        sn: 0
      },
      rules: {
        funcDesc: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      },
      entArr: []
    }
  },
  created() {

  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else this.doModify()
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
        if (res.code === '200') {
          this.$message({
            message: '添加成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.msg)
        }
        this.resetForm()
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    doModify() {
      modify(this.form).then(res => {
        if (res.code === '200') {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
        } else {
          this.$message.error(res.msg)
        }
        this.resetForm()
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        roleDesc: '',
        code: 'ROLE_',
        sn: 0
      }
    }
  }
}
</script>

<style scoped>
</style>
