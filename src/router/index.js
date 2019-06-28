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
      }]
    },
    {
      path: '/project',
      component: OverallLayout,
      children: [
        {
          path: '/',
          name: 'Project',
          component: () => import('@/views/Project'),
        },
        {
          path:'',
          component:SideBarLayout,
          redirect: '/projectOverview',
          children:[
            {
              path:'projectOverview',
              name:'ProjectOverview',
              component: () => import('@/views/SingleProject/ProjectOverview'),
              meta: { 
                title:'项目总览',
                icon: '#icon-zonglan'
              }
            },
            {
              path:'courts',
              name:'Courts',
              component: () => import('@/views/SingleProject/Asset'),
              redirect:'courts/list',
              meta: { 
                title:'台区管理',
                icon: '#icon-transformer-area'
              },
              children:[
                {
                  path:'list',
                  name:'CourtsList',
                  component: () => import('@/views/SingleProject/Asset/Courts'),
                },
                {
                  path:'newCourts',
                  name:'NewCourts',
                  component: () => import('@/views/SingleProject/Asset/components/CreateEdit'),
                  meta:{title:'添加(编辑)台区'}
                }
              ]
            },
            {
              path:'room',
              name:'Room',
              component: () => import('@/views/SingleProject/Asset'),
              redirect:'room/list',
              meta: { 
                title:'配电房管理',
                icon: '#icon-peidianfang'
              },
              children:[
                {
                  path:'list',
                  name:'RoomList',
                  component: () => import('@/views/SingleProject/Asset/Room'),
                },
                {
                  path:'newRoom',
                  name:'NewRoom',
                  component: () => import('@/views/SingleProject/Asset/components/CreateEdit'),
                  meta:{title:'添加(编辑)配电房'}
                }
              ]
            },
            {
              path:'cabinet',
              name:'Cabinet',
              component: () => import('@/views/SingleProject/Asset'),
              redirect:'cabinet/list',
              meta: { 
                title:'配电柜管理',
                icon: '#icon-peidiangui'
              },
              children:[
                {
                  path:'list',
                  name:'CabinetList',
                  component: () => import('@/views/SingleProject/Asset/Cabinet'),
                },
                {
                  path:'newCabinet',
                  name:'NewCabinet',
                  component: () => import('@/views/SingleProject/Asset/components/CreateEdit'),
                  meta:{title:'添加(编辑)配电柜'}
                }
              ]
            },
            {
              path:'cover',
              name:'Cover',
              component: () => import('@/views/SingleProject/Asset'),
              redirect:'cover/list',
              meta: { 
                title:'井盖管理',
                icon: '#icon-jinggai'
              },
              children:[
                {
                  path:'list',
                  name:'CoverList',
                  component: () => import('@/views/SingleProject/Asset/Cover'),
                },
                {
                  path:'newCover',
                  name:'NewCover',
                  component: () => import('@/views/SingleProject/Asset/components/CreateEdit'),
                  meta:{title:'添加(编辑)井盖'}
                }
              ]
            },
            {
              path:'cable',
              name:'Cable',
              component: () => import('@/views/SingleProject/Asset'),
              redirect:'cable/list',
              meta: { 
                title:'线缆管理',
                icon: '#icon-sjt-'
              },
              children:[
                {
                  path:'list',
                  name:'CableList',
                  component: () => import('@/views/SingleProject/Asset/Cable'),
                },
                {
                  path:'newCable',
                  name:'NewCable',
                  component: () => import('@/views/SingleProject/Asset/components/CreateEdit'),
                  meta:{title:'添加(编辑)线缆'}
                }
              ]
            },
            {
              path:'equipment',
              name:'Equipment',
              component: () => import('@/views/SingleProject/Equipment'),
              redirect:'equipment/list',
              meta: { 
                title:'设备管理',
                icon: '#icon-shebei'
              },
              children:[
                {
                  path:'list',
                  name:'EquList',
                  component: () => import('@/views/SingleProject/Equipment/List'),
                },
                {
                  path:'newEqu',
                  name:'NewEqu',
                  component: () => import('@/views/SingleProject/Equipment/New'),
                  meta:{title:'添加(编辑)设备'}
                }
              ]
            },
            {
              path:'alarm',
              name:'Alarm',
              component: () => import('@/views/SingleProject/Alarm'),
              redirect:'alarm/list',
              meta: { 
                title:'告警管理',
                icon: '#icon-gaojing'
              },
              children:[
                {
                  path:'list',
                  name:'AlarmList',
                  component: () => import('@/views/SingleProject/Alarm/List'),
                },
                {
                  path:'detail',
                  name:'Detail',
                  component: () => import('@/views/SingleProject/Alarm/Detail'),
                  meta:{title:'告警详情'}
                }
              ]
            },
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
        },
        {
          path: 'new',
          name: 'NewGateway',
          component: () => import('@/views/Gateway/components/NewGateway'),
        },
      ]
    },
    {
      path: '/senior',
      component: OverallLayout,
      children: [
        {
          path: '',
          name: 'Senior',
          component:SideBarLayout,
          redirect: '/senior/userControl',
          children:[
            {
              path:'userControl',
              name:'UserControl',
              component: () => import('@/views/Senior/User'),
              meta: { 
                title:'用户管理',
                icon: '#icon-touxiang'
              }
            },
            {
              path:'permission',
              name:'Permission',
              component: () => import('@/views/Senior/Permission'),
              meta: { 
                title:'权限管理',
                icon: '#icon-quanxian'
              }
            },
            {
              path:'application',
              name:'Application',
              component: () => import('@/views/Senior/Application'),
              meta: { 
                title:'应用管理',
                icon: '#icon-yingyong1'
              }
            },
            {
              path:'module',
              name:'Module',
              component: () => import('@/views/Senior/Module'),
              meta: { 
                title:'模组管理',
                icon: '#icon-mozu'
              }
            },
            {
              path:'product',
              name:'Product',
              component: () => import('@/views/Senior/Product'),
              meta: { 
                title:'产品管理',
                icon: '#icon-chanpin'
              }
            },
            {
              path:'system',
              name:'System',
              component: () => import('@/views/Senior/System'),
              meta: { 
                title:'系统操作管理',
                icon: '#icon-xitongcaozuo'
              }
            },
            {
              path:'repair',
              name:'Repair',
              component: () => import('@/views/Senior/Repair'),
              meta: { 
                title:'设备修复管理',
                icon: '#icon-xiufu'
              }
            },
          ]
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
