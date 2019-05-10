<template>
    <ul class="app-task-card">
        <el-scrollbar style="height:100%">
            <span v-if="!tasks.length"
                  class="app-task-card-error"
                  :style="{height: `${height}px`}">
                <svg-icon class="error-icon"
                          iconClass="icon-File-Error" />
                未设置任务
            </span>
            <li class="app-task-card-item"
                :class="{'off-line':!onLine}"
                v-for="(item, index) in tasks"
                :key="index"
                v-else>
                <span class="app-task-card-time"
                      @click="elitTask(item.timedTaskId)">
                    <i class="time"
                       v-if="!item.perform">
                        定时
                        {{ item.time.hour }} 时 {{item.time.minute }} 分
                    </i>
                    <i class="time"
                       v-else>
                        {{ item.executeTime }}
                    </i>
                    <i class="name">
                        {{ item.name }},{{ item.date[0] }} 月 {{ item.date[1] }} 日
                    </i>
                </span>
                <span class="app-task-card-success"
                      v-if="item.finish">
                    <svg-icon iconClass="icon-chenggong" />
                </span>
                <el-switch v-else
                           v-model="item.perform"
                           active-color="#13ce66"
                           inactive-color="#ff4949"
                           :disabled="!onLine"
                           @change="setPerform(index)">
                </el-switch>
            </li>
        </el-scrollbar>
    </ul>
</template>

<script>
import {
	getDeviceTimedTask,
	canclDeviceTimedTask,
	startDeviceTimedTask,
} from '@/api/device';

export default {
	name: 'AppTaskCard',
	data() {
		return {
			taskSwitch: true,
			tasks: [],
			socket: {},
		};
	},

	computed: {
		taskItems() {
			let taskItems = [];
			this.tasks.forEach(el => {
				const executeTime = new Date(el.executeTime)
					.toLocaleString('zh-CN', { hour12: false })
					.split(' ');
				let [time, date] = [
					executeTime[1]
						.split(':')
						.slice(0, 2)
						.join(':'),
					executeTime[0].split('/').slice(1),
				];

				taskItems.push({
					timedTaskId: el.timedTaskId,
					executeTime: el.executeTime,
					name: el.name,
					date: date,
					time: time,
					perform: el.perform,
					finish: el.finish,
				});
			});
			return taskItems;
		},
	},

	methods: {
		// 转到编辑
		elitTask(timedTaskId) {
			if (!this.onLine) {
				return;
			}
			this.$emit('elitTask', timedTaskId);
		},

		// 开始/暂停任务
		setPerform(index) {
			const task = this.tasks[index];
			if (task.perform) {
				this.startDeviceTimedTaskFn(task.timedTaskId, index);
			} else {
				this.canclDeviceTimedTaskFn(task.timedTaskId);
			}
		},

		// 获取执行时间
		getExecuteTime(executeTime) {
			const date = new Date(executeTime)
				.toLocaleString('zh-CN', { hour12: false })
				.split(' ');
			return [date[1], date[0].split('/').slice(1)];
		},

		// 监听任务完成
		socketOn(deviceId) {
			try {
				this.socket = this.$store.state.socket;
				if (!this.socket.on) {
					return;
				}
				this.socket.on(`${deviceId}-updateDeviceTimedTask`, data => {
					const index = this.tasks.findIndex(el => {
						return el.timedTaskId === data.timedTaskId;
					});
					if (index === -1) {
						return;
					}
					let item = this.tasks[index];
					item.finish = data.finish;
					this.tasks.splice(index, 1, item);
					this.$notify({
						title: item.name,
						message: '任务执行完成！',
					});
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

		// 获取定时任务封装
		getDeviceTimedTaskFn() {
			if (!this.deviceId) {
				return;
			}
			this.$emit('setLoading', true);
			getDeviceTimedTask(this.deviceId)
				.then(resData => {
					this.tasks = [];
					resData.forEach(el => {
						const [time, date] = this.getExecuteTime(
							el.executeTime
						);
						this.tasks.push({
							timedTaskId: el.timedTaskId,
							name: el.name,
							date: date,
							time: el.time,
							executeTime: time
								.split(':')
								.slice(0, 2)
								.join(':'),
							sortIndex: el.executeTime,
							perform: el.perform,
							finish: el.finish,
						});
					});
					this.tasks.sort((a, b) => {
						return Number(a.sortIndex) - Number(b.sortIndex);
					});
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
					this.$emit('setLoading', false);
				});
		},

		// 开始定时封装
		startDeviceTimedTaskFn(timedTaskId, index) {
			this.$emit('setLoading', true);
			startDeviceTimedTask(timedTaskId)
				.then(resData => {
					if (resData) {
						const item = this.tasks[index];
						const [time, date] = this.getExecuteTime(
							resData.executeTime
						);
						item.sortIndex = resData.executeTime;
						item.executeTime = time
							.split(':')
							.slice(0, 2)
							.join(':');
						item.date = date;
						this.tasks.splice(index, 1, item);
						this.tasks.sort((a, b) => {
							return Number(a.sortIndex) - Number(b.sortIndex);
						});
						this.$notify({
							title: item.name,
							message: `任务将在 ${date[0]}月${
								date[1]
							}日 ${time} 执行`,
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
					this.$emit('setLoading', false);
				});
		},

		// 取消定时封装
		canclDeviceTimedTaskFn(timedTaskId) {
			this.$emit('setLoading', true);
			canclDeviceTimedTask(timedTaskId)
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							message: '任务已取消！',
							type: 'warning',
							center: true,
							duration: 1000,
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
					this.$emit('setLoading', false);
				});
		},
	},

	props: {
		deviceId: {
			type: String,
			default: '',
		},

		onLine: {
			type: Boolean,
			default: true,
		},

		height: {
			type: Number,
			default: 310,
		},
	},

	watch: {
		onLine(newVal) {
			if (!newVal) {
				this.getDeviceTimedTaskFn();
			}
		},
	},

	created() {
		this.getDeviceTimedTaskFn();
	},

	mounted() {
		this.socketOn(this.deviceId);
	},

	destroyed() {
		if (this.socket.on) {
			this.socket.off(`${this.deviceId}-updateDeviceTimedTask`);
		}
	},
};
</script>

<style lang="scss" scoped>
.app-task-card {
	height: 100%;

	&-item {
		height: 60px;
		padding: 0 10px;
		margin: 0 10px;
		@include flex-between();
		border-bottom: 1px solid #ebeef5;
	}

	&-time {
		height: 100%;
		font-size: 18px;
		box-sizing: border-box;
		cursor: pointer;
		position: relative;

		.time {
			display: block;
			height: 100%;
			line-height: 60px;
		}
		.name {
			width: 200px;
			position: absolute;
			left: 0px;
			bottom: 2px;
			font-size: 12px;
			color: #909399;

			@include ellipsis();
		}
	}

	&-success {
		font-size: 24px;
	}

	&-error {
		color: #c0c4cc;
		@include flex-center();

		.error-icon {
			font-size: 48px;
			margin: 10px;
		}
	}

	.off-line {
		color: #c0c4cc;

		.app-task-card-time {
			cursor: default;
		}
	}
}
</style>
