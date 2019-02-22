<template>
    <div class="view-lighting"
         ref="details">
        <el-row>
            <el-col :span="16"
                    class="view-lighting-left">
                <el-col :span="24"
                        class="view-lighting-left-top">
                    <el-tabs type="card"
                             v-model="activeName"
                             class="view-lighting-info">
                        <el-tab-pane label="设备信息"
                                     name="first">
                            <el-card class="view-lighting-info-content">
                                <span class="view-lighting-info-content-item">
                                    <i>设备名称</i>
                                    <i>
                                        {{ device.name }}
                                    </i>
                                </span>
                                <span class="view-lighting-info-content-item">
                                    <i>分类</i>
                                    <i>
                                        {{ device.categoryId }}
                                    </i>
                                </span>
                                <span class="view-lighting-info-content-item">
                                    <i>位置</i>
                                    <i>
                                        {{ roomName }}
                                    </i>
                                </span>
                                <span class="view-lighting-info-content-item">
                                    <i>创建时间</i>
                                    <i>
                                        {{ device.createTime.split(' ')[0] }}
                                    </i>
                                </span>
                            </el-card>
                        </el-tab-pane>
                        <el-tab-pane label="配置管理"
                                     name="second">
                            配置管理
                        </el-tab-pane>
                    </el-tabs>
                    <div class="view-lighting-lamp">
                        <app-lamp :luminance="status.luminance / 100"
                                  :switch="status.switch && device.onLine" />
                    </div>
                </el-col>
                <el-col :span="24"
                        class="view-lighting-left-bottom">
                    <el-tabs type="border-card"
                             class="view-lighting-left-bottom-log">
                        <el-tab-pane class="log-card">
                            <span slot="label">
                                <svg-icon iconClass="icon-document" />
                                操作日志
                            </span>
                            <app-log-card ref="log-card"
                                          :deviceId="this.device.deviceId"
                                          @more="more" />
                        </el-tab-pane>
                        <el-tab-pane class="log-card">
                            <span slot="label">
                                <svg-icon iconClass="icon-warning" />
                                设备告警
                            </span>
                            <app-log-card ref="warn-card"
                                          :deviceId="this.device.deviceId"
                                          logType="warn"
                                          @more="more" />
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-col>
            <el-col :span="8"
                    class="view-lighting-control">
                <el-card class="view-lighting-control-content">
                    <div class="view-lighting-control-content-top">
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
                    <div class="view-lighting-control-content-middle">
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
                    </div>
                    <div class="view-lighting-control-content-bottom">
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
                <el-card class="view-lighting-control-footer"
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
                        <app-task-card ref="taskCard"
                                       :deviceId="device.deviceId"
                                       :onLine="device.onLine"
                                       @routerToTask="routerToTask"
                                       @setLoading="setLoading" />
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <app-drawer :show.sync="show">
            <app-drawer-log v-if="show && !timedTask"
                            :deviceId="this.device.deviceId"
                            @deleteLogs="deleteLogs" />
            <app-drawer-task v-if="show && timedTask"
                             :categoryItemId="device.categoryItemId"
                             :deviceId="device.deviceId"
                             :status="status"
                             :taskType="taskType"
                             :timedTaskId="timedTaskId"
                             @setShow="setShow">
            </app-drawer-task>
        </app-drawer>
    </div>
</template>

<script>
import AppDrawer from '@/components/appDrawer';
import AppLamp from '@/components/appLamp';
import AppLogCard from '@/components/appLogCard';
import AppDrawerLog from '@/components/appDrawerLog';
import AppDrawerTask from '@/components/appDrawerTask';
import AppTaskCard from '@/components/appTaskCard';
import { ICONS } from './config.js';
import { setDesired, deleteDeviceLog } from '@/api/device';

export default {
	name: 'ViewLighting',
	data() {
		return {
			activeName: 'first',
			switchLoading: false,
			timedTaskloading: false,
			timer: null,
			show: false,
			timedTask: false,
			taskType: 'new',
			timedTaskId: '',
			luminance: 0,
			icons: ICONS,
			modeIcon: 'icon-zidong-',
			swingIcon: 'icon-zuoyoubaifeng',
			speedIcon: 'icon-xiaofeng',
		};
	},

	computed: {
		// 显示类型
		type() {
			let type = 'primary';
			this.status.switch ? (type = 'primary') : (type = 'info');
			return type;
		},

		// 房间名
		roomName() {
			const el = this.$store.state.rooms.find(
				el => el.roomId === this.device.roomId
			);
			if (el) {
				return el.name;
			}
			return '';
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
		setShow(value) {
			this.show = value;
			this.$refs.taskCard.getDeviceTimedTaskFn();
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

		// 显示定时任务
		setTimedTask() {
			this.taskType = 'new';
			this.show = true;
			this.timedTask = true;
		},

		// 查看更多
		more() {
			this.show = true;
		},

		// 删除日志
		deleteLogs() {
			this.$refs['log-card'].getDeviceLogByIdFn();
			this.$refs['warn-card'].getDeviceLogByIdFn();
		},

		// 删除日志封装
		deleteDeviceLogFn() {
			deleteDeviceLog({
				deviceId: this.device.deviceId,
			})
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							message: '删除成功！',
							type: 'success',
							center: true,
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
				});
		},

		// 编辑任务
		routerToTask(timedTaskId) {
			this.taskType = 'edit';
			this.timedTaskId = timedTaskId;
			this.show = true;
			this.timedTask = true;
		},

		// 设置 Loading
		setLoading(value) {
			this.timedTaskloading = value;
		},
	},

	props: {
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

		show(newVal) {
			if (!newVal) {
				this.timedTask = false;
			}
		},
	},

	components: {
		AppDrawer,
		AppDrawerLog,
		AppLogCard,
		AppDrawerTask,
		AppTaskCard,
		AppLamp,
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.view-lighting {
	&-left {
		&-top,
		&-bottom {
			display: flex;
		}

		&-bottom-log {
			width: 100%;
			margin-top: 10px;
			margin-right: 10px;
		}
	}

	&-info {
		width: 30%;
		height: 350px;

		&-content {
			&-item {
				width: 100%;
				height: 50px;
				line-height: 50px;
				color: #909399;

				@include flex-start();

				i:nth-of-type(1) {
					width: 80px;
					display: block;
				}
			}
		}
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
		}

		&-content-bottom {
			height: 100px;
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
				height: 140px;
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
