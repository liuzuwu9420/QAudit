<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--检查单数据-->
      <el-col :lg="6" :sm="7" :md="8" :xs="24">
        <div class="head-container">
          <el-input
            v-model="checkListName"
            placeholder="请输入检查单名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div v-loading="treeLoading" class="head-container">
          <el-tree
            ref="tree"
            :data="checkOptins"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            class="tree-list"
            @node-click="handleNodeClick"
          >
            <span slot-scope="{ node }" class="custom-tree-node">
              <el-tooltip class="item" effect="dark" placement="bottom">
                <div slot="content">
                  <span>{{ node.data.systemName ? node.data.systemName : '' }}</span>
                  <span>{{ node.data.itemNo ? node.data.itemNo : '' }}</span>
                  <span>{{ node.data.nameCn ? node.data.nameCn : '' }}</span>
                  <span>{{ node.data.nameEn ? `(${node.data.nameEn})` : '' }}</span>
                </div>
                <div class="treeNode">
                  <span>{{ node.data.systemName ? node.data.systemName : '' }}</span>
                  <span>{{ node.data.itemNo ? node.data.itemNo : '' }}</span>
                  <span>{{ node.data.nameCn ? node.data.nameCn : '' }}</span>
                  <span>{{ node.data.nameEn ? `(${node.data.nameEn})` : '' }}</span>
                </div>
              </el-tooltip>
            </span>
          </el-tree>
          <!-- <el-tree
            ref="tree"
            :data="checkOptins"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            @node-click="handleNodeClick"
            @node-contextmenu="handleContextmenu"
          />-->
        </div>

        <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
          <li @click="refreshSelectedCheck">刷新</li>
          <li v-if="level===1" @click="addCheckListItem">添加检查单体系</li>
          <li v-if="level===2" @click="changeCheckListItem">编辑检查单体系</li>
          <li v-if="level===2" @click="deleteCheckListItem">删除检查单体系</li>
          <li v-if="level===2" @click="addCheckListItem">添加检查单项目</li>
          <li v-if="level===3" @click="changeCheckListItem">编辑检查单项目</li>
          <li v-if="level===3" @click="deleteCheckListItem">删除检查单项目</li>
          <li v-if="level===3" @click="addCheckListItem">添加下级检查单项目</li>
          <li v-if="level===4" @click="changeCheckListItem">编辑检查单项目</li>
          <li v-if="level===4" @click="deleteCheckListItem">删除检查单项目</li>
        </ul>
      </el-col>
      <!--检查单单位数据-->
      <el-col :lg="18" :sm="17" :md="16" :xs="24">
        <el-row :gutter="10" class="head">
          <!-- <el-col :span="1.5">
            <el-button
              type="success"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="handleDelete"
            >删除</el-button>
          </el-col>-->
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              :disabled="single"
              @click="handleUpdate"
            >属性</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" icon="el-icon-view" size="mini" @click="previewSearch">预览</el-button>
          </el-col>
        </el-row>

        <el-table
          v-loading="loading"
          :data="checkList"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="项目号" align="center" prop="itemNo" width="80" />
          <el-table-column label="检查内容" align="center" prop="nameCn" show-overflow-tooltip />
          <el-table-column label="审核类别" align="center" prop="auditType" show-overflow-tooltip />
          <el-table-column label="检查单类别" align="center" prop="checkTypeCn" />
          <el-table-column
            label="备注"
            align="center"
            prop="remark"
            width="100"
            show-overflow-tooltip
          />
        </el-table>

        <pagination
          v-show="page.total>0"
          :total="page.total"
          :page.sync="page.currentPage"
          :limit.sync="page.pageSize"
          @pagination="getItemCheckList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="800px">
      <el-form ref="form" :model="form" label-width="150px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目号">
              <el-input v-model="form.itemNo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="form.remark" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="审核类型一级">
              <el-input v-model="form.auditCategory1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核类型">
              <el-input v-model="form.auditType" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查单类型">
              <el-input v-model="form.checkTypeCn" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="仅适用于FAA、EASA">
              <el-radio v-model="form.isOnlyFor" label="1">是</el-radio>
              <el-radio v-model="form.isOnlyFor" label="0">否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查内容(中文)">
              <el-input v-model="form.nameCn" type="textarea" :autosize="{ minRows: 4}" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查内容(英文)">
              <el-input v-model="form.nameEn" type="textarea" :autosize="{ minRows: 4}" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>-->
    </el-dialog>
    <el-dialog :title="titleClickAdd" :visible.sync="openClickAdd" width="600px">
      <el-form ref="formClickAdd" :model="formClickAdd" label-width="120px">
        <el-form-item :label="level===1?'检查单体系名称':'检查单项目名称'">
          <el-input v-model="formClickAdd.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('formClickAdd')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleClickEdit" :visible.sync="openClickEdit" width="600px">
      <el-form ref="formClickEdit" :model="formClickEdit" label-width="120px">
        <el-form-item label="项目号">
          <el-input v-model="formClickEdit.itemNo" />
        </el-form-item>
        <el-form-item label="项目名称(中文)">
          <el-input v-model="formClickEdit.itemNameCN" />
        </el-form-item>
        <el-form-item label="项目名称(英文)">
          <el-input v-model="formClickEdit.itemNameEN" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('formClickEdit')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titlePreviewSearch" :visible.sync="dialogPreviewSearch" width="600px">
      <el-form ref="formClickPreview" :model="formClickPreview" label-width="160px">
        <el-form-item label="选择体系">
          <el-select v-model="formClickPreview.checkSys" multiple placeholder="请选择" class="formSelect">
            <el-option
              v-for="item in formClickPreview.checkSystem"
              :key="item.qaCheckSystemId"
              :label="item.systemName"
              :value="item.qaCheckSystemId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核计划一级分类">
          <el-select v-model="formClickPreview.auditCat" placeholder="请选择" class="formSelect">
            <el-option
              v-for="item in formClickPreview.auditCategory"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="审核类型">
          <el-input v-model="formClickPreview.auditType" />
        </el-form-item>
        <el-form-item label="选择被审部门/项目性质">
          <el-input v-model="formClickPreview.chooseProperty" />
        </el-form-item>
        <el-form-item label="检查单类型">
          <el-select v-model="formClickPreview.organi" placeholder="请选择" class="formSelect">
            <el-option
              v-for="item in formClickPreview.organization"
              :key="item.key"
              :label="item.value"
              :value="item.key"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('formClickPreview')">确定预览</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { getCheckList, getItemCheckList, getcheckSearch } from '@/api/checkList'

