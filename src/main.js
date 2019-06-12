// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import moment from 'moment'
import echarts from 'echarts'
import VueAMap from "vue-amap";
import './iconfont'

import router from './router'
import store from './store'

import request from './utils/Request' 
import api from './utils/API'

import element from './utils/Element'
import '../theme/index.css'

import App from './App'


//挂载vue-amap
setTimeout(()=>{
  localStorage.clear('_AMap_raster')
  Vue.use(VueAMap);
})

// 初始化vue-amap
VueAMap.initAMapApiLoader({
    // 高德key
    key: '788e08def03f95c670944fe2c78fa76f',
    // 插件集合 （插件按需引入）
    plugin: [
      'AMap.Autocomplete', 
      'AMap.PlaceSearch', 
      'AMap.Scale', 
      'AMap.OverView', 
      'AMap.ToolBar', 
      'AMap.MapType', 
      'AMap.PolyEditor', 
      'AMap.CircleEditor',
      'AMap.MarkerClusterer'
    ],
});

//挂载elemtnt-ui
Vue.use(element)

//挂载echarts
Vue.prototype.$echarts = echarts

//全局挂载request方法
Vue.use(request);

//全局挂载api
Vue.use(api)

//挂载moment
Vue.prototype.$moment = moment

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})