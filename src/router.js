import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/home';

Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			name: 'home',
			component: Home,
		},
		{
			path: '/message',
			name: 'message',
			component: () => import('./views/message'), // 消息中心
		},
		{
			path: '/user',
			name: 'user',
			component: () => import('./views/user'), // 用户中心
		},
		{
			path: '/set',
			name: 'set',
			component: () => import('./views/set'), // 设置
		},
		{
			path: '/device',
			name: 'device',
			component: () => import('./views/device'), // 设备
			children: [
				{
					path: 'control',
					name: 'control',
					component: () => import('./views/control'), // 接入
				},
				{
					path: 'access',
					name: 'access',
					component: () => import('./views/access'), // 新建
				},
			],
		},
	],
});
