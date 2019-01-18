<template>
    <div class="app-drawer-task">
        <el-scrollbar style="height:100%">
            <div class="app-drawer-task-title">
                定时任务
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
                <el-scrollbar style="height:100%">
                    <ceiling-lamp v-if="categoryItemId === 'ceilingLamp'"
                                  ref="task" />
                    <ceiling-lamp v-else
                                  ref="task" />
                </el-scrollbar>
            </div>
            <div class="app-drawer-task-btn">
                <span class="app-drawer-task-btn-item">
                    <el-checkbox v-model="push">推送给所有家人</el-checkbox>
                </span>
                <span class="app-drawer-task-btn-item">
                    <el-button type="primary"
                               plain
                               @click="onSubmit">
                        确定
                    </el-button>
                    <el-button plain
                               @click="onReset">
                        重置
                    </el-button>
                </span>
            </div>
        </el-scrollbar>
    </div>
</template>

<script>
import CeilingLamp from './ceilingLamp';
import { setDeviceTimedTask } from '@/api/device';

export default {
	name: 'AppDrawerTask',
	data() {
		return {
			hour: 0,
			minute: 0,
			push: false,
		};
	},

	methods: {
		// 提交
		onSubmit() {
			if (!this.hour && !this.minute) {
				this.$message({
					showClose: true,
					message: '请先选择时间',
					type: 'warning',
					center: true,
				});
				return;
			}
			this.setDeviceTimedTaskFn({
				deviceId: this.deviceId,
				time: {
					hour: this.hour,
					minute: this.minute,
				},
				desired: this.$refs.task.data,
			});
		},

		// 重置
		onReset() {},

		// 设置定时任务封装
		setDeviceTimedTaskFn(data) {
			setDeviceTimedTask(data)
				.then(resData => {
					if (resData.ok) {
						this.$emit('setShow', false);
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
	},

	props: {
		categoryItemId: String,
		deviceId: String,
	},

	components: {
		CeilingLamp,
	},
};
</script>

<style lang="scss">
@import '~@/assets/scss/mixins';
.app-drawer-task {
	&-title {
		padding: 20px;
		text-align: center;
		line-height: 60px;
		font-size: 20px;
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
			@include flex-around();
			i {
				padding: 0 10px;
			}
		}
		.el-input-number {
			width: 140px;
		}
	}

	&-task {
		padding: 0 20px;

		&-title {
			display: block;
			padding: 20px 0;
			font-weight: bold;
		}

		&-item {
			height: 80px;
			border: 1px solid #e4e7ed;
			border-radius: 5px;
			margin: 10px 0;
			@include flex-start();
			i {
				width: 120px;
				display: block;
				padding-left: 50px;
			}

			.el-slider {
				width: 200px;
			}
		}
	}

	&-content {
		height: 320px;
	}

	&-btn {
		@include flex-center(column);

		&-item {
			padding: 20px;
		}
	}
}
</style>
