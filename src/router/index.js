import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router= new Router({
  // mode: 'history',
  // base: '/dist',
  routes: [
    {
      path: '/',
      name: 'Login',
      component: (resolve)=>require(['@/views/Login/index.vue'],resolve) //按需加载
    }
  ]
})


// router.beforeEach((to,from,next)=>{
//   console.log(to ,' to ');
//   // window.document.title = to.meta.title;
//   // next();

//   //某些页面需要校验是否登录，如果登录了就可以访问，否则跳转到登录页。这里我们通过localStorage 来简易判断是否登录
//   if(!window.localStorage.getItem('token')){
//     if(to.path ==='/login'){
//       next();
//     }else{
//       next('/login');
//     }
//   }else{
//     next();
//   }
//   // next()
// })

//比如一个页面较长，滚动到某个位置，
//再跳转到另一个页面，滚动条默认是在上一个页面停留的位置，而好的体验肯定是能返回顶端
// router.afterEach((to,from,next)=>{
//   window.scrollTo(0,0)
// })

export default router
