<template>
    <div class="control"
         v-loading="loading">
        <!-- <el-card class="control-card"
                 shadow="never"> -->
        <el-row :gutter="24">
            <el-col :span="24">
                <view-control-info />
            </el-col>
            <el-col :span="24">
                <view-control-list @onEdit="onEdit"
                                   @onDelete="onDelete" />
            </el-col>
        </el-row>
        <!-- </el-card> -->
        <transition name="fade">
            <router-view />
        </transition>
    </div>
</template>

<script>
import { deleteDevice } from '@/api/device';
import ViewControlList from './viewControlList';
import ViewControlInfo from './viewControlInfo';

export default {
	name: 'DeviceControl', // 设备接入
	data() {
		return {
			searchInput: '',
			loading: false,
		};
	},

	computed: {
		deviceNum() {
			return this.$store.state.device.length;
		},
	},

	methods: {
		// 编辑
		onEdit(deviceId) {
			console.log(deviceId);
		},

		// 删除
		onDelete(deviceId) {
			this.loading = true;
			deleteDevice({ deviceId: deviceId })
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							center: true,
							message: '删除成功！',
							type: 'success',
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
				})
				.then(() => {
					this.loading = false;
				});
		},
	},

	components: {
		ViewControlList,
		ViewControlInfo,
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.control {
	position: relative;

	// 	&-card {
	// 		width: 100%;
	// 		min-height: 600px;
	// 		background-color: inherit;

	// 		&-menu {
	// 			@include flex-between();
	// 			margin-bottom: 20px;
	// 		}
	// 	}

	// 	&-list {
	// 		.clearfix {
	// 			display: flex;
	// 			justify-content: space-between;
	// 			.header-item {
	// 				width: 100%;
	// 			}
	// 		}
	// 	}
	// 	.el-input {
	// 		width: 20%;
	// 	}
}
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
