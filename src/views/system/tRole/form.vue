<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增功能' : '编辑功能'"
    custom-class="common_dialog"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="角色编码" prop="code">
        <el-input v-model="form.code" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="角色名称" prop="roleDesc">
        <el-input v-model="form.roleDesc" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="排序" prop="sn">
        <el-input v-model="form.sn" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="创建人ID" prop="creater">
        <el-input v-model="form.creater" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="创建时间" prop="createTime">
        <el-date-picker
          v-model="form.createTime"
          clearable
          size="small"
          style="width: 100%"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择时间"
        />
      </el-form-item>
      <el-form-item label="修改人ID" prop="changer">
        <el-input v-model="form.changer" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="修改时间" prop="changeTime">
        <el-date-picker
          v-model="form.changeTime"
          clearable
          size="small"
          style="width: 100%"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择时间"
        />
      </el-form-item>
      <el-form-item label="创建人名称" prop="createrDesc">
        <el-input v-model="form.createrDesc" style="width: 100%;" />
      </el-form-item>
      <el-form-item label="修改人名称" prop="changerDesc">
        <el-input v-model="form.changerDesc" style="width: 100%;" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, modify } from '@/api/TRole'

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
        id: '',
        code: '',
        roleDesc: '',
        sn: '',
        creater: '',
        createTime: '',
        changer: '',
        changeTime: '',
        createrDesc: '',
        changerDesc: ''
      },
      rules: {
        id: [
          { required: true, message: '请输入ID', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入角色编码', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        sn: [
          { required: true, message: '请输入排序', trigger: 'blur' }
        ],
        creater: [
          { required: true, message: '请输入创建人ID', trigger: 'blur' }
        ],
        createTime: [
          { required: true, message: '请输入创建时间', trigger: 'blur' }
        ],
        changer: [
          { required: true, message: '请输入修改人ID', trigger: 'blur' }
        ],
        changeTime: [
          { required: true, message: '请输入修改时间', trigger: 'blur' }
        ],
        createrDesc: [
          { required: true, message: '请输入创建人名称', trigger: 'blur' }
        ],
        changerDesc: [
          { required: true, message: '请输入修改人名称', trigger: 'blur' }
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
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else {
            this.doModify()
          }
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
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.resetForm()
        this.loading = false
        this.$parent.init()
      }).catch(() => {
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
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.resetForm()
        this.loading = false
        this.$parent.init()
      }).catch(() => {
        this.loading = false
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        code: '',
        roleDesc: '',
        sn: '',
        creater: '',
        createTime: '',
        changer: '',
        changeTime: '',
        createrDesc: '',
        changerDesc: ''
      }
    }
  }
}
</script>

<style scoped>
</style>
