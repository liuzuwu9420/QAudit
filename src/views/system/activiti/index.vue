<template>
  <div class="app-container">
    <eform ref="form" :is-add="isAdd" />
    <!-- <Search :query="query" /> -->
    <div class="head-container">
      <el-form ref="queryForm" :model="queryParams" :inline="true">
        <el-form-item label="模型名称" prop="code" class="form-item-self">
          <el-input
            v-model="queryParams.modelName"
            clearable
            placeholder="请输入模型名称"
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
      <el-table-column prop="name" label="模型名称" />
      <el-table-column prop="key" label="模型标识" />
      <el-table-column prop="version" label="版本号" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="lastUpdateTime" label="最后更新时间" />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="0" placement="bottom">
            <el-button type="primary">
              功能<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="handleView(scope.row)">模型图</el-dropdown-item>
              <el-dropdown-item divided @click.native="handleDeploy(scope.row)">部署</el-dropdown-item>
              <el-dropdown-item divided @click.native="exportModel(scope.row)">导出</el-dropdown-item>
              <el-dropdown-item divided @click.native="handleDel(scope.row)">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
import { del, query, deploy, exportData } from '@/api/activiti'

export default {
  name: 'ActivitiModel',
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
    // const _this = this.$refs.form
    // _this.dialog = false
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
    // 选择切换
    selectionChange: function(selections) {
      this.selections = selections
      this.$emit('selectionChange', { selections: selections })
    },
    toQuery() {
      this.page.currentPage = 1
      this.getList()
    },
    handleView(row) {
      const name = `模型id为${row.id}的${row.name}流程图`
      const src = `/activiti/detail/${row.id}`
      this.$router.push({
        path: src,
        query: {
          name: name
        }
      })
    },
    handleDeploy(row) {
      this.$confirm('是否确认部署ID为"' + row.id + '"的模型?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deploy(row.id).then(res => {
          if (res.code === '200') {
            this.$message({
              message: '部署成功',
              type: 'success'
            })
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
        }).catch(function(err) {
          this.$message({
            message: err,
            type: 'error'
          })
        })
      }
      )
    },
    handleDel(row) {
      this.delLoading = true
      this.$confirm('是否确认删除ID为"' + row.id + '"的模型?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(row.id).then(res => {
          this.delLoading = false
          this.getList()
          if (res.obj === true) {
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
        }).catch(err => {
          console.log(err)
          this.delLoading = false
        })
      }).catch(err => {
        console.log(err)
        this.delLoading = false
      })
    },
    exportModel(row) {
      exportData(row.id).then(res => {
        const aLink = document.createElement('a')
        var blob = new Blob([res.data], { type: 'application/xml' })
        var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
        var contentDisposition = decodeURI(res.headers['content-disposition'])
        var result = patt.exec(contentDisposition)
        var fileName = result[1]
        fileName = fileName.replace(/\"/g, '')
        aLink.href = URL.createObjectURL(blob)
        aLink.setAttribute('download', fileName) // 设置下载文件名称
        document.body.appendChild(aLink)
        aLink.click()
        document.body.appendChild(aLink)
      }).catch(err => {
        this.$message({
          message: `下载失败！${err}`,
          type: 'error'
        })
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
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