export default {
  name: 'CheckList',
  components: {
    Pagination
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      treeLoading: false,
      // 右击
      visible: false,
      level: null,
      top: 0,
      left: 0,
      selectedCheck: {},
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 检查单表格数据
      checkList: [],
      // 弹出层标题
      title: '',
      // 检查单树选项
      checkOptins: [],
      // 是否显示弹出层
      open: false,
      // 检查单名称
      checkListName: undefined,
      // 表单参数
      form: {},

      titleClickAdd: '',
      openClickAdd: false,
      formClickAdd: {
        name: ''
      },
      titleClickEdit: '',
      openClickEdit: false,
      formClickEdit: {
        itemNo: '',
        itemNameCN: '',
        itemNameEN: ''
      },
      // 预览检索
      titlePreviewSearch: '预览检索',
      dialogPreviewSearch: false,
      formClickPreview: {
        checkSys: '',
        checkSystem: [],
        auditCat: '',
        auditCategory: [],
        auditType: '',
        chooseProperty: '',
        organi: '',
        organization: []
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // 分页参数
      page: {
        currentPage: 1,
        pageCount: 1,
        pageSize: 10,
        total: 0
      },
      itemPath: ''
    }
  },
  watch: {
    // 根据名称筛选部门树
    checkListName(val) {
      this.$refs.tree.filter(val)
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    /** 查询检查单下拉树结构 */
    getList() {
      this.treeLoading = true
      getCheckList()
        .then(res => {
          if (res.code === '200') {
            this.checkOptins = []
            this.checkOptins.push(res.obj)
          } else {
            this.$message({
              type: 'info',
              message: `获取检查单失败！
                ${res.msg}`
            })
          }
          this.treeLoading = false
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: `获取检查单失败！
                ${e}`
          })
          this.treeLoading = false
        })
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      if (data.systemName !== '检查单') {
        this.page.currentPage = 1
        this.itemPath = data.itemPath
        this.getItemCheckList()
      }
    },
    getItemCheckList() {
      this.loading = true
      const params = {
        pageNum: this.page.currentPage,
        pageSize: this.page.pageSize,
        itemPath: this.itemPath
      }
      getItemCheckList(params)
        .then(res => {
          if (res.code === '200') {
            this.checkList = res.obj
            this.page.total = +res.total
          } else {
            this.$message({
              type: 'info',
              message: `获取检查单内容失败！
                ${res.msg}`
            })
          }
          this.loading = false
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: `获取检查单内容失败！
                ${e}`
          })
          this.loading = false
        })
    },
    // 节点右击事件
    handleContextmenu(e, data, node) {
      const menuMinWidth = 105
      const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      const offsetWidth = this.$el.offsetWidth // container width
      const maxLeft = offsetWidth - menuMinWidth // left boundary
      const left = e.clientX - offsetLeft + 15 // 15: margin right

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      this.top = e.clientY - 80
      this.visible = true
      this.level = node.level
      this.selectedCheck = data
    },
    closeMenu() {
      this.visible = false
    },
    refreshSelectedCheck() {
      console.log(this.selectedCheck)
    },
    addCheckListItem() {
      console.log(this.selectedCheck)
      console.log(this.level)
      if (this.level === 1) {
        this.titleClickAdd = '添加检查单体系'
      } else if (this.level === 2) {
        this.titleClickAdd = '添加检查单项目'
      } else if (this.level === 3) {
        this.titleClickAdd = '添加下级检查单项目'
      }
      this.openClickAdd = true
    },
    changeCheckListItem() {
      console.log(this.selectedCheck)
      console.log(this.level)
      this.titleClickEdit = '检查单项目'
      this.openClickEdit = true
    },
    deleteCheckListItem() {
      console.log(this.selectedCheck)
      console.log(this.level)
      this.$confirm('此操作将永久删除该检查单项目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.openClickAdd = false
      this.openClickEdit = false
      this.dialogPreviewSearch = false
      this.reset()
    },
    // 表单重置
    /* reset() {
      this.form = {
        itemNo: '',
        remark: '',
        auditCategory1: '',
        auditCategory: '',
        checkListType: '',
        checkContent: ''
      }
      this.formClickAdd = {
        name: ''
      }
      this.formClickEdit = {
        itemNo: '',
        itemNameCN: '',
        itemNameEN: ''
      }
      this.formClickPreview = {
        chooseSystem: '',
        auditPlanClassification1: '',
        auditType: '',
        chooseProperty: '',
        checklistType: '',
        chooseBasisType: ''
      }
    }, */
    /** 搜索按钮操作 */
    handleQuery() {
      this.page.pageCount = 1
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = [...selection]
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /* 预览检索 */
    previewSearch() {
      getcheckSearch()
        .then(res => {
          if (res.code === '200') {
            this.formClickPreview.checkSystem = res.obj.checkSystem
            for (const i in res.obj.auditCategory) {
              const o = {}
              o.key = i
              o.value = res.obj.auditCategory[i]
              this.formClickPreview.auditCategory.push(o)
            }
            for (const i in res.obj.organization) {
              const o = {}
              o.key = i
              o.value = res.obj.organization[i]
              this.formClickPreview.organization.push(o)
            }
            console.log(res)
            console.log(this.formClickPreview)
          } else {
            this.$message({
              type: 'info',
              message: `获取检查单内容失败！
                ${res.msg}`
            })
          }
        })
        .catch(e => {
          this.$message({
            type: 'error',
            message: `获取检查单内容失败！
                ${e}`
          })
        })
      this.dialogPreviewSearch = true
    },
    jumpPdfDown() {
      const data = '111'
      setTimeout(() => {
        const router = this.$router.resolve({
          path: '/pdf/download',
          query: {
            value: data
          }
        })
        window.open(router.href, '_blank')
      }, 500)
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.title = '添加检查单'
    },
    /** 修改按钮操作 */
    handleUpdate() {
      this.open = true
      this.title = '检查单属性'
      this.form = this.ids[0]
    },
    /** 提交按钮 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === 'form') {
            console.log(formName)
          } else if (formName === 'formClickAdd') {
            console.log(formName)
          } else if (formName === 'formClickPreview') {
            this.jumpPdfDown()
          }
        }
        this.cancel()
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const qaCheckContentIds =
        row.qaCheckContentId || this.ids[0].qaCheckContentId
      this.$confirm(
        '是否确认删除用户编号为"' + qaCheckContentIds + '"的数据项?',
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(function() {
          console.log('delete')
        })
        .then(() => {
          this.getList()
          this.msgSuccess('删除成功')
        })
        .catch(function() {})
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  .tree-list {
    font-size: 12px;
    /deep/ .custom-tree-node,
    .custom-tree-node .treeNode {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
  .formSelect {
    width: 100%;
  }
}
</style>
