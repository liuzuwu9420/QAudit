import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', affix: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/upcoming',
    component: Layout,
    redirect: '/upcoming/plan',
    name: 'Upcoming',
    meta: {
      title: 'upcoming',
      icon: 'guide'
    },
    children: [
      {
        path: 'plan',
        component: () => import('@/views/upcoming/audit-plan'),
        name: 'AuditPlan',
        meta: { title: 'auditPlan', value: '1' }
      },
      {
        path: 'report',
        component: () => import('@/views/upcoming/audit-report'),
        name: 'AuditReport',
        meta: { title: 'auditReport', value: '1' }
      },
      {
        path: 'processing',
        component: () => import('@/views/upcoming/processing'),
        name: 'ProcessingProblrm',
        meta: { title: 'processingProblrm', value: '3' }
      }
    ]
  },
  {
    path: '/plan',
    component: Layout,
    redirect: '/plan/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/upcoming/audit-plan'),
        name: 'AuditPlan',
        meta: { title: 'auditPlan', icon: 'edit' }
      }
    ]
  },
  {
    path: '/task',
    component: Layout,
    redirect: '/task/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/audit/audit-task'),
        name: 'AuditTask',
        meta: { title: 'auditTask', icon: 'education' }
      },
      {
        path: 'conclusion',
        component: () => import('@/views/audit/audit-conclusion'),
        name: 'AuditConclusion',
        hidden: true,
        meta: { title: 'auditConclusion' }
      },
      {
        path: 'probRecord',
        component: () => import('@/views/audit/audit-problem-recording'),
        name: 'AuditProblemRecording',
        hidden: true,
        meta: { title: 'auditProblemRecording' }
      }
    ]
  },
  {
    path: '/problem',
    component: Layout,
    redirect: '/problem/pending',
    name: 'Problem',
    meta: {
      title: 'problem',
      icon: 'form'
    },
    children: [
      {
        path: 'pending',
        component: () => import('@/views/problem/pending'),
        name: 'Pending',
        meta: { title: 'pending', value: '2' }
      },
      {
        path: 'processing',
        component: () => import('@/views/problem/processing'),
        name: 'Processing',
        meta: { title: 'processing', value: '3' }
      },
      {
        path: 'completed',
        component: () => import('@/views/problem/completed'),
        name: 'Completed',
        meta: { title: 'completed', value: '2' }
      }
    ]
  },
  {
    path: '/check',
    component: Layout,
    redirect: '/check/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/check-list/index'),
        name: 'CheckList',
        meta: { title: 'checkList', icon: 'nested' }
      }
    ]
  },
  {
    path: '/maintain',
    component: Layout,
    redirect: '/maintain/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/maintain/index'),
        name: 'Maintain',
        meta: { title: 'maintain', icon: 'peoples' }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: '/report/reviewsNumber',
    name: 'Report',
    meta: {
      title: 'report',
      icon: 'tree-table'
    },
    children: [
      {
        path: 'reviewsNumber',
        component: () => import('@/views/report/reviews-number'),
        name: 'ReviewsNumber',
        meta: { title: 'reviewsNumber' }
      },
      {
        path: 'problemSynthesis',
        component: () => import('@/views/report/problem-synthesis'),
        name: 'ProblemSynthesis',
        meta: { title: 'problemSynthesis' }
      },
      {
        path: 'feedbackOverdue',
        component: () => import('@/views/report/feedback-overdue'),
        name: 'FeedbackOverdue',
        meta: { title: 'feedbackOverdue' }
      },
      {
        path: 'measuresOverdue',
        component: () => import('@/views/report/measures-overdue'),
        name: 'MeasuresOverdue',
        meta: { title: 'measuresOverdue' }
      },
      {
        path: 'allOpeningItems',
        component: () => import('@/views/report/all-opening-items'),
        name: 'AllOpeningItems',
        meta: { title: 'allOpeningItems' }
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/account/account-manage'),
        name: 'AccountManage',
        meta: { title: 'accountManage', icon: 'user' }
      }
    ]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'SystemManage',
    meta: {
      title: 'systemManage',
      icon: 'component'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/system/Employee/index.vue'),
        name: 'UserManage',
        meta: { title: 'userManage' }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role/index.vue'),
        name: 'RolesManage',
        meta: { title: 'rolesManage' }
      },
      {
        path: 'auth',
        component: () => import('@/views/system/auth/index.vue'),
        name: 'AuthorityManage',
        meta: { title: 'authorityManage' }
      },
      {
        path: 'dict',
        component: () => import('@/views/system/dict/index.vue'),
        name: 'DataDictionary',
        meta: { title: 'dataDictionary' }
      },
      {
        path: 'tRole',
        component: () => import('@/views/system/tRole/index.vue'),
        name: 'TRole',
        meta: { title: 'tRole' }
      },
      {
        path: 'gen',
        component: () => import('@/views/system/gen/index.vue'),
        name: 'Gen',
        meta: { title: 'gen' }
      }
    ]
  },
  {
    path: '/activiti',
    component: Layout,
    redirect: '/system/activiti',
    name: 'ActivitiManage',
    meta: {
      title: 'activitiManage',
      icon: 'component'
    },
    children: [
      {
        path: 'activitiModel',
        component: () => import('@/views/system/activiti/index.vue'),
        name: 'ActivitiModel',
        meta: { title: 'ActivitiModel' }
      },
      {
        path: 'activitiDeploy',
        component: () => import('@/views/system/activitiDeploy/index.vue'),
        name: 'ActivitiDeploy',
        meta: { title: 'ActivitiDeploy' }
      },
      {
        path: 'detail/:id',
        component: () => import('@/views/system/activiti/detail.vue'),
        name: 'ActivitiDetail',
        hidden: true,
        meta: { title: 'ActivitiDetail' }
      }
    ]
  },
  {
    path: '/pdf/download',
    component: () => import('@/views/pdf/download'),
    name: 'PdfDownload',
    hidden: true
  },
  {
    path: '/password',
    component: Layout,
    redirect: '/password/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/account/password'),
        name: 'Password',
        hidden: true,
        meta: { title: 'password' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
