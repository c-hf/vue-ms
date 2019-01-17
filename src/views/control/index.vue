<template>
    <div class="control">
        <el-card class="control-card"
                 shadow="never"
                 v-loading="loading">
            <el-row :gutter="24">
                <el-col :span="24">
                    <control-info />
                </el-col>
                <el-col :span="24">
                    <control-list @onEdit="onEdit"
                                  @onDelete="onDelete" />
                </el-col>
            </el-row>
        </el-card>
        <router-view />
    </div>
</template>

<script>
import { deleteDevice } from '@/api/device';
import ControlList from './controlList';
import ControlInfo from './controlInfo';

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
		ControlList,
		ControlInfo,
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.control {
	position: relative;

	&-card {
		width: 100%;
		min-height: 600px;
		background-color: inherit;

		&-menu {
			@include flex-between();
			margin-bottom: 20px;
		}
	}

	&-list {
		.clearfix {
			display: flex;
			justify-content: space-between;
			.header-item {
				width: 100%;
			}
		}
	}
	.el-input {
		width: 20%;
	}
}
</style>
