<template>
  <div class="app-container">
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
          <!-- <el-button
            class="filter-item"
            size="mini"
            type="success"
            icon="el-icon-plus"
            @click="add"
          >新增</el-button> -->
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
      <el-table-column prop="processId" label="流程编号" />
      <el-table-column prop="deploymentId" label="部署编号" />
      <el-table-column prop="name" label="流程名称" />
      <el-table-column prop="key" label="流程KEY" />
      <el-table-column prop="version" label="流程版本" />
      <!--<el-table-column label="流程bpm文件" >
        <template v-slot="{row}">
          <a herf="https://www.baidu.com" target="_blank">{{ row.version }}</a>
        </template>
      </el-table-column>
      <el-table-column prop="lastUpdateTime" label="流程图片" />-->
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-dropdown :show-timeout="0" placement="bottom">
            <el-button type="primary">
              功能<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="covertToModel(scope.row)">转为模型</el-dropdown-item>
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
import Pagination from '@/components/Pagination'
import { del, query, covertToModel } from '@/api/activitiDeploy'

export default {
  name: 'ActivitiDeploy',
  components: { Pagination },
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
    handleDel(row) {
      this.delLoading = true
      this.$confirm('是否确认删除该流程信息吗?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        del(row.deploymentId).then(res => {
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
    covertToModel(row) {
      this.delLoading = true
      this.$confirm('是否确认将部署的流程转为模型?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        covertToModel(row.processId).then(res => {
          this.delLoading = false
          this.getList()
          if (res.ok === true) {
            this.$message({
              message: res.obj,
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
    add() {
      this.isAdd = true
      // this.$refs.form.dialog = true
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
