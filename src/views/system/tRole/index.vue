<template>
  <div class="app-container">
    <eform ref="form" :is-add="isAdd" />
    <iform ref="importForm" />
    <div class="head-container">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="ID" prop="id" class="form-item-self">
          <el-input
            v-model="queryParams.id"
            clearable
            placeholder="请输入ID"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="toQuery()"
          />
        </el-form-item>
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
        <el-form-item label="排序" prop="sn" class="form-item-self">
          <el-input
            v-model="queryParams.sn"
            clearable
            placeholder="请输入排序"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="toQuery()"
          />
        </el-form-item>
        <el-form-item label="创建人ID" prop="creater" class="form-item-self">
          <el-input
            v-model="queryParams.creater"
            clearable
            placeholder="请输入创建人ID"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="toQuery()"
          />
        </el-form-item>
        <el-form-item label="创建时间" prop="createTime" class="form-item-self">
          <el-date-picker
            v-model="queryParams.createTime"
            clearable
            size="small"
            style="width: 100%"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="修改人ID" prop="changer" class="form-item-self">
          <el-input
            v-model="queryParams.changer"
            clearable
            placeholder="请输入修改人ID"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="toQuery()"
          />
        </el-form-item>
        <el-form-item label="修改时间" prop="changeTime" class="form-item-self">
          <el-date-picker
            v-model="queryParams.changeTime"
            clearable
            size="small"
            style="width: 100%"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="创建人名称" prop="createrDesc" class="form-item-self">
          <el-input
            v-model="queryParams.createrDesc"
            clearable
            placeholder="请输入创建人名称"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="toQuery()"
          />
        </el-form-item>
        <el-form-item label="修改人名称" prop="changerDesc" class="form-item-self">
          <el-input
            v-model="queryParams.changerDesc"
            clearable
            placeholder="请输入修改人名称"
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
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-download"
            @click="handleExport"
          >导出</el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-upload2"
            @click="handleImport"
          >导入</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :stripe="true"
      highlight-current-row
      style="width: 100%;"
      @selection-change="selectionChange"
    >
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="code" label="角色编码" />
      <el-table-column prop="roleDesc" label="角色名称" />
      <el-table-column prop="sn" label="排序" />
      <el-table-column prop="creater" label="创建人ID" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="changer" label="修改人ID" />
      <el-table-column prop="changeTime" label="修改时间" />
      <el-table-column prop="createrDesc" label="创建人名称" />
      <el-table-column prop="changerDesc" label="修改人名称" />

      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template v-slot="scope">
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
    <!-- <el-pagination
      :total="total"
      :current-page="currentPage"
      style="margin-top: 8px;float: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    /> -->
  </div>
</template>

<script>
import eform from './form'
import iform from './importForm'
import Pagination from '@/components/Pagination'
import { del, query, detail, exportData } from '@/api/TRole'

export default {
  name: 'TRole',
  components: { eform, iform, Pagination },
  data() {
    return {
      loading: true,
      data: [],
      isAdd: false,
      delLoading: false,
      showBatchDelete: {
        // 是否显示操作组件
        type: Boolean,
        default: true
      },
      showOperation: {
        // 是否显示操作组件
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
        id: undefined,
        code: undefined,
        roleDesc: undefined,
        sn: undefined,
        creater: undefined,
        createTime: undefined,
        changer: undefined,
        changeTime: undefined,
        createrDesc: undefined,
        changerDesc: undefined
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
        del(id)
          .then(res => {
            this.delLoading = false
            // this.dleChangePage()
            this.getList()
            if (res.code === '200') {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            } else {
              this.$message({
                message: res.msg,
                type: 'error'
              })
            }
          })
          .catch(() => {
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
      detail(id).then(res => {
        if (res.code === '200') {
          _this.form = {
            id: res.obj.id,
            code: res.obj.code,
            roleDesc: res.obj.roleDesc,
            sn: res.obj.sn,
            creater: res.obj.creater,
            createTime: res.obj.createTime,
            changer: res.obj.changer,
            changeTime: res.obj.changeTime,
            createrDesc: res.obj.createrDesc,
            changerDesc: res.obj.changerDesc
          }
          _this.dialog = true
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          })
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
    },
    /** 导出按钮操作 */
    handleExport() {
      const queryParams = this.queryParams
      this.$confirm('是否确认导出所有数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(function() {
          return exportData(queryParams)
        })
        .then(response => {
          this.download(response.obj)
        })
        .catch(function() {})
    },
    /** 导入按钮操作 */
    handleImport() {
      this.$refs.importForm.upload.title = '角色导入'
      this.$refs.importForm.upload.open = true
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
.form-item-self {
  margin-bottom: 0;
}
</style>
