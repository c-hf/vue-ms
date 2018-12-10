<template>
    <div id="app">
        <el-container class="app-container">
            <el-header class="app-header">
                <app-header :user="user"
                            :title="title"
                            @setCollapse="setCollapse"
                            @signOut="signOut" />
            </el-header>
            <el-container class="app-content">
                <el-aside :style="{width: `${width}px`}">
                    <app-aside :isCollapse="isCollapse"
                               :user="user"
                               @setTitle="setTitle" />
                </el-aside>
                <el-main class="app-main">
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

export default {
	name: 'Index',
	data() {
		return {
			title: '首页',
			isCollapse: false,
			width: 220,
			socket: io('http://localhost:3000', {
				query: {
					token: this.$store.state.token,
				},
			}),
		};
	},
	computed: {
		user() {
			return this.$store.state.user;
		},
	},
	methods: {
		// 设置 Title
		setTitle(title) {
			this.title = title;
		},

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

		signOut() {
			this.socket.disconnect();
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
		this.socket.on('rooms', data => {
			this.$store.dispatch('rooms', data);
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
			console.log(data);
		});
	},
};
</script>

<style lang="scss" scoped>
</style>
