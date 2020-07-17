<template>
  <div class="dashboard-editor-container">
    <panel-scroll />
    <panel-card />
    <panel-case />
  </div>
</template>

<script>
import PanelCard from './components/PanelCard'
import PanelScroll from './components/PanelScroll'
import PanelCase from './components/PanelCase'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelCard,
    PanelScroll,
    PanelCase
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 16px;
  background-color: rgb(240, 242, 245);
  position: relative;
  /*.github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }*/
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
