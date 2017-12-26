// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import '@/styles/index.scss' // global css
import App from './App'
import router from './router'
import store from './store'
import * as filters from './filters'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './icons'
import './permission'
import './mock'  // 该项目所有请求使用mockjs模拟
import VueTabs from 'vue-nav-tabs'
import 'vue-nav-tabs/themes/vue-tabs.css'

var ElTreeGrid = require('element-tree-grid')
Vue.component(ElTreeGrid.name, ElTreeGrid)

Vue.use(ElementUI)
Vue.use(VueTabs)

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
