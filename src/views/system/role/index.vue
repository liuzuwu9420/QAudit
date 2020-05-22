<template>
  <div class="app-container">
    <eform ref="form" :is-add="isAdd" />
    <!-- <Search :query="query" /> -->
    <div class="head-container">
      <el-input
        v-model="query"
        clearable
        placeholder="请输入你要搜索的内容"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="toQuery(query)"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery(query)"
      >搜索</el-button>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus" @click="add">新增</el-button>
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
      <el-table-column type="index" width="80" />
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
import { format } from '@/utils/datetime'
import eform from './form'
import { del, query, detail } from '@/api/role'

export default {
  name: 'Role',
  components: { eform },
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
      selections: [] // 列表选中列
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
    const _this = this.$refs.form
    _this.dialog = false
    next()
  },
  methods: {
    format,
    beforeInit() {
      this.url = '/sys_mgr/role_mgr/query/pageList/' + this.page + '/' + this.size
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      return true
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
          this.dleChangePage()
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
    toQuery(id) {
      if (!id) {
        this.page = 1
        this.init()
        return
      }
      query(id).then((res) => {
        if (res.code === '200') {
          this.data = res.obj
          this.total = res.obj.length
          // // this.init()
        } else {
          this.$message.error(res.msg)
        }
        this.query = ''
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
