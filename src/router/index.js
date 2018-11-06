import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/auth/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    meta: { title: '控制面板' },
    hidden: false,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '控制面板', icon: 'example' }
    }]
  },

  {
    path: '/categories',
    component: Layout,
    hidden: true,
    name: 'Category',
    children: [{
      path: 'index',
      component: () => import('@/views/categories/index'),
      meta: { title: '分类管理', icon: 'example' }
    }]
  },

  {
    path: '/teachers',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'userIndex',
        component: () => import('@/views/teachers/index'),
        meta: { title: '教师管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/courses',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'courseIndex',
        component: () => import('@/views/courses/index'),
        meta: { title: '课程管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/tests',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'testIndex',
        component: () => import('@/views/tests/index'),
        meta: { title: '考试管理', icon: 'form' }
      },
      {
        path: '/tests/:test/paper',
        name: 'testPaper',
        hidden: true,
        component: () => import('@/views/tests/paper'),
        meta: { title: '考题管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/classrooms',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'classroomIndex',
        component: () => import('@/views/classrooms/index'),
        meta: { title: '班级管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/questions',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'questionIndex',
        component: () => import('@/views/questions/index'),
        meta: { title: '题库管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/share-users',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'shareUserIndex',
        component: () => import('@/views/shareUsers/index'),
        meta: { title: '共享管理', icon: 'form' }
      }
    ]
  },

  {
    path: '/test-results',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'testResultIndex',
        component: () => import('@/views/testResults/index'),
        meta: { title: '考试记录', icon: 'form' }
      }
    ]
  },

  {
    path: '/statistics',
    component: Layout,
    hidden: false,
    children: [
      {
        path: 'index',
        name: 'statisticsIndex',
        component: () => import('@/views/statistics/index'),
        meta: { title: '成绩导出', icon: 'form' }
      }
    ]
  },

  {
    path: '/password',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'passwordIndex',
        component: () => import('@/views/password/index'),
        meta: { title: '修改密码', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

