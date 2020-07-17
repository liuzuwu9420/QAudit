<!--
 * @Author: your name
 * @Date: 2020-06-24 15:50:03
 * @LastEditTime: 2020-06-28 09:24:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \xy-vue\src\views\system\activiti\detail.vue
-->
<template>
  <div class="execution">
    <basic-container>
      <div class="header">
        <span class="header__title">{{ name }}</span>
        <el-button
          class="header__btn"
          type="primary"
          @click="breaks"
        >关闭返回列表
        </el-button>
      </div>
    </basic-container>
    <basic-container>
      <iframe id="activiModel" class="iframe" :src="src" />
    </basic-container>
  </div>
</template>

<script>
import BasicContainer from './card.vue'

export default {
  name: 'ActivitiDetail',
  components: {
    BasicContainer
  },
  data() {
    return {
      id: '',
      name: '',
      /* actUrl: '' */
      actUrl: `http://192.168.1.175:8999/modeler.html?modelId=`
    }
  },
  computed: {
    src() {
      return `${this.actUrl}${this.id}`
    }
  },
  created() {
    this.id = this.$route.params.id
    this.name = this.$route.query.name
    /* this.actUrl = `http://${window.location.host}/modeler.html?modelId=` */
  },
  mounted() {
    window.addEventListener('message', (event) => {
      this.breaks()
    })
  },
  methods: {
    breaks() {
      this.closeSelectedTag()
      this.$router.push({ path: '/activiti/activitiModel' })
    },
    async closeSelectedTag() {
      const view = {
        path: `/activiti/detail/${this.id}`
      }
      await this.$store.dispatch('tagsView/delView', view)
    }
  }
}
</script>

<style lang="scss" scoped>
  .execution {
    height: 99%;

    .header {
      position: relative;
      display: flex;
      align-items: center;

      &__title {
        font-size: 22px;
      }

      &__btn {
        position: absolute;
        right: 10px;
      }
    }

    .iframe {
      width: 100%;
      height: auto;
      min-height: 450px;
      border: 0;
      overflow: hidden;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
    }
  }
</style>
