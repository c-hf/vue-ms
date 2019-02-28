<template>
    <div class="control"
         v-loading="loading">
        <el-row :gutter="24">
            <el-col :span="24">
                <view-control-info />
            </el-col>
            <el-col :span="24">
                <view-control-table @onEdit="onEdit"
                                    @onDelete="onDelete" />
            </el-col>
        </el-row>
        <app-drawer :show.sync="show">
            <app-drawer-device v-if="show"
                               :deviceId="deviceId"
                               @setShow="setShow" />
        </app-drawer>
    </div>
</template>

<script>
import AppDrawer from '@/components/appDrawer';
import AppDrawerDevice from '@/components/appDrawerDevice';
import ViewControlTable from './viewControlTable';
import ViewControlInfo from './viewControlInfo';
import { deleteDevice } from '@/api/device';

export default {
	name: 'DeviceControl', // 设备接入
	data() {
		return {
			loading: false,
			deviceId: '',
			show: false,
		};
	},

	methods: {
		// 设置 show
		setShow(value) {
			this.show = value;
		},

		// 编辑
		onEdit(deviceId) {
			this.show = true;
			this.deviceId = deviceId;
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
		AppDrawer,
		AppDrawerDevice,
		ViewControlTable,
		ViewControlInfo,
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
	opacity: 0;
}
</style>
