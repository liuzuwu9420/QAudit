<template>
  <div class="app-container">
    <eform ref="form" :is-add="isAdd" :data="parentIdList" />
    <!-- <Search :query="query" /> -->
    <div class="head">
      <el-input
        v-model="queryParams.dicCode"
        clearable
        placeholder="请输入字典编码"
        style="width: 200px; margin-right: 10px;"
        class="filter-item"
        @keyup.enter.native="toQuery()"
      />
      <el-button
        class="filter-item"
        size="mini"
        type="success"
        icon="el-icon-search"
        @click="toQuery()"
      >搜索</el-button>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-plus" @click="add">新增</el-button>
    </div>
    <!--表格渲染-->
    <el-table
      v-loading="loading"
      :data="data"
      :stripe="true"
      :highlight-current-row="true"
      style="width: 100%;"
      row-key="key"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="字典描述" />
      <el-table-column prop="dicCode" label="字典编码">
        <template slot-scope="scope">
          <span>{{ scope.row.externMap.dicCode }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="value" label="值" />

      <el-table-column label="操作" width="130px" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row.key)" />
          <el-button
            slot="reference"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="subDelete(scope.row)"
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
import { del, detail, query } from '@/api/dict'

export default {
  name: 'DataDictionary',
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
      parentIdList: [],
      page: {
        currentPage: 1,
        pageSize: 10,
        total: 0
      },
      queryParams: {
        dicCode: undefined
      }
    }
  },
  created() {
    this.getList()
    this.getParentId()
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
    subDelete(row) {
      if (row.children) {
        this.delLoading = true
        this.$confirm('该数据包含子级数据,此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(row.key).then(res => {
            if (res.code === '200') {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            } else {
              this.$message.error(res.msg)
            }
            this.delLoading = false
            this.parentIdList = []
            this.getParentId()
            // this.dleChangePage()
            this.init()
          }).catch(err => {
            console.log(err)
            this.delLoading = false
          })
        })
      } else {
        this.delLoading = true
        this.$confirm('此操作将永久删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del(row.key).then(res => {
            if (res.code === '200') {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            } else {
              this.$message.error(res.msg)
            }
            this.delLoading = false
            this.parentIdList = []
            this.getParentId()
            this.dleChangePage()
            this.init()
          }).catch(err => {
            console.log(err)
            this.delLoading = false
          })
        })
      }
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
            id: res.obj.key,
            dicDesc: res.obj.name,
            dicValue: res.obj.value,
            dicCode: res.obj.extern.dicCode,
            parentId: ''
          }
          if (!res.obj.extern.parentId) {
            _this.form.parentId = null
          } else {
            _this.form.parentId = res.obj.extern.parentId
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
    },
    getParentId() {
      const params = {
        pageNum: 1,
        pageSize: 1000
      }
      query(params).then((res) => {
        const data = res.obj
        const parent = []
        let obj = {}
        for (let i = 0; i < data.length; i++) {
          if (!data[i].externMap.parentId) {
            obj.value = data[i].key
            obj.label = data[i].name
            parent.push(obj)
            obj = {}
          }
        }

        // for (let i = 0; i < data.length; i++) {
        //   for (let j = 0; j < parent.length; j++) {
        //     if (data[i].externMap.parentId === parent[j].key) {
        //       parent[j].children.push(data[i])
        //     }
        //   }
        // }
        this.parentIdList = parent
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
