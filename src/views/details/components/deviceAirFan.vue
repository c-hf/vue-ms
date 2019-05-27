<template>
    <div class="air-fan"
         ref="details">
        <div class="left">
            <div class="left-top">
                <details-info :device="device" />
                <div class="air-fan-icon">
                    <div class="icon-container">
                        <svg-icon iconClass="icon-fengshan_1"
                                  :style="airFanActive" />
                    </div>
                </div>
            </div>
            <div class="left-bottom">
                <details-log ref="log"
                             :deviceId="deviceId"
                             @moreDeviceLogs="moreDeviceLogs" />
            </div>
        </div>
        <div class="right">
            <el-card class="air-fan-control-content">
                <div class="air-fan-control-content-top">
                    <span class="item"
                          :class="{active: device.onLine}">
                        连接 -
                    </span>
                    <span class="item"
                          :class="{active: status.switch && device.onLine}">
                        运行 -
                    </span>
                    <span class="item warn">
                        告警 -
                    </span>
                </div>
                <div class="air-fan-control-content-middle">
                    <div class="luminance">
                        <span class="luminance-setting">
                            速度设定
                            <el-slider v-model="speed"
                                       vertical
                                       height="100px"
                                       :step="1"
                                       :max="3"
                                       :min="1"
                                       :disabled="!status.switch || !device.onLine"
                                       @change="setSpeed">
                            </el-slider>
                        </span>
                        <span class="luminance-current">
                            <svg-icon iconClass="icon-fengshan1" />
                            <i>
                                {{ status.speed }}档
                            </i>
                        </span>
                    </div>
                </div>
                <div class="air-fan-control-content-bottom">
                    <span>
                        <i>
                            开启/关闭
                        </i>
                        <el-button class=" button"
                                   :loading="switchLoading"
                                   @click="setSwitch"
                                   :disabled="!device.onLine"
                                   :type="type"
                                   circle
                                   plain>
                            <svg-icon v-if="!switchLoading"
                                      iconClass="icon-guanbi" />
                        </el-button>
                    </span>
                </div>
            </el-card>
            <el-card class="air-fan-control-footer"
                     v-loading="timedTaskloading">
                <div slot="header"
                     class="header">
                    定时任务
                    <el-button type="primary"
                               icon="el-icon-plus"
                               size="small"
                               :disabled="!device.onLine"
                               circle
                               plain
                               @click="setTimedTask">
                    </el-button>
                </div>
                <div class="content">
                    <app-task-card ref="appTaskCard"
                                   :deviceId="deviceId"
                                   :onLine="device.onLine"
                                   :height="260"
                                   @elitTask="elitTask"
                                   @setLoading="setLoading" />
                </div>
            </el-card>
        </div>
        <app-drawer :show.sync="drawerVisible">
            <app-drawer-log v-if="drawerVisible && drawerType === 'log'"
                            :deviceId="deviceId"
                            @deleteLogs="deleteLogs" />

            <app-drawer-task v-else-if="drawerVisible && drawerType === 'task'"
                             :categoryItemId="device.categoryItemId"
                             :deviceId="deviceId"
                             :status="status"
                             :taskType="taskType"
                             :timedTaskId="timedTaskId"
                             @setVisible="setVisible">
            </app-drawer-task>
        </app-drawer>
    </div>
</template>

<script>
import AppDrawer from '@/components/appDrawer';
import AppDrawerLog from '@/components/appDrawerLog';
import AppDrawerTask from '@/components/appDrawerTask';
import AppTaskCard from '@/components/appTaskCard';
import DetailsInfo from './info';
import DetailsLog from './log';

import { setDesired } from '@/api/device';

