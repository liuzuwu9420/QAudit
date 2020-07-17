<template>
  <el-card class="card">
    <el-row :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card shadow="always" class="card-panel" @click.native="handleToPath('/plan/index')">
          <div class="card-panel-icon-wrapper">
            <img src="../../../../assets/dashboard_images/gysxxgl.png">
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              审核计划
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card shadow="always" class="card-panel" @click.native="handleToPath('/upcoming/plan')">
          <div class="card-panel-icon-wrapper">
            <img src="../../../../assets/dashboard_images/gyszbgl.png">
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              待办事项
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card shadow="always" class="card-panel" @click.native="handleToPath('/check/index')">
          <div class="card-panel-icon-wrapper">
            <img src="../../../../assets/dashboard_images/tzgg.png">
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              审核检查单
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6">
        <el-card shadow="always" class="card-panel" @click.native="handleToPath('/report/reviewsNumber')">
          <div class="card-panel-icon-wrapper">
            <img src="../../../../assets/dashboard_images/tjfx.png">
          </div>
          <div class="card-panel-description">
            <div class="card-panel-text">
              数据分析
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  components: {
  },
  methods: {
    handleToPath(path) {
      this.$router.push({
        path: path
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  margin-bottom: 20px;
.card-panel {
  text-align: center;
  cursor: pointer;
    &:hover {
      color: #4e8df6;
    }
}
}
</style>
