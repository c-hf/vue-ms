<template>
    <el-container class="app-container"
                  v-loading="loading">
        <el-header class="app-header">
            <app-header ref="appHeader"
                        :user="user"
                        :width="width"
                        :disabled="setDisabled"
                        @setCollapse="setCollapse"
                        @routerMessage="setMessageShow"
                        @signOut="signOut" />
        </el-header>
        <el-container class="app-content">
            <el-aside class="app-aside"
                      :style="{width: `${width}px`}">
                <app-aside :isCollapse="isCollapse"
                           :user="user"
                           @signOut="signOut" />
            </el-aside>
            <el-scrollbar style="height:100%; width:100%;">
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
                    <transition name="router"
                                mode="out-in">
                        <router-view class="app-main-content" />
                    </transition>
                </el-main>
                <el-footer class="app-footer">
                    Smart Home Admin &copy; 2019 chf
                </el-footer>
            </el-scrollbar>
        </el-container>
        <app-drawer :show.sync="messageShow"
                    :width="350">
            <AppDrawerMessage @setShow="setMessageShow"
                              v-if="messageShow" />
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
import { signOut, getUserToken } from '@/api/user';
import { BASEURL, SOCKETURL } from '@/config';

export default {
	name: 'Index',
	data() {
		return {
			loading: false,
			messageShow: false,
			isCollapse: false,
			setDisabled: false,
			width: 220,
			timer: null,
			socket: {},
			baseURL: BASEURL,
			socketURL: SOCKETURL,
		};
	},

	computed: {
		user() {
			return this.$store.state.user;
		},

		// 面包屑
		breadcrumb() {
			const menuRouterList = {
				home: { path: '/home', name: '首页' },
				family: { path: '/family', name: `${this.user.nickName} 的家` },
				overview: { path: '/device/overview', name: '概览' },
				control: { path: '/control', name: '设备管理' },
				details: { path: '/overview', name: '概览' },
				access: { path: '/control', name: '设备接入' },
				associate: { path: '/associate', name: '设备关联' },
				contextualModel: { path: '/contextualModel', name: '情景模式' },
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
				this.$refs.appHeader.setCollapseIcon('icon-menu-unfold');
				this.isCollapse = false;
				this.width = 220;
				return;
			}
			this.$refs.appHeader.setCollapseIcon('icon-menu-fold');
			this.isCollapse = true;
			this.width = 64;
		},

		// 登出
		signOut() {
			this.signOutFn();
		},

		// 打开消息列表
		setMessageShow(value) {
			this.messageShow = value;
		},

		// 登出封装
		signOutFn() {
			this.loading = true;
			signOut()
				.then(resData => {
					if (resData === 'ok') {
						this.$router.replace({
							name: 'sign',
						});
						this.socket.disconnect();
						storage.remove('token');
						this.$store.dispatch('token', '');
						this.$store.dispatch('group', {});
						this.$store.dispatch('weather', {});
						this.$store.dispatch('rooms', []);
						this.$store.dispatch('devices', []);
						this.$store.dispatch('socket', {});
					}
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				})
				.then(() => {
					this.loading = false;
				});
		},

		// 重新获取 token
		getUserTokenFn() {
			return getUserToken().catch(error => {
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
				this.$refs.appHeader.setCollapseIcon('icon-menu-fold');
			} else {
				this.setDisabled = false;
				this.isCollapse = false;
				this.width = 220;
				this.$refs.appHeader.setCollapseIcon('icon-menu-unfold');
			}
		},

		checkFull() {
			let isFull =
				window.fullScreen ||
				document.webkitIsFullScreen ||
				document.mozIsFullScreen ||
				document.msFullscreenEnabled;

			if (isFull === undefined) {
				isFull = false;
			}
			return isFull;
		},

		// resize 监听回调
		onResize() {
			if (!this.checkFull()) {
				this.$refs.appHeader.setFullScreenIcon(false);
			}
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
		const socket = io(this.socketURL, {
			query: {
				token: this.$store.state.token,
			},
		});
		this.socket = socket;
		// 连接
		// socket.on('connect', () => {
		// 	console.log('connect');
		// });

		// 断开连接
		// socket.on('disconnect', () => {
		// 	console.log('disconnect');
		// });

		// 重连
		// socket.on('reconnect', attemptNumber => {
		// 	console.log(attemptNumber);
		// });

		// 连接错误
		// socket.on('connect_error', error => {
		// 	console.log(error);
		// });

		// 监听主题
		socket.on('devices', data => {
			this.$store.dispatch('devices', data);
		});
		socket.on('group', data => {
			this.$store.dispatch('group', data);
		});
		socket.on('rooms', data => {
			this.$store.dispatch('rooms', data);
		});
		socket.on('updateRooms', data => {
			this.$store.dispatch('updateRooms', data);
		});
		socket.on('updateOnline', data => {
			this.$store.dispatch('updateOnline', data);
		});
		socket.on('updateDevices', data => {
			this.$store.dispatch('updateDevices', data);
		});
		socket.on('updateDeviceStatus', data => {
			this.$store.dispatch('updateDeviceStatus', data);
		});
		socket.on('GroupMessage', data => {
			// console.log(data);
			this.$store.dispatch('modifyGroup', data);
		});

		socket.on('joinGroup', data => {
			// console.log(data);
			storage.set('token', data.token);
			this.$store.dispatch('token', data.token);
			this.$store.dispatch('user', data.userInfo);
			socket.disconnect();
			socket.io.opts.query = {
				token: data.token,
			};

			socket.connect();
			this.$store.dispatch('socket', socket);
			this.$notify({
				title: '家庭组',
				message: '已加入新的家庭组，请刷新更新数据',
			});
		});

		socket.on('exitGroup', data => {
			// console.log(data);
			const user = this.$store.state.user;
			user.groupId = '';
			storage.set('token', data.token);
			this.$store.dispatch('token', data.token);
			this.$store.dispatch('user', user);
			socket.disconnect();
			socket.io.opts.query = {
				token: data.token,
			};
			socket.connect();
			this.$store.dispatch('socket', socket);
			this.$store.dispatch('group', {});
			this.$store.dispatch('weather', {});
			this.$store.dispatch('rooms', []);
			this.$store.dispatch('devices', []);
		});

		socket.on('message', data => {
			this.$store.dispatch('messageUnread', data.total);
			if (data.message) {
				this.$notify({
					title: '消息中心',
					message: data.message.title,
					duration: 0,
				});
			}
		});
		this.$store.dispatch('socket', socket);
	},

	mounted() {
		this.setWidth(document.body.clientWidth);
		window.onresize = this.onResize;
	},

	destroyed() {
		if (this.socket) {
			this.socket.close();
			this.$store.dispatch('socket', {});
			this.socket = null;
		}
	},
};
</script>

<style lang="scss" scoped>
.app-main {
	display: flex;
	flex-direction: column;

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
		flex: 1;
		min-height: calc(100vh - 160px);
		margin: 20px;
		box-sizing: border-box;
		overflow: hidden;
	}
}

.router-leave-active,
.router-enter-active {
	transition: all 0.4s;
}

.router-enter {
	opacity: 0;
	transform: translateX(30px);
}

.router-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
</style>
