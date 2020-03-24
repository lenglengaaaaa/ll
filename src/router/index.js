import Vue from 'vue'
import Router from 'vue-router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { message } from 'element-ui'
// import $ from 'jquery';

import store from '../store'
import { getToken } from '@/utils/auth' // get token from cookie
import { menuPermission, judgeUserDetail } from '@/utils/methods'
import OverallLayout from '@/Layout/Overall'
import SideBarLayout from '@/Layout/HasSidebar'

import projectRouter from './modules/project'
import seniorRouter from './modules/senior'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

Vue.use(Router)


const originalPush = Router.prototype.push;
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
      name:'Error',
      component: () => import('@/views/error-page/404'),
    },
    {
      path: '/NoPermission',
      name:'NoPermission',
      component: () => import('@/views/error-page/NoPermission'),
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
              id:"66",
              path:'detail',
              name:'AccountDetail',
              component: () => import('@/views/Account/Detail'),
              meta: { 
                title:'账户详情',
                icon: 'detail'
              }
            },
            {
              id:"67",
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
    { path: '*', redirect: '/404' }
  ]
})

router.beforeEach(async(to,from,next)=>{

  // start progress bar
  NProgress.start()

  // determine whether the user has logged in
  const hasToken = getToken();

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
    }
  }else{
    if((!JSON.parse(sessionStorage.getItem('userDetail')) || !JSON.parse(sessionStorage.getItem('permissionIds')) && to.path !== '/login') ){

      judgeUserDetail().then(res=>{
        if(!res) return next();
        const { permissionVO } = res;
        //所有权限
        sessionStorage.setItem('permissionVO',JSON.stringify(permissionVO));
        store.commit('user/SET_PERMISSIONVO', permissionVO);

        //菜单权限信息
        const { basiPermissionIds, menuPermissionIds } = permissionVO;
        const hasEleven = basiPermissionIds.permissionIds.split(',').some(item => item == 11);
        const permissionIds = _.sortBy([hasEleven && '111',...menuPermissionIds.permissionIds.split(',')]);
        sessionStorage.setItem('permissionIds',JSON.stringify([...permissionIds,'66','67']));
        store.commit('user/SET_PERMISSIONIDS', [...permissionIds,'66','67']);

        const resultArr = ["1","2","111","14","15","16","17","18","19","20","21"].filter(item=>{
            return permissionIds.includes(item);
        })
        if(!resultArr.length){
          next('/NoPermission');
        }else{
          next({
            name: menuPermission(resultArr[0])
          });
        }
      })

    }else if(to.path === '/senior' || to.path === '/senior/'){
      //高级管理权限设置
      const { permissionIds } = store.state.user;
      const seniorChildIds = ['14','15','16','17','18','19','20','21'];
      const hasPowerIds =_.sortBy(permissionIds.reduce((pre,cur)=>{
          if(seniorChildIds.includes(cur)){
              return [...pre,+cur];
          }
          return pre
      },[]));
      const routeNames = {
          14:'userControl', 15:'role', 16:'mainLine',
          17:'application', 18:'module', 19:'product',
          20:'system', 21:'repair',
      }
      next(`/senior/${routeNames[hasPowerIds[0]]}`);
    }else{
      next();
    }
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
