import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { message } from 'element-ui'
// import $ from 'jquery';

import store from '../store'
import { getToken } from '@/utils/auth' // get token from cookie
import OverallLayout from '@/Layout/Overall'
import SideBarLayout from '@/Layout/HasSidebar'

import projectRouter from './modules/project'
import seniorRouter from './modules/senior'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

Vue.use(Router)


const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

const router= new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: ()=>import('@/views/Login/index') //按需加载
    },
    {
      path: '/404',
      component: () => import('@/views/error-page/404'),
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
      }]
    },
    {
      path: '/gateway',
      component: OverallLayout,
      children: [
        {
          path: '/',
          name: 'Gateway',
          component: () => import('@/views/Gateway/index'),
        },
        {
          path: 'new',
          name: 'NewGateway',
          component: () => import('@/views/Gateway/components/NewGateway'),
        },
      ]
    },
    projectRouter,
    seniorRouter,
    {
      path: '/account',
      component: OverallLayout,
      children: [
        {
          path: '',
          name: 'Account',
          component:SideBarLayout,
          redirect: '/account/detail',
          children:[
            {
              path:'detail',
              name:'AccountDetail',
              component: () => import('@/views/Account/Detail'),
              meta: { 
                title:'账户详情',
                icon: 'detail'
              }
            },
            {
              path:'changePass',
              name:'ChangePass',
              component: () => import('@/views/Account/ChangePass'),
              meta: { 
                title:'修改密码',
                icon: 'modify'
              }
            }
          ]
        }
      ]
    },
    //404页面
    { path: '*', redirect: '/404', hidden: true }
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
      message({
        type:'error',
        message:'登录过期，请重新登录',
      });
      store.dispatch('user/resetToken').then(()=>{
        setTimeout(() => {
          next('/login');
          NProgress.done()
        }, 2000);
      })
      
      // const hasGetUserInfo = store.state.user.name
      // if (hasGetUserInfo) {
      //   next()
      // } else {
      //   try {
      //     // get user info
      //     await store.dispatch('user/getInfo')
      //     next()
      //   } catch (error) {
      //     // remove token and go to login page to re-login
      //     await store.dispatch('user/resetToken')
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
