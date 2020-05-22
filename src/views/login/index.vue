<template>
  <div ref="box" class="container">
    <!-- 卡片 element-ui 组件 -->
    <el-card class="my-card">
      <span class="title">后台管理系统</span>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" status-icon>
        <el-form-item prop="userName">
          <el-input v-model="loginForm.userName" placeholder="请输入用户名" clearable>
            <i slot="prefix" class="el-icon-user-solid el-input__icon icon userName" />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            clearable
            show-password
            maxlength="16"
          >
            <i slot="prefix" class="el-input__icon icon pwd" />
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="isChecked" style="color: #005ba7">我已阅读并同意用户协议和隐私条款</el-checkbox>
          <span class="readClick" @click="dialogVisible = true">点击阅读</span>
        </el-form-item>
        <el-form-item>
          <el-button
            :loading="loading"
            :disabled="!isChecked"
            type="primary"
            :class="['is-disabled' ? '!isChecked':'isChecked']"
            @click="handleLogin()"
          >登 录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-dialog title="用户协议和隐私条款" :visible.sync="dialogVisible" width="30%">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'

export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userName: 'admin',
        password: 'admin123'
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      dialogVisible: false,
      isChecked: true,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.userName === '') {
      this.$refs.userName.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then((res) => {
              if (res) {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
                this.loading = false
              } else {
                this.$message.error('用户名或密码输入错误！！！')
                this.loading = false
              }
            })
            .catch((err) => {
              console.log(err)
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }
  }
}
</script>

<style scoped lang='scss'>
.container {
  background: url('../../assets/login_images/bg1.jpg') no-repeat center / cover;
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  .my-card {
    width: 460px;
    height: 400px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding: 0 20px;
    .title {
      display: inline-block;
      width: 100%;
      font-size: 20px;
      text-align: center;
      font-weight: 700;
      margin-bottom: 30px;
      margin-top: 10px;
    }
    img {
      width: 200px;
      display: block;
      margin: 0 auto 20px;
    }
    .el-input {
      height: 42px;
    }
    .el-button {
      width: 100%;
      background: #005ba7;
      border-color: #005ba7;
    }
    .is-disabled {
      background: #b1b1b1;
      border-color: #b1b1b1;
    }
    /deep/ .el-input__inner {
      padding-left: 50px;
    }
    /deep/ .el-form-item__error {
      left: 10%;
    }
    /deep/ .el-checkbox__label {
      color: #005ba7;
    }
    /deep/ .el-checkbox__inner {
      border-color: #005ba7;
    }
    /deep/ .el-checkbox {
      margin-top: 20px;
    }
    /deep/ .el-checkbox__input.is-checked .el-checkbox__inner {
      background-color: #005ba7;
    }
  }
}
.icon {
  display: block;
  height: 40px;
  width: 40px;
  margin-right: 20px;
}
.pwd {
  background: url('../../assets/login_images/icon/password.png') no-repeat center;
}
.el-icon-user-solid:before {
  font-size: 26px;
  color: #0059a8;
}
.reset-pwd {
  display: block;
  color: #005ba7;
  font-size: 14px;
  text-decoration: none;
  position: absolute;
  right: 0;
  cursor: pointer;
}
.registered {
  color: #005ba7;
}
.readClick {
  padding-left: 50px;
  cursor: pointer;
  color: #005ba7;
}
</style>
