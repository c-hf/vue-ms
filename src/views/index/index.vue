<template>
    <el-container class="app-container">
        <el-header class="app-header">
            <app-header :user="user"
                        :width="width"
                        :disabled="setDisabled"
                        @setCollapse="setCollapse"
                        @routerMessage="setShow"
                        @signOut="signOut" />
        </el-header>
        <el-container class="app-content">
            <el-aside class="app-aside"
                      :style="{width: `${width}px`}">
                <app-aside :isCollapse="isCollapse"
                           :user="user"
                           @signOut="signOut" />
            </el-aside>
            <el-main class="app-main">
                <div class="app-main-title">
                    <span class="app-main-title-text">
                        {{ breadcrumb.name }}
                    </span>
                    <el-breadcrumb separator-class="el-icon-arrow-right"
                                   class="app-main-title-breadcrumb">
                        <el-breadcrumb-item :to="{ path: '/home' }">
                            智家
                        </el-breadcrumb-item>
                        <el-breadcrumb-item :to="{ path: item.path }"
                                            v-for="(item, index) in breadcrumb.data"
                                            :key="index">
                            {{ item.name }}
                        </el-breadcrumb-item>
                        <el-breadcrumb-item>
                            {{ breadcrumb.name }}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <transition name="router">
                    <router-view class="app-main-content" />
                </transition>
            </el-main>
        </el-container>
        <app-drawer :show.sync="show"
                    :width="350">
            <AppDrawerMessage @setShow="setShow"
                              v-if="show" />
        </app-drawer>
    </el-container>
</template>
<script>
import AppHeader from '@/components/appHeader';
import AppAside from '@/components/appAside';
import AppDrawer from '@/components/appDrawer';
import AppDrawerMessage from '@/components/appDrawerMessage';

import io from 'socket.io-client';
import storage from '@/assets/js/storage';
import { signOut } from '@/api/user';
import { baseURL } from '@/config';

export default {
	name: 'Index',
	data() {
		return {
			show: false,
			isCollapse: false,
			setDisabled: false,
			width: 220,
			timer: null,
			socket: io(baseURL, {
				query: {
					token: this.$store.state.token,
				},
			}),
		};
	},

	computed: {
		// 获取 User
		user() {
			return this.$store.state.user;
		},

		// 面包屑
		breadcrumb() {
			const menuRouterList = {
				home: { path: '/home', name: '首页' },
				family: { path: '/family', name: `${this.user.nickName} 的家` },
				// device: { path: '/device/overview', name: '控制台' },
				overview: { path: '/device/overview', name: '概览' },
				control: { path: '/control', name: '设备管理' },
				details: { path: '/overview', name: '概览' },
				access: { path: '/control', name: '设备接入' },
				message: { path: '/message', name: '消息中心' },
				set: { path: '/set', name: '设置' },
			};

			const path = this.$route.path.split('/');
			let breadcrumb = {
				name: '',
				data: [],
			};
			path.forEach((el, index) => {
				if (index === path.length - 1) {
					menuRouterList[el]
						? (breadcrumb.name = menuRouterList[el].name)
						: (breadcrumb.name = this.$route.query.name);
				} else if (menuRouterList[el]) {
					breadcrumb.data.push({
						path: menuRouterList[el].path,
						name: menuRouterList[el].name,
					});
				}
			});
			return breadcrumb;
		},
	},
	methods: {
		// 侧边栏折叠
		setCollapse() {
			if (this.isCollapse) {
				this.isCollapse = false;
				this.width = 220;
				return;
			}
			this.isCollapse = true;
			this.width = 64;
		},

		// 登出
		signOut() {
			this.signOutFn();
		},

		// 打开消息列表
		setShow(value) {
			this.show = value;
		},

		// signOut 封装
		signOutFn() {
			signOut()
				.then(resData => {
					if (resData === 'ok') {
						this.$router.replace({
							name: 'sign',
						});
						this.socket.disconnect();
						storage.remove('token');
						this.$store.dispatch('token', '');
						this.$store.dispatch('user', {});
						this.$store.dispatch('group', {});
						this.$store.dispatch('homeData', {});
						this.$store.dispatch('rooms', []);
						this.$store.dispatch('device', []);
					}
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				});
		},

		// 宽度设置
		setWidth(width) {
			if (width < 1250) {
				this.setDisabled = true;
				this.isCollapse = true;
				this.width = 64;
			} else {
				this.setDisabled = false;
				this.isCollapse = false;
				this.width = 220;
			}
		},

		// resize 监听回调
		onResize() {
			if (this.timer) {
				clearInterval(this.timer);
			}
			this.timer = null;
			this.timer = setTimeout(() => {
				this.setWidth(document.body.clientWidth);
			}, 500);
		},
	},

	components: {
		AppHeader,
		AppAside,
		AppDrawer,
		AppDrawerMessage,
	},

	created() {
		// 连接
		this.socket.on('connect', () => {
			console.log('connect');
			this.$store.dispatch('socket', this.socket);
		});

		// 断开连接
		this.socket.on('disconnect', () => {
			console.log('disconnect');
		});

		// 重连
		this.socket.on('reconnect', attemptNumber => {
			console.log(attemptNumber);
		});

		// 连接错误
		this.socket.on('connect_error', error => {
			console.log(error);
		});

		// 监听主题
		this.socket.on('deviceList', data => {
			this.$store.dispatch('device', data);
		});
		this.socket.on('group', data => {
			this.$store.dispatch('group', data);
		});
		this.socket.on('rooms', data => {
			this.$store.dispatch('rooms', data);
		});
		this.socket.on('updateOnline', data => {
			this.$store.dispatch('updateOnline', data);
		});
		this.socket.on('addDevice', data => {
			this.$store.dispatch('addDevice', data);
		});
		this.socket.on('deleteDevice', data => {
			this.$store.dispatch('deleteDevice', data.deviceId);
		});
		this.socket.on('updateDevice', data => {
			console.log(data);
		});
		this.socket.on('updateDeviceStatus', data => {
			this.$store.dispatch('updateDeviceStatus', data);
		});
		this.socket.on('GroupMessage', data => {
			this.$store.dispatch('modifyGroup', data);
		});
		this.socket.on('message', data => {
			// this.$store.dispatch('modifyGroup', data);
			console.log(data);
		});
	},

	mounted() {
		this.setWidth(document.body.clientWidth);
		window.onresize = this.onResize;
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';
.app-main {
	&-title {
		height: 40px;
		margin: 0 20px;
		box-sizing: border-box;
		border-bottom: 1px solid #ebeef5;
		@include flex-between();

		&-text {
			font-weight: bold;
		}
	}

	&-content {
		height: calc(100% - 40px);
		padding: 20px;
		box-sizing: border-box;
		overflow-x: hidden;
		transition: all 0.5s;
	}
}

.router-leave-active,
.router-enter-active {
	// transition: all 0.5s;
	opacity: 0;
	transform: translateX(30px);
}

.router-enter {
	opacity: 0;
	transform: translateX(-30px);
}

.router-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
</style>
