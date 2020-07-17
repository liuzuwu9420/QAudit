<template>
  <div class="app-container">
    <eform ref="form" :is-add="isAdd" />
    <!-- <Search :query="query" /> -->
    <div class="head-container">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="角色编码" prop="code" class="form-item-self">
          <el-input
            v-model="queryParams.code"
            clearable
            placeholder="请输入角色编码"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="toQuery()"
          />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleDesc" class="form-item-self">
          <el-input
            v-model="queryParams.roleDesc"
            clearable
            placeholder="请输入角色名称"
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
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="roleDesc" label="角色名称" />
      <el-table-column prop="code" label="角色编码" />
      <el-table-column prop="sn" label="排序" />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row.id)" />
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
import eform from './form'
import Pagination from '@/components/Pagination'
import { del, query, detail } from '@/api/role'

export default {
  name: 'RolesManage',
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
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      queryParams: {
        code: undefined,
        roleDesc: undefined
      }
    }
  },
  created() {
    this.getList()
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
          this.delLoading = false
          // this.dleChangePage()
          this.init()
          if (res.code === '200') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message.error(res.msg)
          }
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
          _this.form = {
            id: res.obj.id,
            roleDesc: res.obj.roleDesc,
            code: res.obj.code,
            sn: res.obj.sn
          }
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
    toQuery() {
      this.page.currentPage = 1
      this.getList()
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
