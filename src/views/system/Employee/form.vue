<template>
  <el-dialog
    :append-to-body="true"
    :close-on-click-modal="false"
    :before-close="cancel"
    :visible.sync="dialog"
    :title="isAdd ? '新增员工' : '编辑员工'"
    custom-class="big_dialog"
  >
    <el-form ref="form" :model="form" :rules="formRules" size="small" label-width="70px">
      <el-row>
        <el-col :span="12">
          <el-form-item label="员工名称">
            <el-input v-model="form.userDesc" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="form.userName" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="form.password" style="width: 100%;" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机" prop="phone">
            <el-input v-model="form.phone" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="form.email" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="地址">
            <el-input v-model="form.address" style="width: 100%;" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-divider />
      <el-form-item label="角色">
        <el-select v-model="roleSelect" multiple placeholder="请选择角色" class="roleSelect" @change="roleChange" @remove-tag="roleRemove">
          <el-option
            v-for="(item,index) in roleOptions"
            :key="index"
            :label="item.roleDesc"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, modify } from '@/api/emplotee.js'
import { re } from '@/utils/config-re'

export default {
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
    roleOptions: {
      type: Array,
      required: true
    }
  },
  data() {
    const checkPhone = (rule, value, callback) => {
      const check = re.phone
      if (check.test(value)) return callback()
      callback(new Error('手机号格式不正确'))
    }
    const checkEmail = (rule, value, callback) => {
      const check = re.email
      if (check.test(value)) return callback()
      callback(new Error('邮箱格式不正确'))
    }
    return {
      loading: false, dialog: false,
      form: {
        userDesc: '',
        userName: '',
        password: '',
        phone: '',
        email: '',
        address: '',
        roleList: []
      },
      roleSelect: [],
      formRules: {
        phone: [
          { required: true, message: '请填写手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写邮箱账号', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
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
      // this.delwithRoleList()
      const data = this.roleSelect
      const arr = []
      for (let i = 0; i < data.length; i++) {
        const obj = {
          id: ''
        }
        obj.id = data[i]
        arr.push(obj)
      }
      this.form.roleList = arr
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
        userDesc: '',
        userName: '',
        password: '',
        phone: '',
        email: '',
        address: '',
        roleList: []
      }
      this.roleSelect = []
    },
    roleChange(e) {
      if (e.length <= 1) {
        this.form.roleList = e[0]
      }
      const arr = []
      for (let i = 0; i < e.length; i++) {
        const obj = {
          id: ''
        }
        obj.id = e[i]
        arr.push(obj)
      }
      this.form.roleList = arr
    },
    roleRemove(e) {
    }
    // delwithRoleList() {
    //   const roleList = this.roleList
    //   const checkList = this.form.roleList
    //   let newList = []
    //   let obj = {}
    //   for (let i = 0; i < checkList.length; i++) {
    //     for (let j = 0; j < roleList.length; j++) {
    //       if (checkList[i] === roleList[j].id) {
    //         obj.id = Number(checkList[i])
    //         obj.code = roleList[j].code
    //         obj.roleDesc = roleList[j].roleDesc
    //         // obj.sn = roleList[j].sn
    //         newList.push(obj)
    //         obj = {}
    //       }
    //     }
    //   }
    //   this.form.roleList = newList
    // }
  }
}
</script>

<style scoped>
</style>

<style lang="scss">
.roleSelect {
  width: 370px;
}
.el-select-dropdown {
  z-index: 99999999999999 !important;
}
</style>
