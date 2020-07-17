<template>
  <div class="app-container">
    <!-- <eform ref="form"  :is-add="isAdd"></eform>-->
    <!-- <Search :query="query" /> -->
    <div class="head-container">
      <el-input
        v-model="queryParams.tableName"
        clearable
        placeholder="请输入你要搜索的内容"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="toQuery(queryParams)"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery(queryParams)"
      >搜索</el-button>
      <!--<el-button class="filter-item" size="mini" type="success" icon="el-icon-plus" @click="">新增</el-button>-->
    </div>

    <!--el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="info"
          icon="el-icon-upload"
          size="mini"
          @click="openImportTable"
        >导入</el-button>
      </el-col>
    </el-row>-->

    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      size="small"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%;"
    >
      <el-table-column type="index" width="80" />
      <el-table-column prop="tableName" label="表名" />
      <el-table-column prop="tableComment" label="表描述" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="handleGenTable(scope.row.tableName)" />
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <el-pagination
      :total="total"
      :current-page="page"
      style="margin-top: 8px;float: right"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"
    />
  </div>
</template>

<script>
import initData from '@/mixins/initData'

import { query, downLoadZip } from '@/api/gen'
import { mimeMap, resolveBlob } from '@/utils/zipdownload'

export default {
  name: 'Role',
  /* components: { eform },*/
  mixins: [initData],
  data() {
    return {
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
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tableName: ''
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
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
    beforeInit() {
      this.url = '/sys_mgr/gen/list/' + this.page + '/' + this.size
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      return true
    },
    add() {
      this.isAdd = true
      // this.$refs.form.dialog = true
    },
    edit(id) {
      this.isAdd = false
      /* const _this = this.$refs.form
      detail(id).then((res) => {
        if (res.code === '200') {
          _this.form = {
            id: res.obj.id,
            roleDesc: res.obj.roleDesc,
            code: res.obj.code,
            sn: res.obj.sn
          }
          // _this.dialog = true
        } else {
          this.$message.error(res.msg)
        }
      }) */
    },
    toQuery(queryParams) {
      if (!queryParams.tableName) {
        this.page = 1
        this.init()
        return
      }
      query(queryParams.tableName).then((res) => {
        if (res.code === '200') {
          this.data = res.obj
          this.total = res.obj.length
          // // this.init()
        } else {
          this.$message.error(res.msg)
        }
        this.query = ''
      })
    },
    /** 生成代码操作 */
    handleGenTable(tableName) {
      if (tableName === '') {
        this.$message({ showClose: true, message: '请选择要生成的数据', type: 'error' })
        return
      }
      // downLoadZip('/sys_mgr/gen/batchGenCode/' + tableName, 'xy')
      downLoadZip(tableName).then(res => {
        resolveBlob(res, mimeMap.zip)
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
  .head-container {
    margin-bottom: 20px;
  }
</style>
