<template>
  <div class="app-container">
    <eform ref="form" :is-add="isAdd" :data="parentIdList" />
    <!-- <Search :query="query" /> -->
    <div class="head-container">
      <!-- <el-input
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
      >搜索</el-button>-->
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
      row-key="key"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      @selection-change="selectionChange"
    >
      <el-table-column type="index" width="80" />
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
import eform from './form'
import { del, detail, getPageList } from '@/api/dict'

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
      selections: [], // 列表选中列
      parentIdList: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
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
    beforeInit() {
      this.url = '/sys_mgr/sys_dic/query/pageList/' + this.page + '/' + this.size
      const sort = 'id,desc'
      this.params = { page: this.page, size: this.size, sort: sort }
      return true
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
            this.dleChangePage()
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
    /* toQuery(id) {
      if (!id) {
        this.page = 1
        this.init()
        return
      }
      query(id).then((res) => {
        if (res.code === '200') {
          this.data = res.obj
          // // this.init()
        } else {
          this.$message.error(res.msg)
        }
      })
    }, */
    getParentId() {
      getPageList(1, 100).then((res) => {
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
.head-container {
  margin-bottom: 20px;
}
</style>
