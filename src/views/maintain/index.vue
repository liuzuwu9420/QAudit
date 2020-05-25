<template>
  <div class="app-container">
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

    <el-table
      v-loading="loading"
      :data="maintainList"
      show-overflow-tooltip
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="40" align="center" />
      <el-table-column label="类型" align="center" prop="externalType" width="80" />
      <el-table-column label="审核一级分类" align="center" prop="auditCategory1" />
      <el-table-column label="审核二级分类" align="center" prop="auditCategory2" />
      <el-table-column label="维修地点" align="center" prop="location" />
      <el-table-column label="供应商名称/航站" align="center" prop="externalDeptName" />
      <el-table-column label="航站类别" align="center" prop="terminalCategory" />
      <el-table-column label="协议单位名称" align="center" prop="protocolunit" />
      <el-table-column label="地址" align="center" prop="address" />
      <el-table-column label="联系人" align="center" prop="contact" />
      <el-table-column label="邮箱" align="center" prop="email" />
      <el-table-column label="手机号" align="center" prop="mobile" />
    </el-table>

    <pagination
      v-show="page.total>0"
      :total="page.total"
      :page.sync="page.currentPage"
      :limit.sync="page.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="审核一级分类">
              <el-input v-model="form.auditCategory1" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="审核二级分类">
              <el-input v-model="form.auditCategory2" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="维修地点">
              <el-input v-model="form.location" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="供应商名称/航站">
              <el-input v-model="form.externalDeptName" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="航站类别">
              <el-input v-model="form.checkCoterminalCategoryntent" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="协议单位名称">
              <el-input v-model="form.protocolunit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人">
              <el-input v-model="form.contact" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="地址">
              <el-input v-model="form.address" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱">
              <el-input v-model="form.email" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号">
              <el-input v-model="form.mobile" />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'MaintainList',
  components: {
    Pagination
  },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 用户表格数据
      maintainList: [
        {
          externalType: '航站',
          auditCategory1: '航线协议维修单位审核',
          auditCategory2: '国内航线协议维修单位',
          location: '',
          externalDeptName: 'XFN襄阳',
          terminalCategory: 'D',
          protocolunit: '',
          address: '',
          contact: '',
          email: '',
          mobile: ''
        },
        {
          externalType: '供应商',
          auditCategory1: '供应商审核/评估计划',
          auditCategory2: '航材分销商',
          location: '',
          externalDeptName: '成都成发泰达航空科技有限公司',
          terminalCategory: '',
          protocolunit: '',
          address: '四川省成都高新区',
          contact: '李涤',
          email: 'lidi@forslart.com',
          mobile: '13541319222'
        }
      ],
      // 弹出层标题
      title: '',
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {
        externalType: '',
        auditCategory1: '',
        auditCategory2: '',
        location: '',
        externalDeptName: '',
        terminalCategory: '',
        protocolunit: '',
        address: '',
        contact: '',
        email: '',
        mobile: ''
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
    // 取消按钮
    cancel() {
      this.open = false
      this.reset()
    },
    // 表单重置
    reset() {
      this.form = {
        externalType: '',
        auditCategory1: '',
        auditCategory2: '',
        location: '',
        externalDeptName: '',
        terminalCategory: '',
        protocolunit: '',
        address: '',
        contact: '',
        email: '',
        mobile: ''
      }
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.page.pageCount = 1
      this.getList()
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.handleQuery()
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
    submitForm: function() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          console.log(valid)
        }
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
