<template>
    <el-tabs type="border-card">
        <el-tab-pane class="log-card">
            <span slot="label">
                <svg-icon iconClass="icon-document" />
                设备日志
            </span>
            <app-log-card ref="log-card"
                          :deviceLogs="deviceLogs"
                          :height="250"
                          @more="moreDeviceLogs" />
        </el-tab-pane>
        <el-tab-pane class="log-card">
            <span slot="label">
                <svg-icon iconClass="icon-warning" />
                设备告警
            </span>
            <app-log-card ref="warn-card"
                          :deviceLogs="deviceLogs"
                          logType="warn"
                          :height="250"
                          @more="moreDeviceLogs" />
        </el-tab-pane>
    </el-tabs>
</template>


<script>
import AppLogCard from '@/components/appLogCard';
import { getDeviceLogById } from '@/api/device';

export default {
	name: 'DetailsLog',
	data() {
		return {
			deviceLogs: [],
		};
	},

	methods: {
		// 查看更多日志
		moreDeviceLogs() {
			this.$emit('moreDeviceLogs');
		},

		// 获取日志封装
		getDeviceLogByIdFn(deviceId) {
			getDeviceLogById({
				deviceId: deviceId,
				dayNum: 0,
			})
				.then(resData => {
					this.deviceLogs = resData;
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

		// 监听日志更新
		socketOn(deviceId) {
			try {
				this.socket = this.$store.state.socket;
				if (!this.socket.on) {
					return;
				}
				this.socket.on(`${deviceId}-updateDeviceLog`, data => {
					this.deviceLogs.unshift(data);
				});
			} catch (error) {
				this.$message({
					showClose: true,
					center: true,
					message: error.message,
					type: 'error',
				});
			}
		},
	},

	components: {
		AppLogCard,
	},

	props: {
		deviceId: {
			type: String,
			default: '',
		},
	},

	created() {
		this.getDeviceLogByIdFn(this.deviceId);
	},

	mounted() {
		this.socketOn(this.deviceId);
	},

	destroyed() {
		if (this.socket.on) {
			this.socket.off(`${this.deviceId}-updateDeviceLog`);
		}
	},
};
</script>

<style lang="scss" scoped>
</style>
