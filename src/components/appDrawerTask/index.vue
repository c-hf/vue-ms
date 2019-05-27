<template>
    <el-scrollbar class="app-drawer-task"
                  style="height:100%">
        <div class="app-drawer-task-title">
            定时任务
        </div>
        <div class="app-drawer-task-name">
            <span class="app-drawer-task-name-title">
                任务名称
            </span>
            <el-input placeholder="任务名称"
                      v-model="name"
                      :maxlength="8"
                      :minlength="2"
                      clearable>
            </el-input>
        </div>
        <div class="app-drawer-task-time">
            <span class="app-drawer-task-time-title">
                时间设置
            </span>
            <span class="app-drawer-task-time-content">
                <i>小时</i>
                <el-input-number v-model="hour"
                                 :min="0"
                                 :max="24"
                                 controls-position="right"
                                 label="小时"
                                 @change="hourChange">
                </el-input-number>
                <i>分钟</i>
                <el-input-number v-model="minute"
                                 :min="0"
                                 :max="60"
                                 controls-position="right"
                                 label="分钟"
                                 @change="minuteChange">
                </el-input-number>
            </span>
        </div>
        <div class="app-drawer-task-content">
            <span class="app-drawer-task-task-title">
                <i>任务设置</i>
                <el-dropdown class="app-drawer-task-task-title-button"
                             trigger="click"
                             placement="bottom"
                             @command="commandEvent">
                    <el-button type="text">
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
            <el-scrollbar class="app-drawer-task-task"
                          style="height:80%">
                <span v-if="!dataTasks.length"
                      class="app-drawer-task-task-error">
                    <svg-icon class="error-icon"
                              iconClass="icon-File-Error" />
                    未设置任务
                </span>
                <span class="app-drawer-task-task-item"
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
                    <el-button class="app-drawer-task-task-item-delete"
                               icon="el-icon-close"
                               size="mini"
                               circle
                               @click="deleteTask(index)">
                    </el-button>
                </span>
            </el-scrollbar>
        </div>
        <div class="app-drawer-task-btn"
             v-if="taskType === 'new'">
            <el-button type="primary"
                       plain
                       @click="submit">
                确定
            </el-button>
            <el-button plain
                       @click="reset">
                重置
            </el-button>
        </div>
        <div class="app-drawer-task-btn"
             v-else>
            <el-button type="primary"
                       plain
                       @click="updateDeviceTimedTaskFn">
                保存
            </el-button>
            <el-button type="danger"
                       plain
                       @click="deleteDeviceTimedTaskFn">
                删除
            </el-button>
        </div>
    </el-scrollbar>
</template>

<script>
// import CeilingLamp from './ceilingLamp';
import {
	setDeviceTimedTask,
	deleteDeviceTimedTask,
	updateDeviceTimedTask,
	getDeviceTimedTaskById,
} from '@/api/device';
import { ATTRS } from '@/config';

export default {
	name: 'AppDrawerTask',
	data() {
		return {
			name: '定时任务',
			hour: 0,
			minute: 0,
			tasks: ATTRS,
			status: {},
			dataTasks: [],
			statusItems: [],
		};
	},

	methods: {
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

		// 提交
		submit() {
			if (!this.name.length) {
				this.$message({
					showClose: true,
					message: '请先设置任务名称',
					type: 'warning',
					center: true,
				});
				return;
			} else if (!this.hour && !this.minute) {
				this.$message({
					showClose: true,
					message: '请先选择时间',
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
			this.setDeviceTimedTaskFn();
		},

		// 重置
		reset() {
			this.hour = 0;
			this.minute = 0;
			this.dataTasks = [];
		},

		// 设置定时任务封装
		setDeviceTimedTaskFn() {
			let desired = {};
			this.dataTasks.forEach(el => {
				desired[el.id] = el.value;
			});
			setDeviceTimedTask({
				name: this.name,
				deviceId: this.deviceId,
				time: {
					hour: this.hour,
					minute: this.minute,
				},
				desired: desired,
			})
				.then(resData => {
					if (resData.deviceId) {
						this.setNotify(resData);
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

		// 获取定时任务封装
		getDeviceTimedTaskByIdFn() {
			getDeviceTimedTaskById(this.timedTaskId)
				.then(resData => {
					this.statusInit(resData.deviceId);
					this.dataTasksInit(resData.desired);
					this.hour = resData.time.hour;
					this.minute = resData.time.minute;
					this.name = resData.name;
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

		// 删除定时任务封装
		deleteDeviceTimedTaskFn() {
			deleteDeviceTimedTask({ timedTaskId: this.timedTaskId })
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							message: `${this.name}删除成功！`,
							type: 'success',
							center: true,
						});
						this.$emit('setVisible', false);
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

		// 重置定时任务
		updateDeviceTimedTaskFn() {
			let desired = {};
			this.dataTasks.forEach(el => {
				desired[el.id] = el.value;
			});
			updateDeviceTimedTask({
				timedTaskId: this.timedTaskId,
				deviceId: this.deviceId,
				name: this.name,
				time: {
					hour: this.hour,
					minute: this.minute,
				},
				desired: desired,
			})
				.then(resData => {
					this.setNotify({
						executeTime: resData.executeTime,
						name: this.name,
					});
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

		// 小时选择
		hourChange(value) {
			if (value >= 24) {
				this.minute = 0;
			}
		},

		// 分钟选择
		minuteChange(value) {
			if (value === 60) {
				this.hour = this.hour + 1;
				this.minute = 0;
			}
			if (this.hour >= 24) {
				this.minute = 0;
			}
		},

		// statusItems 初始化
		statusInit(deviceId) {
			this.statusItems = [];
			Object.keys(this.$store.state.status[deviceId]).forEach(el => {
				this.statusItems.push(this.tasks.get(el));
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

		// 设置提醒信息
		setNotify(data) {
			const executeTime = new Date(data.executeTime)
				.toLocaleString('zh-CN', { hour12: false })
				.split(' ');

			this.$notify({
				title: data.name,
				message: `任务将在 ${executeTime[0].split('/')[1]}月${
					executeTime[0].split('/')[2]
				}日 ${executeTime[1].split(':').join(':')} 执行`,
			});
			this.$emit('setVisible', false);
		},
	},

	props: {
		deviceId: {
			type: String,
			default: '',
		},

		taskType: {
			type: String,
			default: 'new',
		},

		timedTaskId: {
			type: String,
			default: '',
		},
	},

	// components: {
	// 	CeilingLamp,
	// },

	created() {
		if (this.taskType === 'edit') {
			this.getDeviceTimedTaskByIdFn();
		} else {
			this.statusInit(this.deviceId);
		}
	},
};
</script>

<style lang="scss">
.app-drawer-task {
	&-title {
		padding-top: 20px;
		text-align: center;
		line-height: 60px;
		font-size: 20px;
	}

	&-name {
		padding: 0 20px;
		&-title {
			display: block;
			padding: 20px 0;
			font-weight: bold;
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

	.el-slider {
		width: 180px;
	}

	.button {
		text-align: center;
		line-height: 100%;
	}
}
</style>
