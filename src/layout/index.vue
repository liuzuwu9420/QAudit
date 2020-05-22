<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />
    <div :class="{hasTagsView:needTagsView}" class="main-container">
      <div :class="{'fixed-header':fixedHeader}">
        <navbar />
        <tags-view v-if="needTagsView" />
      </div>
      <app-main />
      <right-panel v-if="showSettings">
        <settings />
      </right-panel>
    </div>
  </div>
</template>

<script>
import jwtDecode from 'jwt-decode'
import RightPanel from '@/components/RightPanel'
import { reFreshToken } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { AppMain, Navbar, Settings, Sidebar, TagsView } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapState } from 'vuex'

export default {
  name: 'Layout',
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView
  },
  mixins: [ResizeMixin],
  data() {
    return {
      timer: null
    }
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device,
      showSettings: state => state.settings.showSettings,
      needTagsView: state => state.settings.tagsView,
      fixedHeader: state => state.settings.fixedHeader
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  /* created() {
    this.timer = setInterval(() => {
      reFreshToken().then((res) => {
        if (res.code === '401') {
          removeToken('Token')
        } else {
          removeToken('Token')
          setToken('Token', res)
        }
      })
    }, 690000)
  },
  mounted() {
    this.firstTime = Math.round(new Date().getTime() / 1000)
    window.addEventListener('keyup', this.handleKeyup)
    window.addEventListener('click', this.handleClick)
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed() {
    clearInterval(this.timer)
    this.timer = null
    window.removeEventListener('keyup', this.handleKeyup)
    window.removeEventListener('click', this.handleClick)
    window.removeEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  }, */
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    handleClick(e) {
      const now = Math.round(new Date().getTime() / 1000)
      if (now - this.firstTime >= 1800) {
        removeToken('Token')
        this.$router.push({ path: '/login' })
        return
      }
      this.firstTime = now
      const userToken = getToken('Token')
      const token = jwtDecode(userToken)
      const time = token.exp - now
      if (time <= 60) {
        reFreshToken().then((res) => {
          if (res.code === '401') {
            removeToken('Token')
          } else {
            removeToken('Token')
            setToken('Token', res)
          }
        })
      }
    },
    handleKeyup(e) {
      const now = Math.round(new Date().getTime() / 1000)
      if (now - this.firstTime >= 1800) {
        removeToken('Token')
        this.$router.push({ path: '/login' })
        return
      }
      this.firstTime = now
      const userToken = getToken('Token')
      const token = jwtDecode(userToken)
      const time = token.exp - now
      if (time <= 60) {
        reFreshToken().then((res) => {
          if (res.code === '401') {
            removeToken('Token')
          } else {
            removeToken('Token')
            setToken('Token', res)
          }
        })
      }
    },
    handleScroll(e) {
      const now = Math.round(new Date().getTime() / 1000)
      if (now - this.firstTime >= 1800) {
        removeToken('Token')
        this.$router.push({ path: '/login' })
        return
      }
      this.firstTime = now
      const userToken = getToken('Token')
      const token = jwtDecode(userToken)
      const time = token.exp - now
      if (time <= 60) {
        reFreshToken().then((res) => {
          if (res.code === '401') {
            removeToken('Token')
          } else {
            removeToken('Token')
            setToken('Token', res)
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";

  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;

    &.mobile.openSidebar {
      position: fixed;
      top: 0;
    }
  }

  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
