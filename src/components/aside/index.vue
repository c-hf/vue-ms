<template>
    <div class="app-aside">
        <div class="user">
            <span class="user-avatar">
                <img :src="user.avatar"
                     :alt="user.nickName">
            </span>
            <span class="user-name"
                  v-show="!isCollapse">
                {{ user.nickName }}
            </span>
            <span class="user-item">

            </span>
        </div>
        <el-menu class="el-menu-vertical"
                 :default-active="active"
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 :router="true"
                 :unique-opened="true">

            <el-menu-item index="home"
                          :route="{name: 'home'}">
                <i class="fa fa-home fa-fw fa-lg"></i>
                <span slot="title">&nbsp;&nbsp;首页</span>
            </el-menu-item>
            <el-menu-item index="family"
                          :route="{name: 'family'}">
                <i class="fa fa-home fa-fw fa-lg"></i>
                <span slot="title">&nbsp;&nbsp;{{user.nickName}} 的家</span>
            </el-menu-item>
            <el-submenu index="device">
                <template slot="title">
                    <i class="fa fa-briefcase fa-fw fa-lg"></i>
                    <span slot="title">&nbsp;&nbsp;控制台</span>
                </template>
                <el-menu-item-group>
                    <el-menu-item index="device"
                                  :route="{name: 'device'}">
                        概览
                    </el-menu-item>
                    <el-menu-item index="control"
                                  :route="{name: 'control'}">
                        设备管理
                    </el-menu-item>
                </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="message"
                          :route="{name: 'message'}">
                <i class="fa fa-bell fa-fw fa-lg"></i>
                <span slot="title">&nbsp;&nbsp;消息中心</span>
            </el-menu-item>
            <el-menu-item index="set"
                          :route="{name: 'set'}">
                <i class="fa fa-cog fa-fw fa-lg"></i>
                <span slot="title">&nbsp;&nbsp;设置</span>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script>
export default {
	name: 'Aside',
	data() {
		return {};
	},
	computed: {
		active() {
			const path = this.$route.path.split('/');
			if (path[path.length - 1] === 'access') {
				return 'control';
			}
			return path[path.length - 1];
		},
	},
	props: {
		isCollapse: {
			type: Boolean,
			default: false,
		},
		user: {
			type: Object,
		},
	},
	methods: {},
};
</script>

<style lang="scss" scoped>
.app-aside {
	min-width: 64px;
	background-color: #fff;
	transition: all 0.5s;
	overflow-x: hidden;

	.user {
		width: auto;
		height: 160px;
		padding-top: 20px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-around;

		&-avatar {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			display: block;
			border: 2px solid rgb(210, 214, 222);

			img {
				height: 100%;
				width: 100%;
				border-radius: 50%;
			}
		}

		&-name {
			width: 50%;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			text-align: center;
		}
	}

	.el-menu {
		width: 100%;
		height: 100%;
		border-right: none;
		transition: all 0.5s;
	}

	.el-menu-vertical:not(.el-menu--collapse) {
		width: 220px;
	}
}
</style>
