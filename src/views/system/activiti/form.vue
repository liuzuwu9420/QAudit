<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增功能' : '编辑功能'"
    custom-class="common_dialog"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
      <el-form-item label="模型标识" prop="key">
        <el-input v-model="form.key" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="模型名称" prop="name">
        <el-input v-model="form.name" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="模型描述" prop="desc">
        <el-input v-model="form.desc" type="textarea" :autosize="{ minRows: 2}" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>

import { add, modify } from '@/api/activiti'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    var checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('标识不能为空'))
      }
      setTimeout(() => {
        const bool = !/^[0-9a-zA-Z]{1,23}$/.test(value)
        console.log(bool)
        if (bool) {
          console.log(bool)
          callback(new Error('请输入数字和字母'))
        } else {
          callback()
        }
      }, 200)
    }
    return {
      loading: false,
      dialog: false,
      form: {
        key: '',
        name: '',
        desc: ''
      },
      rules: {
        key: [
          { required: true, validator: checkAge, trigger: 'blur' }
          /* { required: true, message: '请输入模型标识', trigger: 'blur' } */
        ],
        name: [
          { required: true, message: '请输入模型名称', trigger: 'blur' }
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
        this.$parent.getList()
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
        this.$parent.getList()
      }).catch(err => {
        console.log(err)
        this.loading = false
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        key: '',
        name: '',
        desc: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