export default {
	name: 'AirFan',
	data() {
		return {
			switchLoading: false,
			timedTaskloading: false,
			timedTask: false,
			drawerVisible: false,
			timer: null,
			timedTaskId: '',
			speed: 1,
			drawerType: 'log',
			taskType: 'new',
		};
	},

	computed: {
		// 显示类型
		type() {
			let type = 'primary';
			this.status.switch ? (type = 'primary') : (type = 'info');
			return type;
		},

		// 设备状态
		status() {
			let status = { switch: false, speed: 1 };
			if (this.device.deviceId) {
				status = this.$store.state.status[this.device.deviceId];
				this.setDataSpeed(status);
			}
			return status;
		},

		airFanActive() {
			if (this.status.switch && this.device.onLine) {
				const speeds = {
					1: '0.5s',
					2: '0.4s',
					3: '0.2s',
				};
				return {
					animation: `rotate ${speeds[this.speed]} linear infinite`,
				};
			} else {
				return '';
			}
		},
	},

	methods: {
		// 设置设备开关
		setSwitch() {
			if (!this.device.onLine) {
				return;
			}
			this.switchLoading = true;
			this.setTimeOut();
			this.setDesiredFn({
				deviceId: this.device.deviceId,
				desired: { switch: !this.status.switch },
			});
		},

		// 设置设备亮度
		setSpeed() {
			if (!this.device.onLine) {
				return;
			}
			this.setDesiredFn({
				deviceId: this.device.deviceId,
				desired: { speed: this.speed },
			});
		},

		// 设置双向绑定亮度值
		setDataSpeed(status) {
			this.speed = status.speed;
		},

		// 防抖动
		setTimeOut() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
			this.timer = setTimeout(() => {
				if (this.switchLoading) {
					this.$message({
						showClose: true,
						center: true,
						message: '操作超时！请重试',
						type: 'error',
					});
					this.switchLoading = false;
				}
			}, 2000);
		},

		// 隐藏抽屉
		setVisible(value) {
			this.drawerVisible = value;
			this.$refs.appTaskCard.getDeviceTimedTaskFn();
		},

		// 查看更多日志
		moreDeviceLogs() {
			this.drawerVisible = true;
			this.drawerType = 'log';
		},

		// 显示定时任务
		setTimedTask() {
			this.drawerType = 'task';
			this.taskType = 'new';
			this.drawerVisible = true;
		},

		// 编辑定时任务
		elitTask(timedTaskId) {
			this.taskType = 'edit';
			this.drawerType = 'task';
			this.timedTaskId = timedTaskId;
			this.drawerVisible = true;
		},

		// 设置定时任务 Loading
		setLoading(value) {
			this.timedTaskloading = value;
		},

		// 侧边栏删除日志
		deleteLogs() {
			this.$refs.log.getDeviceLogByIdFn(this.deviceId);
		},

		// 操作设备封装
		setDesiredFn(data) {
			setDesired(data).catch(error => {
				this.$message({
					showClose: true,
					center: true,
					message: error.message,
					type: 'error',
				});
			});
		},
	},

	props: {
		deviceId: {
			type: String,
			default: '',
		},

		device: {
			type: Object,
			default: () => {
				return {
					categoryId: '',
					categoryItemId: '',
					categoryItemName: '',
					createTime: '',
					desc: '',
					deviceId: '',
					groupId: '',
					name: '',
					networking: '',
					onLine: false,
					os: '',
					protocol: '',
					roomId: '',
					updateTime: '',
				};
			},
		},
	},

	watch: {
		status() {
			if (this.switchLoading) {
				this.switchLoading = false;
				this.timer ? clearTimeout(this.timer) : (this.timer = null);
			}
		},
	},

	components: {
		AppDrawer,
		AppDrawerLog,
		AppDrawerTask,
		AppTaskCard,
		DetailsInfo,
		DetailsLog,
	},
};
</script>

<style lang="scss" scoped>
.air-fan {
	flex: 1;
	@include flex-between();
	align-items: flex-start;

	.left {
		width: 70%;
		height: 100%;
		padding: 0 20px;
		box-sizing: border-box;

		&-top {
			height: 50%;
			@include flex-between();
		}
	}

	.right {
		width: 30%;
		padding: 0 20px;
		box-sizing: border-box;
	}

	&-icon {
		width: 70%;
		@include flex-center(column);
		.icon-container {
			width: 180px;
			height: 180px;
			border-radius: 50%;
			font-size: 168px;

			@include flex-center();
		}
	}

	&-control {
		&-content {
			height: 100%;
			width: 100%;
		}

		&-content-top {
			height: 80px;
			@include flex-around();

			.item {
				flex: 1;
				min-width: 70px;
				color: #606266;
				position: relative;
				@include ellipsis();

				&::after {
					content: ' ';
					display: block;
					height: 16px;
					width: 16px;
					border-radius: 50%;
					position: absolute;
					top: 50%;
					left: 50px;
					margin-top: -8px;
					background-image: linear-gradient(
						135deg,
						#f5f7fa 0%,
						#c3cfe2 100%
					);
				}
			}

			.warn {
				&::after {
					background-image: linear-gradient(
						135deg,
						#f5f7fa 0%,
						#c3cfe2 100%
					);
				}
			}

			.active {
				&::after {
					background-image: linear-gradient(
						to right,
						#43e97b 0%,
						#38f9d7 100%
					);
				}
			}
		}

		&-content-middle {
			.el-input-number {
				width: 120px;
				margin-left: 10px;
			}

			.luminance {
				height: 160px;
				@include flex-center();

				&-setting {
					width: 60%;
					height: 100%;
					border-bottom: 1px solid #e4e7ed;
					@include flex-start();

					.el-slider {
						margin: 0 auto;
					}
				}

				&-current {
					width: 40%;
					font-size: 36px;
					@include flex-start();

					svg {
						font-size: 36px;
						color: #909399;
					}

					i {
						margin-left: 10px;
					}
				}
			}
		}

		&-content-bottom {
			height: 100px;
			margin-top: 10px;
			margin-bottom: 20px;
			@include flex-center();

			span {
				flex: 1;
				@include flex-center(column);
				i {
					color: #909399;
					font-size: 14px;
					margin: 10px 0;
				}
			}
		}

		&-footer {
			height: 100%;
			width: 100%;
			margin-top: 10px;

			.header {
				height: 23px;
				@include flex-between();
			}

			.content {
				height: 260px;
			}
		}
	}

	.button {
		margin-left: 20px;
		margin-right: 10px;
		box-shadow: 0 0px 8px 0 rgba($color: #000000, $alpha: 0.2),
			0 5px 12px 0 rgba($color: #000000, $alpha: 0.1);
	}

	.flex-between {
		@include flex-between();
	}

	.margin-top {
		margin-top: 40px;
	}

	.margin {
		margin-bottom: 20px;
	}

	@keyframes rotate {
		0% {
			transform: rotate(0);
		}
		100% {
			transform: rotate(360deg);
		}
	}
}
</style>
