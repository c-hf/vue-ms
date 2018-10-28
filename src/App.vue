<template>
    <div id="app">
        <el-container class="app-container">
            <el-header class="app-header">
                <app-header :user="user"
                            :title="title"
                            @setCollapse="setCollapse" />
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

export default {
	data() {
		return {
			title: '首页',
			isCollapse: false,
			width: 220,
			user: {
				name: 'Admin',
				avaUrl:
					'http://img.zcool.cn/community/0139855923a94db5b3086ed4ff769f.jpg@1280w_1l_2o_100sh.jpg',
			},
		};
	},
	components: {
		AppHeader,
		AppAside,
	},

	methods: {
		setTitle(title) {
			this.title = title;
		},
		setCollapse() {
			if (this.isCollapse) {
				this.isCollapse = false;
				this.width = 220;
				return;
			}
			this.isCollapse = true;
			this.width = 64;
		},
	},
};
</script>

<style lang="scss" scoped>
</style>
