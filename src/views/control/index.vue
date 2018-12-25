<template>
    <div class="control">
        <!-- <el-row v-loading="loading"
                :gutter="24"> -->
        <el-col :span="24">

            <el-card class="control-menu"
                     :body-style="{	width:'100%',display: 'flex',justifyContent: 'space-between', alignItems: 'center' }">
                <el-input placeholder="请输入DeviceID..."
                          suffix-icon="el-icon-search"
                          v-model="searchInput">
                </el-input>
                <el-button size="small"
                           icon="el-icon-plus"
                           @click="routeAccess"
                           plain>添加设备</el-button>
            </el-card>
        </el-col>
        <el-card class="control-list">

            <device-list @onEdit="onEdit"
                         @onDelete="onDelete" />
        </el-card>
        <router-view></router-view>
        <!-- </el-row> -->
    </div>
</template>

<script>
import { deleteDevice } from '@/api/device';
import DeviceList from './List';

export default {
	name: 'DeviceControl', // 设备接入
	data() {
		return {
			groupId: this.$store.state.user.groupId,
			searchInput: '',
			loading: false,
		};
	},

	methods: {
		// 设备接入
		routeAccess() {
			this.$router.push({ name: 'access' });
		},

		// 获取设备信息
		getDeviceInfo() {
			if (!this.groupId) {
				return;
			}

			this.loading = true;
			this.tableData = this.$store.state.device;
			if (this.tableData.length) {
				this.loading = false;
				return;
			}
			let timer = setInterval(() => {
				if (this.tableData.length) {
					this.loading = false;
					clearInterval(timer);
				}
				this.tableData = this.$store.state.device;
			}, 300);
		},

		// 编辑
		onEdit(deviceId) {
			console.log(deviceId);
		},

		// 删除
		onDelete(deviceId) {
			this.loading = true;
			deleteDevice({ groupId: this.groupId, deviceId: deviceId })
				.then(resData => {
					console.log(resData);
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
		DeviceList,
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';
.control {
	width: 100%;
	height: 100%;
	background-color: #f3f6f8;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 9999;

	&-menu {
		@include flex-between();
		margin-bottom: 20px;
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
