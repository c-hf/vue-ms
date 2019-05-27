<template>
    <el-scrollbar class="drawer-task"
                  style="height:100%">
        <div class="drawer-task-title">
            情景模式任务
        </div>
        <div class="drawer-task-time">
            <span class="drawer-task-time-title">
                时间设置
            </span>
            <span class="drawer-task-time-content">
                <i>分钟</i>
                <el-input-number v-model="time.minute"
                                 :min="0"
                                 :max="60"
                                 controls-position="right"
                                 label="分钟"
                                 @change="minuteChange">
                </el-input-number>
                <i>秒</i>
                <el-input-number v-model="time.second"
                                 :min="0"
                                 :max="60"
                                 controls-position="right"
                                 label="秒"
                                 @change="secondChange">
                </el-input-number>
            </span>
        </div>
        <div class="drawer-task-device">
            <span class="drawer-task-device-title">
                选择设备
                <el-button class="refresh"
                           type="text"
                           icon="el-icon-refresh"
                           circle
                           @click="selectDevice">
                </el-button>
            </span>
            <div class="device"
                 v-if="device.deviceId">
                <div class="device-icon">
                    <svg-icon :iconClass="deviceIcon" />
                </div>
                <div class="device-info">
                    <span>
                        <i>
                            DeviceID
                        </i>
                        {{ device.deviceId }}
                    </span>
                    <span>
                        <i>
                            名称
                        </i>
                        {{ device.name }}
                    </span>
                    <span>
                        <i>
                            所在位置
                        </i>
                        {{ device.roomName }}
                    </span>
                </div>
            </div>
            <div class="select-device"
                 v-else>
                未选择设备，是否选择
                <el-button type="text"
                           @click="selectDevice">
                    设备
                </el-button>
            </div>
        </div>
        <div class="drawer-task-content">
            <span class="drawer-task-task-title">
                <i>任务设置</i>
                <el-dropdown class="drawer-task-task-title-button"
                             trigger="click"
                             placement="bottom"
                             @command="commandEvent">
                    <el-button type="text"
                               :disabled="!statusItems.length">
                        添加任务
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item, index) in statusItems"
                                          :key="index"
                                          :command="item.id">
                            {{ item.name }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </span>
            <el-scrollbar class="drawer-task-task"
                          style="height:80%">
                <span v-if="!dataTasks.length"
                      class="drawer-task-task-error">
                    <svg-icon class="error-icon"
                              iconClass="icon-File-Error" />
                    未设置任务
                </span>
                <span class="drawer-task-task-item"
                      v-for="(item, index) in dataTasks"
                      :key="index">
                    <i class="name">
                        {{ item.name }}
                    </i>
                    <el-switch v-if="item.el === 'switch'"
                               v-model="item.value"
                               active-color="#13ce66"
                               inactive-color="#ff4949">
                    </el-switch>
                    <el-slider v-else-if="item.el === 'slider'"
                               v-model="item.value"
                               :step="item.step"
                               :min="item.min"
                               :max="item.max">
                    </el-slider>
                    <el-switch v-if="item.el === 'flame'"
                               v-model="item.value"
                               active-color="#13ce66"
                               inactive-color="#ff4949"
                               disabled>
                    </el-switch>
                    <el-radio-group v-if="item.el === 'color'"
                                    v-model="item.value">
                        <el-radio-button :label="0">
                            白色
                        </el-radio-button>
                        <el-radio-button :label="1">
                            红色
                        </el-radio-button>
                        <el-radio-button :label="2">
                            绿色
                        </el-radio-button>
                        <el-radio-button :label="3">
                            蓝色
                        </el-radio-button>
                    </el-radio-group>
                    <el-button class="drawer-task-task-item-delete"
                               icon="el-icon-close"
                               size="mini"
                               circle
                               @click="deleteTask(index)">
                    </el-button>
                </span>
            </el-scrollbar>
        </div>
        <div class="drawer-task-btn">
            <el-button type="primary"
                       plain
                       @click="onSubmit">
                确定
            </el-button>
            <el-button plain
                       @click="onReset">
                重置
            </el-button>
        </div>

        <el-dialog class="app-dialog-group"
                   :visible.sync="visible"
                   :append-to-body="true"
                   title="选择设备"
                   width="1000px">
            <device-list @getDevice="getDevice"
                         @onBack="onBack" />
        </el-dialog>
    </el-scrollbar>
</template>

<script>
import { setModeTask, updateModeTask } from '@/api/device';
import { DEVICEICON, ATTRS } from '@/config';
import DeviceList from './deviceList';

export default {
	name: 'AppDrawerTask',
	data() {
		return {
			modeId: '',
			time: {
				minute: 0,
				second: 0,
			},
			attrs: ATTRS,
			device: {},
			dataTasks: [],
			statusItems: [],
			visible: false,
		};
	},

	computed: {
		deviceIcon() {
			const icon = DEVICEICON;
			if (!this.device.categoryItemId) {
				return '';
			}
			return icon[this.device.categoryItemId];
		},
	},

	methods: {
		// 提交
		onSubmit() {
			if (!this.device.deviceId) {
				this.$message({
					showClose: true,
					message: '未选择设备',
					type: 'warning',
					center: true,
				});
				return;
			} else if (!this.dataTasks.length) {
				this.$message({
					showClose: true,
					message: '未设置任务',
					type: 'warning',
					center: true,
				});
				return;
			}
			let desired = {};
			this.dataTasks.forEach(el => {
				desired[el.id] = el.value;
			});
			let data = {
				modeId: this.modeId,
				deviceId: this.device.deviceId,
				desired: desired,
				time: {
					minute: this.time.minute,
					second: this.time.second,
				},
			};

			if (this.data.modeTask) {
				data.taskId = this.data.modeTask.taskId;
				this.updateModeTaskFn(data);
			} else {
				this.setModeTaskFn(data);
			}
		},

		// 重置
		onReset() {
			this.device = {};
			this.time.minute = 0;
			this.time.second = 0;
			this.statusItems = [];
			this.dataTasks = [];
		},

		// 设备列表返回
		onBack() {
			this.visible = false;
		},

		// 分钟选择
		minuteChange(value) {
			if (value >= 60) {
				this.time.second = 0;
			}
		},

		// 秒选择
		secondChange(value) {
			if (value === 60) {
				this.time.minute = this.time.minute + 1;
				this.time.second = 0;
			}
			if (this.time.minute >= 60) {
				this.time.second = 0;
			}
		},

		// 选择设备
		selectDevice() {
			this.visible = true;
		},

		// 获取设备数据
		getDevice(device) {
			this.device = device;
			this.visible = false;
			this.statusInit(this.device.deviceId);
		},

		// 添加任务
		commandEvent(value) {
			const item = this.statusItems.find(el => el.id === value);
			const index = this.dataTasks.findIndex(el => el.id === value);
			if (index === -1) {
				this.dataTasks.push(item);
			} else {
				this.$message({
					showClose: true,
					message: '已添加任务！',
					type: 'warning',
					center: true,
				});
			}
		},

		// 删除任务
		deleteTask(index) {
			this.dataTasks.splice(index, 1);
		},

		// statusItems 初始化
		statusInit(deviceId) {
			this.statusItems = [];
			Object.keys(this.$store.state.status[deviceId]).forEach(el => {
				this.statusItems.push(this.attrs.get(el));
			});
		},

		// dataTasks 初始化
		dataTasksInit(desired) {
			this.dataTasks = [];
			Object.keys(desired).forEach(key => {
				const item = this.statusItems.find(el => el.id === key);
				item.value = desired[key];
				this.dataTasks.push(item);
			});
		},

		// 添加任务封装
		setModeTaskFn(data) {
			this.loading = true;
			setModeTask(data)
				.then(resData => {
					if (resData.ok) {
						this.$emit('getMode');
						this.$message({
							showClose: true,
							message: '添加任务成功！',
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
				})
				.then(() => {
					this.loading = false;
				});
		},

		// 更新封装
		updateModeTaskFn(data) {
			this.loading = true;
			updateModeTask(data)
				.then(resData => {
					if (resData.ok) {
						this.$emit('getMode');
						this.$message({
							showClose: true,
							message: '更新任务成功！',
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
				})
				.then(() => {
					this.loading = false;
				});
		},
	},

	props: {
		data: {
			type: Object,
		},
	},

	components: {
		DeviceList,
	},

	created() {
		this.modeId = this.data.modeId;
		if (this.data.modeTask) {
			this.time = this.data.modeTask.time;
			const device = this.$store.state.device.find(
				element => element.deviceId === this.data.modeTask.deviceId
			);
			this.device = device;
			this.statusInit(this.device.deviceId);
			Object.keys(this.data.modeTask.desired).forEach((el, index) => {
				this.commandEvent(el);
				this.dataTasks[index].value = this.data.modeTask.desired[el];
			});
		}
	},
};
</script>

<style lang="scss">
.drawer-task {
	&-title {
		padding-top: 20px;
		text-align: center;
		line-height: 60px;
		font-size: 20px;
	}

	&-device {
		padding: 0 20px;

		&-title {
			font-weight: bold;
			@include flex-between();
		}

		.device {
			height: 80px;
			padding: 10px 0;
			border: 1px solid #ebeef5;
			border-radius: 4px;
			position: relative;

			@include flex-between();

			&-icon {
				width: 30%;
				height: 100%;
				font-size: 64px;
				@include flex-center();
			}

			&-info {
				width: 70%;
				height: 100%;
				font-size: 14px;
				@include flex-around(column);

				span {
					display: block;
					width: 100%;
					color: #303133;

					i {
						display: inline-block;
						width: 80px;
						color: #909399;
					}
				}
			}
			.refresh {
				position: absolute;
				right: 20px;
			}
		}

		.select-device {
			height: 80px;
			line-height: 80px;
			text-align: center;
			font-size: 14px;
			color: #909399;
		}
	}

	&-time {
		padding: 0 20px;

		&-title {
			display: block;
			padding: 20px 0;
			font-weight: bold;
		}

		&-content {
			text-align: center;
			display: block;
			padding: 10px 0;
			position: relative;
			@include flex-around();
			i {
				padding: 0 10px;
			}

			.time {
				position: absolute;
			}
		}
		.el-input-number {
			width: 140px;
		}
	}

	&-task {
		&-title {
			padding: 20px;
			font-weight: bold;
			@include flex-between();

			&-button {
				padding: 0 20px;
			}
		}
		&-error {
			height: 200px;
			color: #c0c4cc;
			@include flex-center();

			.error-icon {
				font-size: 48px;
				margin: 10px;
			}
		}

		&-item {
			height: 80px;
			border: 1px solid #e4e7ed;
			border-radius: 5px;
			margin: 20px 30px;
			position: relative;
			@include flex-start();

			&-delete {
				position: absolute;
				right: -14px;
				top: -14px;
			}

			.name {
				width: 120px;
				display: block;
				padding-left: 50px;
			}

			.el-slider {
				width: 180px;
			}

			.button {
				text-align: center;
				line-height: 100%;
			}
		}

		&-button {
			margin: 10px 20px;
			@include flex-center();
		}
	}

	&-content {
		height: 320px;
	}

	&-btn {
		padding-top: 30px;
		@include flex-center();
	}
}
</style>
