// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import moment from 'moment'

import router from './router'
import store from './store'

import request from './utils/request' 
import api from './utils/API'

import element from './utils/element'
import '../theme/index.css'

import App from './App'


//挂载elemtn
Vue.use(element)

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
