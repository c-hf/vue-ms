<template>
    <div class="control"
         v-loading="loading">
        <el-card class="device-list">
            <div slot="header"
                 class="clearfix">
                <span>设备列表</span>
                <el-input placeholder="请输入DeviceID..."
                          suffix-icon="el-icon-search"
                          v-model="searchInput">
                </el-input>
                <el-button size="small"
                           icon="el-icon-plus"
                           @click="routeAccess"
                           plain>添加设备</el-button>
            </div>
        </el-card>
        <el-card class="device-list">

            <device-list @onEdit="onEdit"
                         @onDelete="onDelete" />
        </el-card>
    </div>
</template>

<script>
import { deleteDevice } from '@/api/device';
// getAllDeviceInfo
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
		// getGroupId() {
		// 	if (!this.groupId) {
		// 		return;
		// 	}
		// 	this.$notify({
		// 		title: '警告',
		// 		message: '你还未建立家庭组',
		// 		duration: 0,
		// 		type: 'warning',
		// 	});
		// },
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
					// this.getInfo();
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
	created() {
		// this.getGroupId();
		// this.getDeviceInfo();
	},
	mounted() {
		// this.getGroupId();
		// this.getDeviceInfo();
	},
};
</script>

<style lang="scss" scoped>
.control {
	width: 100%;
	height: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background-color: #f3f6f8;

	.device-list {
		margin-bottom: 20px;
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
