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
        <div class="head-container">
          <el-tree
            ref="tree"
            :data="checkOptins"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            default-expand-all
            @node-click="handleNodeClick"
            @node-contextmenu="handleContextmenu"
          />
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

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
            >新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="success"
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
          </el-col>
        </el-row>

        <el-table v-loading="loading" :data="checkList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="40" align="center" />
          <el-table-column label="项目号" align="center" prop="itemNo" width="80" />
          <el-table-column label="检查内容" align="center" prop="nameCn" :show-overflow-tooltip="true" />
          <el-table-column label="备注" align="center" prop="remark" />
          <el-table-column label="审核类别" align="center" prop="auditType" />
          <el-table-column label="检查单类别" align="center" prop="checkType" />
        </el-table>

        <pagination
          v-show="page.total>0"
          :total="page.total"
          :page.sync="page.currentPage"
          :limit.sync="page.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="项目号">
              <el-input v-model="form.itemNo" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="备注">
              <el-input v-model="form.remark" placeholder="请输入内容" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核类型一级">
              <el-input v-model="form.auditCategory1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核类型">
              <el-input v-model="form.auditCategory" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="检查单类型">
              <el-input v-model="form.checkListType" />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="检查内容">
              <el-input v-model="form.checkContent" type="textarea" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="titleRightClick" :visible.sync="openRightClick" width="600px" append-to-body>
      <el-form ref="formRightClick" :model="formRightClick" label-width="120px">
        <el-form-item label="检查单项目名称">
          <el-input v-model="formRightClick.name" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('formRightClick')">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'CheckList',
  components: {
    Pagination
  },
  data() {
    return {
      // 遮罩层
      loading: false,
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
      checkList: [
        {
          itemNo: '1.1.1.08',
          nameCn: '应确保技术资料现行有效',
          nameEn: '',
          remark: '',
          auditType: '航站审核',
          checkType: '标准检查单'
        },
        {
          itemNo: '1.1.1.09',
          nameCn: '外站适航性资料的可接近性',
          nameEn: '',
          remark: '',
          auditType: '航站审核',
          checkType: '标准检查单'
        }
      ],
      // 弹出层标题
      title: '',
      // 检查单树选项
      checkOptins: [
        {
          label: '检查单',
          id: 1,
          children: [
            {
              label: 'Part 121 工程委托',
              id: 121,
              children: [
                {
                  label: '1.1 航站审核',
                  id: 12111,
                  children: [
                    {
                      label: '1.1.1 适航性资料',
                      id: 121111
                    },
                    {
                      label: '1.1.2 工程技术系统',
                      id: 121112
                    }
                  ]
                },
                {
                  label: '1.2 航站维修能力扩展',
                  id: 12112,
                  children: [
                    {
                      label: '1.2.1 航展维修',
                      id: 121121
                    }
                  ]
                }
              ]
            }, {
              label: 'Part 145 维修管理',
              id: 145,
              children: [
                {
                  label: '1.1 航站审核',
                  id: 14511,
                  children: [
                    {
                      label: '1.1.1 适航性资料',
                      id: 145111
                    },
                    {
                      label: '1.1.2 工程技术系统',
                      id: 145112
                    }
                  ]
                },
                {
                  label: '1.2 维修记录',
                  id: 14512
                },
                {
                  label: '1.3 航站维修能力扩展',
                  id: 14513,
                  children: [
                    {
                      label: '1.3.1 航展维修',
                      id: 145131
                    }
                  ]
                }
              ]
            }
          ]
        }
      ],
      // 是否显示弹出层
      open: false,
      // 检查单名称
      checkListName: undefined,
      // 表单参数
      form: {
        itemNo: '',
        remark: '',
        auditCategory1: '',
        auditCategory: '',
        checkListType: '',
        checkContent: ''
      },

      titleRightClick: '',
      openRightClick: false,
      formRightClick: {
        name: ''
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
        total: 1
      }
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
    /* this.getList()
    this.getTreeselect()
    this.getDicts('sys_normal_disable').then(response => {
      this.statusOptions = response.data
    })
    this.getDicts('sys_user_sex').then(response => {
      this.sexOptions = response.data
    })
    this.getConfigKey('sys.user.initPassword').then(response => {
      this.initPassword = response.msg
    }) */
  },
  methods: {
    /** 查询用户列表 */
    getList() {

    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      /* treeselect().then(response => {
        this.checkOptins = response.data
      }) */
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 节点单击事件
    handleNodeClick(data) {
      // this.queryParams.deptId = data.id
      console.log('节点', data)
      this.getList()
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
      this.selectedTag = data
    },
    closeMenu() {
      this.visible = false
    },
    refreshSelectedCheck() {
      console.log(this.selectedCheck)
    },
    addCheckListItem() {
      console.log(this.level)
      this.titleRightClick = '添加检查单项目'
      this.openRightClick = true
    },
    changeCheckListItem() {
      console.log(this.level)
    },
    deleteCheckListItem() {
      console.log(this.level)
    },
    // 取消按钮
    cancel() {
      this.open = false
      this.openRightClick = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        itemNo: '',
        remark: '',
        auditCategory1: '',
        auditCategory: '',
        checkListType: '',
        checkContent: ''
      }
      this.formRightClick = {
        name: ''
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.page.pageCount = 1
      this.getList()
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.qaCheckContentId)
      this.single = selection.length !== 1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.open = true
      this.title = '添加检查单'
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.open = true
      this.title = '修改检查单'
    },
    /** 提交按钮 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === 'form') {
            console.log(formName)
          } else if (formName === 'formRightClick') {
            console.log(formName)
          }
        }
        this.cancel()
      })
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const qaCheckContentIds = row.qaCheckContentId || this.ids
      this.$confirm('是否确认删除用户编号为"' + qaCheckContentIds + '"的数据项?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function() {
        console.log('delete')
      }).then(() => {
        this.getList()
        this.msgSuccess('删除成功')
      }).catch(function() {})
    }
  }
}
</script>
<style lang="scss" scoped>
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
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, .3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
</style>
