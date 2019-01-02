<template>
    <div id="app">
        <el-container class="app-container"
                      ref="app">
            <el-header class="app-header">
                <app-header :user="user"
                            :width="width"
                            :disabled="setDisabled"
                            @setCollapse="setCollapse"
                            @signOut="signOut" />
            </el-header>
            <el-container class="app-content">
                <el-aside :style="{width: `${width}px`}">
                    <app-aside :isCollapse="isCollapse"
                               :user="user"
                               @signOut="signOut" />
                </el-aside>
                <el-main class="app-main">
                    <div class="app-main-title">
                        <span class="app-main-title-text">
                            {{breadcrumb[breadcrumb.length-1].name}}
                        </span>
                        <el-breadcrumb separator-class="el-icon-arrow-right"
                                       class="app-main-title-breadcrumb">
                            <el-breadcrumb-item :to="{ path: '/home' }">
                                智家
                            </el-breadcrumb-item>
                            <el-breadcrumb-item :to="{ path: item.path }"
                                                v-for="(item, index) in breadcrumb"
                                                :key="index">
                                {{item.name}}
                            </el-breadcrumb-item>
                        </el-breadcrumb>
                    </div>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import AppHeader from '@/components/header';
import AppAside from '@/components/aside';
import io from 'socket.io-client';
import storage from '@/assets/js/storage';
import { signOut } from '@/api/user';

export default {
	name: 'Index',
	data() {
		return {
			isCollapse: false,
			setDisabled: false,
			width: 220,
			timer: null,
			socket: io('http://localhost:3000', {
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
				device: { path: '/device/overview', name: '控制台' },
				overview: { path: '/device/overview', name: '概览' },
				access: { path: '/device/control', name: '设备接入' },
				control: { path: '/device/control', name: '设备管理' },
				message: { path: '/message', name: '消息中心' },
				set: { path: '/set', name: '设置' },
			};
			const path = this.$route.path.split('/');
			let breadcrumbArray = [];
			path.forEach(el => {
				if (menuRouterList[el]) {
					breadcrumbArray.push({
						path: menuRouterList[el].path,
						name: menuRouterList[el].name,
					});
				}
			});

			return breadcrumbArray;
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

		// signOut 封装
		signOutFn() {
			signOut()
				.then(resData => {
					if (resData === 'ok') {
						this.socket.disconnect();
						storage.remove('token');
						this.$store.dispatch('token', '');
						this.$store.dispatch('user', {});
						this.$store.dispatch('device', []);
						this.$router.replace({
							name: 'sign',
						});
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
	},

	created() {
		// 连接
		this.socket.on('connect', () => {
			console.log('connect');
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
		padding-bottom: 20px;
		@include flex-between();

		&-text {
			font-size: 18px;
			font-weight: bold;
		}
	}
}
</style>
