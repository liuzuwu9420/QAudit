<template>
  <el-card class="scroll-panel">
    <i class="el-icon-phone-outline scroll-panel-icon" />
    <ul class="new-list" :class="{anim:animate}" @mouseenter="Stop()" @mouseleave="Up()">
      <li v-for="(item, index) in noticeList" :key="index" @click="scrollToPath">
        <div>
          <span>{{ item.title }}</span>
        </div>
      </li>
    </ul>
  </el-card>
</template>
<script>
export default {
  name: 'PanelScroll',
  data() {
    return {
      noticeList: [
        {
          title: '待办事项新增',
          url: ''
        },
        {
          title: '处理中问题新增',
          url: ''
        },
        {
          title: '待处理问题新增',
          url: ''
        }
      ],
      animate: false,
      intNum: undefined
    }
  },
  created: function() {
    this.getNoticeData()
  },
  beforeDestroy() {
    this.Stop()
  },
  methods: {
    getNoticeData() {
      this.ScrollUp()
    },
    ScrollUp() {
      if (this.intNum != null) {
        clearInterval(this.intNum)
        this.intNum = null
      }
      this.intNum = setInterval(() => {
        this.animate = true // 向上滚动的时候需要添加css3过渡动画
        setTimeout(() => {
          this.noticeList.push(this.noticeList[0]) // 将数组的第一个元素添加到数组的
          this.noticeList.shift() // 删除数组的第一个元素
          this.animate = false
        }, 500)
      }, 5000)
    },
    // 鼠标移上去停止
    Stop() {
      clearInterval(this.intNum)
      this.intNum = null
    },
    Up() {
      this.ScrollUp()
    },
    scrollToPath(item) {
      console.log(item)
    }
  }
}
</script>
<style lang="scss" scoped>
.scroll-panel {
  height: 36px;
  padding: 5px;
  margin-bottom: 10px;
    &:hover {
      color: #4e8df6;
    }
  /deep/ .el-card__body {
    padding: 0;
  }
  .scroll-panel-icon {
    float: left;
    padding: 4px 0 0 4px;
  }
  .new-list {
    height: 28px;
    line-height: 28px;
    transition: top 0.5s;
    // overflow: hidden;
    margin: 0;
    float: left;
    padding-left: 10px;
    li {
      list-style: none;
      line-height: 28px;
      height: 28px;
      cursor: pointer;
    }
  }
  .anim {
    transition: all 0.5s;
    margin-top: -28px; //高度等于行高
  }
}
</style>
