<template>
    <div class="mode-task-item">
        <div class="device">
            <svg-icon :iconClass="deviceIcon" />
            <div class="wrap">
                <el-button type="primary"
                           icon="el-icon-edit"
                           circle
                           size="mini"
                           @click="onEditModeTask">
                </el-button>
                <el-button type="danger"
                           icon="el-icon-delete"
                           circle
                           size="mini"
                           @click="onDeleteModeTask">
                </el-button>
            </div>
        </div>
        <div class="time">
            <i class="time-text">{{ modeTask.time.minute }} 分 {{ modeTask.time.second }} 秒</i>
            <i v-if="index !== 4"
               class="time-icon el-icon-d-arrow-right"></i>
        </div>
    </div>
</template>


<script>
import { deleteModeTask } from '@/api/device';
import { DEVICEICON } from '@/config';

export default {
	name: 'ModeTaskItem',
	data() {
		return {};
	},

	computed: {
		deviceIcon() {
			const icons = DEVICEICON;
			const device = this.$store.state.device.find(
				element => element.deviceId === this.modeTask.deviceId
			);
			if (device) {
				return icons[device.categoryItemId];
			} else {
				return '';
			}
		},
	},

	methods: {
		// 编辑
		onEditModeTask() {
			this.$emit('onEditModeTask', {
				modeId: this.modeId,
				modeTask: this.modeTask,
			});
		},

		// 删除
		onDeleteModeTask() {
			this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.deleteModeTaskFn();
				})
				.catch(() => {});
		},

		// 删除封装
		deleteModeTaskFn() {
			this.$emit('setLoading', true);
			deleteModeTask({
				modeId: this.modeId,
				taskId: this.modeTask.taskId,
			})
				.then(resData => {
					if (resData.ok) {
						this.$emit('getMode');
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
		modeTask: {
			type: Object,
		},

		index: {
			type: Number,
		},

		modeId: {
			type: String,
		},
	},
};
</script>

<style lang="scss" scoped>
.mode-task-item {
	@include flex-center();

	.device {
		width: 80px;
		height: 80px;
		border: 1px solid #ebeef5;
		margin: 0 20px;
		border-radius: 50%;
		font-size: 36px;
		position: relative;
		overflow: hidden;
		cursor: pointer;

		@include flex-center();

		.wrap {
			width: 100%;
			height: 100%;
			background-color: rgba($color: #000000, $alpha: 0.2);
			border-radius: 50%;
			transition: all 0.5s;
			position: absolute;
			top: 0;
			opacity: 0;

			@include flex-center();
		}

		&:hover {
			.wrap {
				opacity: 1;
			}
		}
	}

	.time {
		&-icon {
			font-size: 18px;
			margin-left: 10px;
		}

		&-text {
			font-size: 14px;
			color: #909399;
		}
	}
}
</style>
