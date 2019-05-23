// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import {router} from './router'
import request from './utils/request' 
import moment from 'moment'
import '../theme/index.css'
import element from './element'

//挂载elemtn
Vue.use(element)

//全局挂载request方法
Vue.use(request);

//挂载moment
Vue.prototype.$moment = moment

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
