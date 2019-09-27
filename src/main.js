// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// import moment from 'moment'
// import echarts from 'echarts'

import '@/assets/icons' // icon
import '@/components'

import router from './router'
import store from './store'

import request from './utils/Request' 
import api from './utils/API'

import element from './utils/Element'
import '../theme/index.css'

import mqtt from './utils/Mqtt'

import App from './App'

import _ from 'lodash'

//挂载elemtnt-ui
Vue.use(element);

//挂载echarts
Vue.prototype.$echarts = echarts;

//全局挂载request方法
Vue.use(request);

//挂载mqtt
Vue.prototype.$mqtt = mqtt;

//全局挂载api
Vue.use(api);

//挂载lodash
Vue.prototype._ = _

//挂载moment
Vue.prototype.$moment = moment;

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})