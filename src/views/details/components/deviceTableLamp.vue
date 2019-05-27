<template>
    <div class="table-lamp"
         ref="details">
        <div class="left">
            <div class="left-top">
                <details-info :device="device" />
                <div class="table-lamp-lamp">
                    <app-lamp :luminance="status.luminance / 100"
                              :switch="status.switch && device.onLine"
                              :color="color" />
                </div>
            </div>
            <div class="left-bottom">
                <details-log ref="log"
                             :deviceId="deviceId"
                             @moreDeviceLogs="moreDeviceLogs" />
            </div>
        </div>
        <div class="right">
            <el-card class="table-lamp-control-content">
                <div class="table-lamp-control-content-top">
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
                <div class="table-lamp-control-content-middle">
                    <div class="luminance">
                        <span class="luminance-setting">
                            亮度设定
                            <el-slider v-model="luminance"
                                       vertical
                                       height="100px"
                                       :step="10"
                                       :min="10"
                                       :disabled="!status.switch || !device.onLine"
                                       @change="setLuminance">
                            </el-slider>
                        </span>
                        <span class="luminance-current">
                            <svg-icon iconClass="icon-light" />
                            <i>
                                {{ status.luminance }}&#37;
                            </i>
                        </span>
                    </div>
                    <div class="color">
                        <span class="color-title">
                            颜色设定
                        </span>
                        <ul class="color-set">
                            <li v-for="(item, index) in 4"
                                :key="index"
                                :class="{active: index === color}"
                                @click="setColor(index)">
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="table-lamp-control-content-bottom">
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
            <el-card class="table-lamp-control-footer"
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
import AppLamp from '@/components/appLamp';
import AppDrawerLog from '@/components/appDrawerLog';
import AppDrawerTask from '@/components/appDrawerTask';
import AppTaskCard from '@/components/appTaskCard';
import DetailsInfo from './info';
import DetailsLog from './log';

import { setDesired } from '@/api/device';

export default {
	name: 'TableLamp',
	data() {
		return {
			switchLoading: false,
			timedTaskloading: false,
			timedTask: false,
			drawerVisible: false,
			timer: null,
			deviceLogs: [],
			timedTaskId: '',
			luminance: 0,
			color: 0,
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
			let status = { switch: false, luminance: 0, color: 0 };
			if (this.device.deviceId) {
				status = this.$store.state.status[this.device.deviceId];
				this.setDataLuminance(status);
			}
			return status;
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
		setLuminance() {
			if (!this.device.onLine) {
				return;
			}
			this.setDesiredFn({
				deviceId: this.device.deviceId,
				desired: { luminance: this.luminance },
			});
		},

		// 设置颜色
		setColor(index) {
			if (!this.device.onLine) {
				return;
			}
			this.color = index;
			this.setDesiredFn({
				deviceId: this.device.deviceId,
				desired: { color: this.color },
			});
		},

		// 设置双向绑定亮度值
		setDataLuminance(status) {
			this.luminance = status.luminance;
			this.color = status.color;
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
		AppLamp,
		DetailsInfo,
		DetailsLog,
	},
};
</script>

<style lang="scss" scoped>
.table-lamp {
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

	&-lamp {
		width: 70%;
		@include flex-center(column);
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

			.color {
				height: 80px;
				@include flex-between();

				&-title {
					width: 40%;
				}

				&-set {
					width: 60%;
					@include flex-around();

					.active {
						border: 2px solid #e4e7ed;
						padding: 10px;
					}

					li {
						width: 25px;
						height: 25px;
						border-radius: 50%;
						padding: 5px;
						cursor: pointer;
					}
					li:nth-of-type(1) {
						background-image: radial-gradient(
							rgb(255, 254, 255) 10%,
							rgb(255, 253, 220) 100%
						);
					}

					li:nth-of-type(2) {
						background-image: radial-gradient(
							rgb(245, 108, 108) 10%,
							rgb(248, 179, 179) 100%
						);
					}
					li:nth-of-type(3) {
						background-image: radial-gradient(
							rgb(103, 194, 58) 10%,
							rgb(151, 200, 127) 100%
						);
					}
					li:nth-of-type(4) {
						background-image: radial-gradient(
							rgb(64, 158, 255) 10%,
							rgb(140, 197, 235) 100%
						);
					}
				}
			}
		}

		&-content-bottom {
			height: 60px;
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
				height: 220px;
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
}
</style>
