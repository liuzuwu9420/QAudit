<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-select
          v-model="checkedRoleId"
          placeholder="请选择一个角色"
          class="roleSelect"
          size="small"
          @change="onChangeRole"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.roleDesc"
            :value="item.id"
          />
        </el-select>
      </el-col>
      <!-- <el-col :span="4">
        <div></div>
      </el-col> -->
      <el-col :span="12">
        <el-button size="mini" type="primary" @click="resetAllAuth">重置所有权限</el-button>
        <el-button size="mini" type="primary" @click="refreshAuth">更新权限</el-button>
        <!--      <el-input v-model="query" clearable size="small" placeholder="请输入你要搜索的内容" style="width: 200px;" class="filter-item" />
        <el-button class="filter-item" size="small" type="success" icon="el-icon-search">搜索</el-button>-->
      </el-col>
    </el-row>

    <!--表格渲染-->
    <div class="table">
      <el-table
        :data="data"
        style="width: 100%;margin-bottom: 20px;"
        row-key="key"
        border
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column prop="name" label="模块名称" sortable>
          <template slot-scope="scope">
            <span>{{ scope.row.externMap.module.moduleDesc }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="value" label="模块路径"></el-table-column> -->
        <el-table-column prop="showMenu" label="菜单权限">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.externMap.authMenuStatus"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="changeMenuAuth(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="数据权限">
          <el-table-column prop="authPost" label="新增权限">
            <template slot-scope="scope">
              <el-switch
                v-if="!scope.row.children"
                v-model="scope.row.externMap.authPostStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changePostAuth(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="authDelete" label="删除权限">
            <template slot-scope="scope">
              <el-switch
                v-if="!scope.row.children"
                v-model="scope.row.externMap.authDeleteStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeDeleteAuth(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="authPut" label="修改权限">
            <template slot-scope="scope">
              <el-switch
                v-if="!scope.row.children"
                v-model="scope.row.externMap.authPutStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changePutAuth(scope.row)"
              />
            </template>
          </el-table-column>
          <el-table-column prop="authGet" label="查询权限">
            <template slot-scope="scope">
              <el-switch
                v-if="!scope.row.children"
                v-model="scope.row.externMap.authGetStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeGetAuth(scope.row)"
              />
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>

      <!--分页组件-->
      <!-- <el-pagination
        :total="total"
        :current-page="page"
        style="margin-top: 8px;float: right"
        layout="total, prev, pager, next, sizes"
        @size-change="sizeChange"
        @current-change="pageChange"
      />-->
    </div>
    <!-- 弹出框 -->
    <!--    <div class="dialog">
      <el-dialog title="功能授权" :visible.sync="dialogTableVisible">

        <el-row :gutter="20">
          <el-col :span="8">
            <el-tree :data="roleListData" @node-click="roleClicked"></el-tree>
          </el-col>
          <el-col :span="16"></el-col>
    </el-row>-->

    <!--        <el-table :data="gridData" style="width: 100%">
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-form :model="form">
                <el-form-item label="功能授权">
                  <el-select
                    v-model="form.roleIdList"
                    multiple
                    placeholder="请选择"
                    class="roleSelect"
                  >
                    <el-option
                      v-for="item in roleOptions"
                      :key="item.id"
                      :label="item.roleDesc"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                  <el-button
                    class="icon-save"
                    type="success"
                    icon="el-icon-check"
                    @click="save(props)"
                  >保存</el-button>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>
          <el-table-column label="功能名称" prop="funcDesc"></el-table-column>
          <el-table-column label="功能路径" prop="funcPath"></el-table-column>
          <el-table-column label="功能标识" prop="funcCode"></el-table-column>
    </el-table>-->
    <!-- </el-dialog> -->
    <!-- </div> -->
    <div class="dialog">
      <el-dialog title="模块详情" :visible.sync="dialogTableVisible2" width="500px" label-width="100px">
        <el-form :model="moduleForm" size="small">
          <el-form-item label="模块名称" prop="name">
            <el-input v-model="moduleForm.moduleDesc" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="模块路径">
            <el-input v-model="moduleForm.modulePath" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="模块编码">
            <el-input v-model="moduleForm.moduleCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="是否是菜单">
            <el-radio-group v-model="moduleForm.isMenu">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import initData from '@/mixins/initData'
import {
  getRoleList
} from '@/api/role'
import {
  pageListByRole,
  changeFuncAuth,
  resetAllModuleRoleAuth
} from '@/api/auth'

export default {
  mixins: [initData],
  data() {
    return {
      dialogTableVisible: false,
      dialogTableVisible2: false,

      activeName: 'menuAuth',
      authTableData: [],
      gridData: [],
      selections: [],
      roleOptions: [],
      roleListData: [],
      checkedRoleId: '1',
      form: {
        funcId: 0,
        roleIdList: []
      },
      moduleForm: {
        moduleDesc: '',
        modulePath: '',
        moduleCode: '',
        isMenu: 0
      }
    }
  },
  created() {
    this.$nextTick(() => {
      // this.init()
    })
    // this.getParentModule()

    getRoleList().then((res) => {
      if (res.code === '200') {
        this.roleOptions = res.obj
        if (this.roleOptions && this.roleOptions.length > 0) {
          this.checkedRoleId = this.roleOptions[0].id
          // pageListByRole(this.checkedRoleId, 1, 10).then((res) => {
          //   this.authTableData = res.obj;
          //   this.total = Number(res.total)
          // })
          this.init()
        }
      }
    })
  },
  mounted() {
    // this.getModuleList();
    // this.getAuthPageList();
  },
  methods: {

    resetAllAuth() {
      const that = this
      this.$confirm('此操作将会重置系统内所有角色的(菜单权限和数据权限),可能会造成功能无法访问, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then((r) => {
        resetAllModuleRoleAuth().then((res) => {
          if (res.code === '200') {
            that.$message({
              type: 'success',
              message: '重置成功!'
            })
          } else {
            that.$message.error(res.msg)
          }
          this.init()
        })
      }).catch((e) => {
        this.$message({
          type: 'info',
          message: '已取消重置'
        })
      })
    },

    changeMenuAuth(row) {
      // 检查当前选中的角色
      if (this.checkedRoleId) {
        const data = row.children
        if (row.children) {
          if (row.externMap.authMenuStatus === true) {
            row.externMap.authMenu = 1
            const parentAuthList = {
              id: row.key,
              roleId: row.externMap.roleId,
              moduleId: row.externMap.module.id,
              authMenu: row.externMap.authMenu,
              authGet: row.externMap.authGet,
              authPost: row.externMap.authPost,
              authPut: row.externMap.authPut,
              authDelete: row.externMap.authDelete
            }
            changeFuncAuth(parentAuthList).then((res) => {
              if (res.code === '200') {
                row.externMap.authMenuStatus = true
              } else {
                row.externMap.authPostStatus = false
              }
            })
            for (let i = 0; i < data.length; i++) {
              data[i].externMap.authMenuStatus = true
              data[i].externMap.authGetStatus = true
              const authList = {
                id: data[i].key,
                roleId: data[i].externMap.roleId,
                moduleId: data[i].externMap.module.id,
                authMenu: 1,
                authGet: 1,
                authPost: 0,
                authPut: 0,
                authDelete: 0
              }
              changeFuncAuth(authList).then((res) => {
                if (res.code === '200') {
                  data[i].externMap.authMenuStatus = true
                  data[i].externMap.authGetStatus = true
                } else {
                  row.externMap.authMenuStatus = false
                  data[i].externMap.authMenuStatus = false
                  data[i].externMap.authGetStatus = false
                }
              })
            }
          } else {
            row.externMap.authMenu = 0
            const parentAuthList = {
              id: row.key,
              roleId: row.externMap.roleId,
              moduleId: row.externMap.module.id,
              authMenu: row.externMap.authMenu,
              authGet: row.externMap.authGet,
              authPost: row.externMap.authPost,
              authPut: row.externMap.authPut,
              authDelete: row.externMap.authDelete
            }
            changeFuncAuth(parentAuthList).then((res) => {
              if (res.code === '200') {
                row.externMap.authMenuStatus = false
              } else {
                row.externMap.authPostStatus = true
              }
            })
            for (let i = 0; i < data.length; i++) {
              data[i].externMap.authMenuStatus = false
              data[i].externMap.authGetStatus = false
              data[i].externMap.authPutStatus = false
              data[i].externMap.authPostStatus = false
              data[i].externMap.authDeleteStatus = false
              const authList = {
                id: data[i].key,
                roleId: data[i].externMap.roleId,
                moduleId: data[i].externMap.module.id,
                authMenu: 0,
                authGet: 0,
                authPost: 0,
                authPut: 0,
                authDelete: 0
              }
              changeFuncAuth(authList).then((res) => {
                if (res.code === '200') {
                  data[i].externMap.authMenuStatus = false
                  data[i].externMap.authGetStatus = false
                  data[i].externMap.authPutStatus = false
                  data[i].externMap.authPostStatus = false
                  data[i].externMap.authDeleteStatus = false
                } else {
                  row.externMap.authMenuStatus = true
                  data[i].externMap.authMenuStatus = true
                  data[i].externMap.authGetStatus = true
                }
              })
            }
          }
        } else {
          if (row.externMap.authMenuStatus === true) {
            row.externMap.authGetStatus = true
            const authList = {
              id: row.key,
              roleId: row.externMap.roleId,
              moduleId: row.externMap.module.id,
              authMenu: 1,
              authGet: 1,
              authPost: 0,
              authPut: 0,
              authDelete: 0
            }
            changeFuncAuth(authList).then((res) => {
              if (res.code === '200') {
                row.externMap.authGetStatus = true
              } else {
                row.externMap.authGetStatus = false
                row.externMap.authMenuStatus = false
              }
            })
          } else {
            row.externMap.authGetStatus = false
            row.externMap.authPostStatus = false
            row.externMap.authPutStatus = false
            row.externMap.authDeleteStatus = false
            const authList = {
              id: row.key,
              roleId: row.externMap.roleId,
              moduleId: row.externMap.module.id,
              authMenu: 0,
              authGet: 0,
              authPost: 0,
              authPut: 0,
              authDelete: 0
            }
            changeFuncAuth(authList).then((res) => {
              if (res.code === '200') {
                row.externMap.authGetStatus = false
                row.externMap.authPostStatus = false
                row.externMap.authPutStatus = false
                row.externMap.authDeleteStatus = false
              } else {
                row.externMap.authGetStatus = true
                row.externMap.authMenuStatus = true
              }
            })
          }
        }
      } else {
        row.menuShowStatus = false
        this.$message({
          message: '请先选择一个角色',
          type: 'error'
        })
      }
    },

    changePostAuth(row) {
      if (row.externMap.authPostStatus === true) {
        row.externMap.authMenuStatus = true
        row.externMap.authMenu = 1
        row.externMap.authPost = 1
        row.externMap.authGet = 1
        row.externMap.authGetStatus = true
      } else {
        row.externMap.authPost = 0
        if (row.externMap.authPutStatus === false && row.externMap.authGetStatus === false && row.externMap.authDeleteStatus === false) {
          row.externMap.authMenuStatus = false
          row.externMap.authMenu = 0
          const menuAuthList = {
            id: row.key,
            roleId: row.externMap.roleId,
            moduleId: row.externMap.module.id,
            authMenu: 0,
            authGet: 0,
            authPost: 0,
            authPut: 0,
            authDelete: 0
          }
          changeFuncAuth(menuAuthList).then((res) => {
            if (res.code === '200') {
              row.externMap.authMenuStatus = false
              row.externMap.authGetStatus = false
              row.externMap.authPostStatus = false
              row.externMap.authPutStatus = false
              row.externMap.authDeleteStatus = false
            }
          })
        }
      }
      const authList = {
        id: row.key,
        roleId: row.externMap.roleId,
        moduleId: row.externMap.module.id,
        authMenu: row.externMap.authMenu,
        authGet: row.externMap.authGet,
        authPost: row.externMap.authPost,
        authPut: row.externMap.authPut,
        authDelete: row.externMap.authDelete
      }
      changeFuncAuth(authList).then((res) => {
        if (res.code !== '200') {
          row.externMap.authPostStatus = !row.externMap.authPostStatus
        }
      })
    },

    changeDeleteAuth(row) {
      if (row.externMap.authDeleteStatus === true) {
        row.externMap.authMenuStatus = true
        row.externMap.authMenu = 1
        row.externMap.authDelete = 1
        row.externMap.authGet = 1
        row.externMap.authGetStatus = true
      } else {
        row.externMap.authDelete = 0
        if (row.externMap.authPutStatus === false && row.externMap.authGetStatus === false && row.externMap.authPostStatus === false) {
          row.externMap.authMenuStatus = false
          row.externMap.authMenu = 0
          const menuAuthList = {
            id: row.key,
            roleId: row.externMap.roleId,
            moduleId: row.externMap.module.id,
            authMenu: 0,
            authGet: 0,
            authPost: 0,
            authPut: 0,
            authDelete: 0
          }
          changeFuncAuth(menuAuthList).then((res) => {
            if (res.code === '200') {
              row.externMap.authMenuStatus = false
              row.externMap.authGetStatus = false
              row.externMap.authPostStatus = false
              row.externMap.authPutStatus = false
              row.externMap.authDeleteStatus = false
            }
          })
        }
      }
      const authList = {
        id: row.key,
        roleId: row.externMap.roleId,
        moduleId: row.externMap.module.id,
        authMenu: row.externMap.authMenu,
        authGet: row.externMap.authGet,
        authPost: row.externMap.authPost,
        authPut: row.externMap.authPut,
        authDelete: row.externMap.authDelete
      }
      changeFuncAuth(authList).then((res) => {
        if (res.code !== '200') {
          row.externMap.authDeleteStatus = !row.externMap.authDeleteStatus
        }
      })
    },

    changePutAuth(row) {
      if (this.checkedRoleId === '1' && row.name === '权限管理') {
        this.$message.error('此操作将会导致当前角色丢失对系统的控制,后果严重')
        row.externMap.authPut = 1
        row.externMap.authPutStatus = true
        return
      }
      if (row.externMap.authPutStatus === true) {
        row.externMap.authMenuStatus = true
        row.externMap.authMenu = 1
        row.externMap.authPut = 1
        row.externMap.authGet = 1
        row.externMap.authGetStatus = true
      } else {
        row.externMap.authPut = 0
        if (row.externMap.authPostStatus === false && row.externMap.authGetStatus === false && row.externMap.authDeleteStatus === false) {
          row.externMap.authMenuStatus = false
          row.externMap.authMenu = 0
          const menuAuthList = {
            id: row.key,
            roleId: row.externMap.roleId,
            moduleId: row.externMap.module.id,
            authMenu: 0,
            authGet: 0,
            authPost: 0,
            authPut: 0,
            authDelete: 0
          }
          changeFuncAuth(menuAuthList).then((res) => {
            if (res.code === '200') {
              row.externMap.authMenuStatus = false
              row.externMap.authGetStatus = false
              row.externMap.authPostStatus = false
              row.externMap.authPutStatus = false
              row.externMap.authDeleteStatus = false
            }
          })
        }
      }
      const authList = {
        id: row.key,
        roleId: row.externMap.roleId,
        moduleId: row.externMap.module.id,
        authMenu: row.externMap.authMenu,
        authGet: row.externMap.authGet,
        authPost: row.externMap.authPost,
        authPut: row.externMap.authPut,
        authDelete: row.externMap.authDelete
      }
      changeFuncAuth(authList).then((res) => {
        if (res.code !== '200') {
          row.externMap.authPutStatus = !row.externMap.authPutStatus
        }
      })
    },

    changeGetAuth(row) {
      if (row.externMap.authGetStatus === true) {
        row.externMap.authMenuStatus = true
        row.externMap.authMenu = 1
        row.externMap.authGet = 1
        row.externMap.authGetStatus = true
      } else {
        row.externMap.authGet = 0
        if (row.externMap.authPutStatus === false && row.externMap.authPostStatus === false && row.externMap.authDeleteStatus === false) {
          row.externMap.authMenuStatus = false
          row.externMap.authMenu = 0
          const menuAuthList = {
            id: row.key,
            roleId: row.externMap.roleId,
            moduleId: row.externMap.module.id,
            authMenu: 0,
            authGet: 0,
            authPost: 0,
            authPut: 0,
            authDelete: 0
          }
          changeFuncAuth(menuAuthList).then((res) => {
            if (res.code === '200') {
              row.externMap.authMenuStatus = false
              row.externMap.authGetStatus = false
              row.externMap.authPostStatus = false
              row.externMap.authPutStatus = false
              row.externMap.authDeleteStatus = false
            }
          })
        }
      }
      const authList = {
        id: row.key,
        roleId: row.externMap.roleId,
        moduleId: row.externMap.module.id,
        authMenu: row.externMap.authMenu,
        authGet: row.externMap.authGet,
        authPost: row.externMap.authPost,
        authPut: row.externMap.authPut,
        authDelete: row.externMap.authDelete
      }
      changeFuncAuth(authList).then((res) => {
        if (res.code !== '200') {
          row.externMap.authGetStatus = !row.externMap.authGetStatus
        }
      })
    },
    // roleClicked(node){
    // },
    handleClick(tab, event) {
    },
    beforeInit() {
      this.url = '/sys_mgr/auth_mgr/query/pageList/byRole/' + this.checkedRoleId
      const sort = 'id,desc'
      this.params = {
        page: this.page,
        size: this.size,
        sort: sort
      }
      return true
    },
    onChangeRole() { // 改变角色时更新列表里的每个模块的权限状态
      pageListByRole(this.checkedRoleId).then((res) => {
        if (res.code === '200') {
          this.data = res.obj
          // this.init()
        }
      })
    },
    refreshAuth() {
      this.init()
    }
    // 编辑
    // edit (scope) {
    // this.dialogTableVisible = true
    // getFuncOfModule(scope.row.key).then((res) => {
    //   if (res.code === '200') {
    //     this.gridData = res.obj
    //   }
    // })
    // },
    // 查看
    // look (scope) {
    //   this.dialogTableVisible2 = true
    //   this.moduleForm.moduleDesc = scope.row.name
    //   this.moduleForm.modulePath = scope.row.value
    //   this.moduleForm.moduleCode = scope.row.value
    //   this.moduleForm.isMenu = scope.row.externMap.isMenu
    // },
  }
  // 保存
  // save (scope) {
  //   this.form.funcId = scope.row.id
  //   changeFuncAuth(this.form).then((res) => {
  //     if (res.code === '200') {
  //       this.$message({
  //         message: '保存成功',
  //         type: 'success'
  //       });
  //       this.dialogTableVisible = false
  //       this.form = {
  //         funcId: 0,
  //         roleIdList: []
  //       }
  //     }
  //   })
  // }
}
</script>

<style lang="scss">
.head-container {
  margin-bottom: 20px;
}

.roleSelect {
  width: 90%;
  margin-bottom: 20px;
}

.icon-save {
  position: absolute;
  right: 0;
}
</style>
