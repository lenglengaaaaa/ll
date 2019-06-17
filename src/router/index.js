import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

import store from '../store'
import { getToken } from '@/utils/auth' // get token from cookie
import OverallLayout from '@/Layout/Overall'
import SideBarLayout from '@/Layout/HasSidebar'

import {Message} from 'element-ui'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

Vue.use(Router)


const router= new Router({
  // mode: 'history',
  // base: '/dist',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: ()=>import('@/views/Login/index') //按需加载
    },
    {
      path: '/',
      name: 'Overall',
      component:OverallLayout,
      redirect: '/overview',
      children:[{
        path:'overview',
        name:'Overview',
        component:()=>import('@/views/Overview/index'),
        meta: { title: 'Overview', icon: 'overview' }
      }]
    },
    {
      path: '/application',
      component: OverallLayout,
      children: [
        {
          path: '/',
          name: 'Application',
          component: () => import('@/views/application/index'),
          meta: { title: 'Application', icon: 'application' }
        },
        {
          path:'',
          component:SideBarLayout,
          redirect: '/applyOverview',
          children:[
            {
              path:'applyOverview',
              name:'ApplyOverview',
              component: () => import('@/views/SingleApply/ApplyOverview'),
              meta: { title: 'ApplyOverview', icon: 'applyOverview' }
            },
            {
              path:'concentrator',
              name:'Concentrator',
              component: () => import('@/views/SingleApply/Concentrator'),
              meta: { title: 'Concentrator', icon: 'concentrator' }
            }
          ]
        }
      ]
    },
    {
      path: '/gateway',
      component: OverallLayout,
      children: [
        {
          path: '/',
          name: 'Gateway',
          component: () => import('@/views/Gateway/index'),
          meta: { title: 'Gateway', icon: 'gateway' }
        },
        {
          path: 'new',
          name: 'NewGateway',
          component: () => import('@/views/Gateway/components/NewGateway'),
          meta: { title: 'New', icon: 'add' }
        },
      ]
    },
    {
      path: '/senior',
      component: OverallLayout,
      children: [
        {
          path: '/',
          name: 'Senior',
          component: () => import('@/views/Senior/index'),
          meta: { title: 'Senior', icon: 'senior' }
        }
      ]
    },
  ]
})

router.beforeEach(async(to,from,next)=>{

  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = getToken()

  //某些页面需要校验是否登录，如果登录了就可以访问，否则跳转到登录页。这里我们通过localStorage 来简易判断是否登录
  if (!hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next()
      NProgress.done()
    } else {
      next('/login');
      NProgress.done()
      // const hasGetUserInfo = store.state.name
      // if (hasGetUserInfo) {
      //   next()
      // } else {
      //   try {
      //     // get user info
      //     await store.dispatch('getInfo')
      //     next()
      //   } catch (error) {
      //     // remove token and go to login page to re-login
      //     await store.dispatch('resetToken')
      //     Message.error(error || 'Has Error')
      //     next(`/login`)
      //     NProgress.done()
      //   }
      // }
    }
  }else{
    next();
  }
})

//比如一个页面较长，滚动到某个位置，
//再跳转到另一个页面，滚动条默认是在上一个页面停留的位置，而好的体验肯定是能返回顶端
router.afterEach((to,from,next)=>{
  $('.wrapper').scrollTop(0)

  // finish progress bar
  NProgress.done()
})

export default router
