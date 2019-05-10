import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';
import ElementUI from 'element-ui';
import echarts from 'echarts/lib/echarts';
import NProgress from 'nprogress';

import 'nprogress/nprogress.css';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';

import '@/assets/scss/index.scss';

// import './assets/iconfont/iconfont.js';
import SvgIcon from '@/components/svgIcon';
import storage from '@/assets/js/storage';

import { BASEURL } from '../src/config';
import { getUserInfo } from '@/api/user';

Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.prototype.$echarts = echarts;
// /* global TweenMax Draggable */
// Vue.prototype.$TweenMax = TweenMax;
// Vue.prototype.$Draggable = Draggable;

/* global dayjs */
Vue.prototype.$day = dayjs;
Vue.component('svg-icon', SvgIcon);

// NProgress.inc(0.2);
NProgress.configure({ easing: 'ease', speed: 600, showSpinner: false });

// 路由守卫
router.beforeEach((to, from, next) => {
	NProgress.start();
	if (to.fullPath === '/') {
		next({
			path: '/home',
		});
	}

	if (to.meta.requireAuth) {
		if (!store.state.token) {
			next({
				path: '/sign',
			});
		} else if (!store.state.user.userId) {
			getUserInfo()
				.then(resData => {
					store.dispatch('user', resData);
					next();
				})
				.catch(error => {
					ElementUI.Message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					next({
						path: '/sign',
					});
				});
		} else {
			next();
		}
	} else {
		next();
	}
});

// router.beforeResolve((to, from, next) => {
// 	next();
// });

router.afterEach(() => {
	NProgress.done();
	// console.log('afterEach');
	// console.log(from);
});

// axios 全局默认设置
axios.defaults.baseURL = BASEURL;
axios.defaults.headers.post['Content-Type'] = 'application/json';

// http request 拦截器
axios.interceptors.request.use(
	config => {
		if (store.state.token) {
			config.headers.Authorization = `Bearer ${store.state.token}`;
		}
		return config;
	},
	error => {
		return Promise.reject(error);
	}
);

// http response 拦截器
axios.interceptors.response.use(
	response => {
		if (response.data.token) {
			store.dispatch('token', response.data.token);
			storage.set('token', response.data.token);
		}
		return response;
	},
	error => {
		if (error.response.status === 401) {
			storage.remove('token');
			store.dispatch('token', '');
			store.dispatch('user', {});
			router.replace({
				name: 'sign',
			});
			return Promise.reject({
				message: '授权已过期，请重新登录',
			});
		}
		return Promise.reject(error);
	}
);

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
