<template>
    <div class="view-alarm"
         ref="details">
        <div class="left">
            <div class="left-top">
                <details-info :device="device"></details-info>
                <div class="view-alarm-icon">
                    <app-alarm :switch="status.switch && device.onLine"></app-alarm>
                </div>
            </div>
            <div class="left-bottom">
                <details-log ref="log"
                             :deviceId="deviceId"
                             @moreDeviceLogs="moreDeviceLogs">
                </details-log>
            </div>
        </div>
        <div class="right">
            <el-card class="view-alarm-control-content">
                <div class="view-alarm-control-content-top">
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
                <div class="view-alarm-control-content-middle">
                    <span class="title">
                        报警器
                    </span>
                    <span class="icon">
                        <svg-icon iconClass="icon-shengguangbaojingqi" />
                    </span>
                </div>
                <div class="view-alarm-control-content-bottom">
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
            <el-card class="view-alarm-control-footer"
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
                                   :height="240"
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
import AppAlarm from '@/components/appAlarm';
import DetailsInfo from './info';
import DetailsLog from './log';

import { setDesired } from '@/api/device';

export default {
	name: 'ViewLighting',
	data() {
		return {
			switchLoading: false,
			timedTaskloading: false,
			timedTask: false,
			drawerVisible: false,
			timer: null,
			timedTaskId: '',
			luminance: 0,
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
			let status = { switch: false, luminance: 0 };
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

		// 设置双向绑定亮度值
		setDataLuminance(status) {
			this.luminance = status.luminance;
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
		AppAlarm,
		DetailsInfo,
		DetailsLog,
	},
};
</script>

<style lang="scss" scoped>
.view-alarm {
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
		height: 100%;
		// @include flex-center(column);
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
			height: 100px;
			margin-top: 40px;
			margin-bottom: 30px;
			box-sizing: border-box;
			@include flex-center();

			.title {
				display: block;
				width: 40%;
				color: #909399;
				margin: 0 20px;
			}

			.icon {
				display: block;
				width: 60%;
				font-size: 48px;
			}
		}

		&-content-bottom {
			height: 100px;
			margin-top: 40px;
			margin-bottom: 30px;
			border-top: 1px solid #e4e7ed;
			box-sizing: border-box;
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
				height: 240px;
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
