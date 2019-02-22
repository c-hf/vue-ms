import Vue from 'vue';
import Router from 'vue-router';
import store from './store';
import Home from './views/home';
import index from './views/index';

Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		// index
		{
			path: '/',
			name: 'index',
			component: index,
			// beforeEnter: (to, from, next) => {
			// 	store.state.user.groupId
			// 		? next()
			// 		: next({ path: '/information' });
			// },
			children: [
				{
					path: '/home',
					name: 'home',
					meta: {
						requireAuth: true,
					},
					component: Home,
				},

				// 家庭权限组
				{
					path: '/family',
					name: 'family',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/family'),
				},
				// 消息中心
				{
					path: '/message',
					name: 'message',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/message'),
				},
				// 用户中心
				{
					path: '/user',
					name: 'user',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/user'),
				},
				// 设置
				{
					path: '/set',
					name: 'set',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/set'),
				},
				// // 设备
				// {
				// 	path: '/device',
				// 	name: 'device',
				// 	meta: {
				// 		requireAuth: true,
				// 	},
				// 	beforeEnter: (to, from, next) => {
				// 		if (to.fullPath === '/device') {
				// 			next({
				// 				path: '/device/overview',
				// 			});
				// 		} else {
				// 			next();
				// 		}
				// 	},
				// 	component: () => import('./views/device'),

				// 	children: [
				// 概览
				{
					path: 'overview',
					name: 'overview',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/overview'),
				},
				// 管理
				{
					path: 'control',
					name: 'control',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/control'),
					children: [
						// 接入
						{
							path: 'access',
							name: 'access',
							meta: {
								requireAuth: true,
							},
							component: () => import('./views/access'),
						},
					],
				},
				// 概览
				{
					path: 'details/:deviceId',
					name: 'details',
					meta: {
						requireAuth: true,
					},
					component: () => import('./views/details'),
				},
				// ],
				// },
			],
		},

		// 登录与注册,
		{
			path: '/sign',
			name: 'sign',
			component: () => import('./views/sign'),
		},

		// 个人信息完善
		{
			path: '/information',
			name: 'information',
			meta: {
				requireAuth: true,
			},
			beforeEnter: (to, from, next) => {
				from.fullPath === '/sign' || !store.state.user.groupId
					? next()
					: next('home');
			},
			component: () => import('./views/information'),
		},
	],
});
