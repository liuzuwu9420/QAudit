<template>
  <div class="app-container">
    <eform ref="form" :is-add="isAdd" :role-options="roleOptions" />
    <!-- <Search :query="query" /> -->
    <div class="head-container">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="员工名称" prop="userDesc" class="form-item-self">
          <el-input
            v-model="queryParams.userDesc"
            clearable
            placeholder="请输入员工名称"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="toQuery()"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="userName" class="form-item-self">
          <el-input
            v-model="queryParams.userName"
            clearable
            placeholder="请输入用户名"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="toQuery()"
          />
        </el-form-item>
        <el-form-item label="手机" prop="phone" class="form-item-self">
          <el-input
            v-model="queryParams.phone"
            clearable
            placeholder="请输入手机号"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="toQuery()"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-search"
            @click="toQuery()"
          >搜索</el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-plus"
            @click="add"
          >新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column prop="userDesc" label="员工名称" />
      <el-table-column prop="userName" label="用户名" />
      <el-table-column prop="phone" label="手机" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="address" label="地址" />
      <!-- <el-table-column prop="roleList" label="角色">
        <template slot-scope="scope">{{scope.row.list}}</template>
      </el-table-column>-->
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="isSuperAdmin" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row.id)" />
          <el-button v-else :disabled="scope.row.userName !== userInfo.userName" size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row.id)" />
          <el-button
            slot="reference"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="subDelete(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination
      v-show="page.total>0"
      :total="page.total"
      :page.sync="page.currentPage"
      :limit.sync="page.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
import { getToken } from '@/utils/auth'
import eform from './form'
import Pagination from '@/components/Pagination'
import { del, query, detail, findEmployByUserName } from '@/api/Employee'
import { getRoleList } from '@/api/role'
export default {
  name: 'UserManage',
  components: { eform, Pagination },
  data() {
    return {
      loading: true,
      data: [],
      isAdd: false,
      delLoading: false,
      showBatchDelete: { // 是否显示操作组件
        type: Boolean,
        default: true
      },
      showOperation: { // 是否显示操作组件
        type: Boolean,
        default: true
      },
      selections: [], // 列表选中列
      roleOptions: [],
      isSuperAdmin: false,
      userInfo: {},
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      queryParams: {
        userDesc: undefined,
        userName: undefined,
        phone: undefined
      }
    }
  },
  created() {
    this.getList()
    this.getRole()

    const userToken = getToken('Token')
    const token = jwtDecode(userToken)
    console.log(token)
    findEmployByUserName(token.sub).then((res) => {
      console.log(res)
      if (res.code === '200') {
        this.userInfo = res.obj
        const data = res.obj.roleList
        for (let i = 0; i < data.length; i++) {
          if (data[i].code === 'ROLE_super_admin') {
            this.isSuperAdmin = true
          }
        }
      }
    })
  },
  beforeRouteLeave: function(to, from, next) {
    if (to.path === this.toPath) {
      return
    }
    const _this = this.$refs.form
    _this.dialog = false
    next()
  },
  methods: {
    getList() {
      this.loading = true
      let params = {}
      params = this.queryParams
      params.pageNum = this.page.currentPage
      params.pageSize = this.page.pageSize
      query(params).then(res => {
        if (res.code === '200') {
          this.data = res.obj
          this.page.total = Number(res.total)
          // // this.init()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
        }
        this.loading = false
      })
    },
    subDelete(id) {
      this.delLoading = true
      this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(id).then(res => {
          if (res.code === '200') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.msg)
          }
          this.delLoading = false
          // this.dleChangePage()
          this.init()
        }).catch(err => {
          console.log(err)
          this.delLoading = false
        })
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
    },
    edit(id) {
      this.isAdd = false
      const _this = this.$refs.form
      detail(id).then((res) => {
        if (res.code === '200') {
          const data = res.obj.roleList
          const arr = []
          for (let i = 0; i < data.length; i++) {
            arr.push(data[i].id)
          }
          _this.form = {
            id: res.obj.id,
            userDesc: res.obj.userDesc,
            userName: res.obj.userName,
            phone: res.obj.phone,
            email: res.obj.email,
            address: res.obj.address,
            password: res.obj.password,
            roleList: []
          }
          _this.roleSelect = arr
          _this.dialog = true
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections
      this.$emit('selectionChange', { selections: selections })
    },
    toQuery(name) {
      this.page.currentPage = 1
      this.getList()
    },
    // 获取角色列表
    getRole() {
      getRoleList().then((res) => {
        if (res.code === '200') {
          this.roleOptions = res.obj
        }
      })
    }
  }
}
</script>

<style lang="scss">
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 70px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.demo-table-expand .el-form-item__content {
  font-size: 12px;
}
.filter-item {
  > .el-input__inner {
    height: 32px !important;
  }
}
</style>
