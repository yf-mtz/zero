import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import '@/modules/index/assets/base.less'
Vue.use(VueAxios, axios)
Vue.config.productionTip = false

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')
