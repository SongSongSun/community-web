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
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  {
    path: '/community',
    component: Layout,
    redirect: '/community/notice',
    name: 'Community',
    meta: { title: '社区管理', icon: 'example' },
    children: [
      {
        path: 'notice',
        name: 'Notice',
        component: () => import('@/views/community/Notice'),
        meta: { title: '公告管理', icon: 'table' }
      },
      {
        path: 'building',
        name: 'Building',
        component: () => import('@/views/community/Building'),
        meta: { title: '楼栋管理', icon: 'table' }
      },
      {
        path: 'community-user',
        name: 'CommunityUser',
        component: () => import('@/views/community/CommunityUser'),
        meta: { title: '社区用户管理', icon: 'table' }
      },
      {
        path: 'property-problem',
        name: 'PropertyProblem',
        component: () => import('@/views/community/property-problem/PropertyProblem'),
        meta: { title: '物业问题管理', icon: 'tree' }
      },
      {
        path: 'property-problem-detail',
        name: 'PropertyProblemDetail',
        component: () => import('@/views/community/property-problem/PropertyProblemDetail'),
        hidden: true,
        meta: { title: '物业问题详情' }
      },
      {
        path: 'activity-manage',
        name: 'ActivityManage',
        component: () => import('@/views/community/activity/ActivityManage'),
        meta: { title: '活动管理', icon: 'tree' }
      },
      {
        path: 'lost-found-manage',
        name: 'LostFoundManage',
        component: () => import('@/views/community/lost-found/LostFoundManage'),
        meta: { title: '失物招领管理', icon: 'tree' }
      },
      {
        path: 'community-news-manage',
        name: 'CommunityNewsManage',
        component: () => import('@/views/community/community-news/CommunityNewsManage'),
        meta: { title: '社区新闻管理', icon: 'tree' }
      },
      {
        path: 'create-community-news',
        name: 'CreateCommunityNews',
        component: () => import('@/views/community/community-news/CreateCommunityNews'),
        hidden: true,
        meta: { title: '创建社区新闻', icon: 'tree' }
      },
      {
        path: 'community-news-detail',
        name: 'CommunityNewsDetail',
        component: () => import('@/views/community/community-news/CommunityNewsDetail'),
        hidden: true,
        meta: { title: '社区新闻详情', icon: 'tree' }
      }

    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/manage',
    name: 'System',
    meta: { title: '系统管理', icon: 'example' },
    children: [
      {
        path: 'manage',
        name: 'Manage',
        component: () => import('@/views/system/JobManage'),
        meta: { title: '定时任务管理', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
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

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
