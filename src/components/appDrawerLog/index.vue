<template>
    <el-scrollbar class="app-drawer-card"
                  style="height:100%;"
                  v-loading="loading">
        <div class="app-drawer-card-title">
            <span class="app-drawer-card-title-text">
                操作日志
            </span>
            <span class="app-drawer-card-title-btn">
                <el-radio v-model="radio"
                          label="2"
                          @change="getDeviceLogByIdFn">
                    最近三天
                </el-radio>
                <el-radio v-model="radio"
                          label="6"
                          @change="getDeviceLogByIdFn">
                    最近七天
                </el-radio>
                <el-radio v-model="radio"
                          label="29"
                          @change="getDeviceLogByIdFn">
                    最近三十天
                </el-radio>
            </span>
        </div>
        <el-timeline :style="{ margin: '20px'}">
            <el-timeline-item v-for="(item, index) in logs"
                              :key="index"
                              :timestamp="item.time"
                              placement="top"
                              :type="item.type">
                <div class="content">
                    <span class="message">
                        {{ item.message }}
                    </span>
                    <span>
                        ——— 操作来自 {{ item.source }}
                    </span>
                </div>
            </el-timeline-item>
        </el-timeline>
        <div class="app-drawer-card-error"
             v-if="!logs.length">
            <svg-icon class="error-icon"
                      iconClass="icon-meiyoushuju" />
            暂无日志
        </div>
        <div class="app-drawer-card-btn"
             v-if="logs.length">
            <el-button icon="el-icon-delete"
                       circle
                       plain
                       @click="deleteLogs">
            </el-button>
            <span class="app-drawer-card-btn-text">
                清空日志
            </span>
        </div>
    </el-scrollbar>
</template>

<script>
import { DEVICESOURCE } from '@/config/index.js';
import { getDeviceLogById, deleteDeviceLog } from '@/api/device';

export default {
	name: 'AppDrawerLog',
	data() {
		return {
			loading: false,
			source: DEVICESOURCE,
			deviceLogs: [],
			radio: '2',
		};
	},

	computed: {
		logs() {
			const logTypes = {
				warn: 'danger',
				info: 'primary',
			};
			let logs = [];
			this.deviceLogs.forEach(el => {
				if (this.logType === 'warn' && el.logType === 'info') {
					return;
				}
				let element = {};
				const createTime = new Date(el.createTime).toLocaleString(
					'zh-CN',
					{ hour12: false }
				);
				element.source = this.source[el.source];
				element.logType = el.logType;
				element.message = el.message;
				element.time = createTime;
				element.type = logTypes[el.logType];
				logs.push(element);
			});
			return logs;
		},
	},

	methods: {
		// 查看更多
		more() {
			this.$emit('more');
		},

		// 删除日志
		deleteLogs() {
			this.loading = true;
			deleteDeviceLog({ deviceId: this.deviceId })
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							center: true,
							message: '删除成功！',
							type: 'success',
						});

						this.getDeviceLogByIdFn();
						this.$emit('deleteLogs');
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

		// 获取日志
		getDeviceLogByIdFn() {
			if (!this.deviceId) {
				return;
			}
			this.loading = true;
			getDeviceLogById({
				deviceId: this.deviceId,
				dayNum: this.radio,
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
				})
				.then(() => {
					this.loading = false;
				});
		},
	},

	props: {
		deviceId: {
			type: String,
		},
	},

	created() {
		this.getDeviceLogByIdFn();
	},
};
</script>

<style lang="scss" scoped>
.app-drawer-card {
	&-title {
		margin: 20px;
		padding: 20px;
		padding-bottom: 40px;
		color: #303133;
		font-size: 20px;
		border-bottom: 1px solid #ebeef5;
		@include flex-start(column);

		&-text {
			color: #303133;
			font-size: 20px;
		}

		&-btn {
			padding-top: 20px;
		}
	}

	.content {
		border: 1px solid #f2f6fc;
		border-radius: 4px;
		padding: 20px;
		margin-right: 20px;

		span {
			display: block;
		}

		span:nth-of-type(2) {
			text-align: right;
			font-size: 12px;
			color: #c0c4cc;
			padding-right: 20px;
		}
	}

	&-error {
		margin-top: 60px;
		color: #c0c4cc;
		@include flex-center();

		.error-icon {
			font-size: 48px;
			margin: 10px;
		}
	}

	&-btn {
		padding: 20px 0;
		display: block;
		@include flex-center(column);

		&-text {
			font-size: 12px;
			color: #909399;
			margin-top: 10px;
		}
	}
}
</style>
