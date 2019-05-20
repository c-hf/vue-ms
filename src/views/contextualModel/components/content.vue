<template>
    <el-row class="contextualModel-content">
        <template v-if="data.length">
            <el-col v-for="(item, index) in data"
                    :key="index"
                    :span="24">
                <div class="item">
                    <div class="item-title">
                        {{ item.name }}
                        <el-button-group>
                            <el-button size="small"
                                       icon="el-icon-edit"
                                       @click="onEditMode(item)">
                            </el-button>
                            <el-button size="small"
                                       icon="el-icon-delete"
                                       @click="onDeleteMode(item)">
                            </el-button>
                        </el-button-group>
                    </div>
                    <div class="item-content">
                        <mode-task-item v-for="(task, key) in item.modeTasks"
                                        :key="key"
                                        :modeTask="task"
                                        :modeId="item.modeId"
                                        :index="key"
                                        @getMode="getModeFn"
                                        @onEditModeTask="onEditModeTask"
                                        @setLoading="setLoading" />
                        <span v-if="item.modeTasks.length < 5"
                              class="device add"
                              @click="addModeTask(item.modeId)">
                            <i class="el-icon-plus"></i>
                        </span>
                    </div>
                </div>
            </el-col>
        </template>
        <template v-else>
            <div class="error">
                <svg-icon class="error-icon"
                          iconClass="icon-meiyoushuju" />
                未设置情景模式
            </div>
        </template>
    </el-row>
</template>


<script>
import { getMode, deleteMode } from '@/api/device';
import ModeTaskItem from './item';

export default {
	name: 'ContextualModelContent',
	data() {
		return {
			data: [],
		};
	},

	methods: {
		// 编辑模式
		onEditMode(data) {
			let modeData = {
				modeId: data.modeId,
				name: data.name,
				timeType: data.timeType,
				date: '',
				time: '',
				week: [],
			};
			if (data.timeType === 1) {
				modeData.date = new Date(data.time);
			} else if (data.timeType === 2) {
				modeData.time = new Date(data.time);
				modeData.week = data.date;
			}
			this.$emit('editMode', modeData);
		},

		// 删除模式
		onDeleteMode(data) {
			this.$confirm('此操作将永久删除该任务, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.deleteModeFn({ modeId: data.modeId });
				})
				.catch(() => {});
		},

		// 设置loading
		setLoading(value) {
			this.$emit('setLoading', value);
		},

		// 添加模式任务
		addModeTask(modeId) {
			this.$emit('addModeTask', modeId);
		},

		// 编辑模式任务
		onEditModeTask(data) {
			this.$emit('onEditModeTask', data);
		},

		// 获取模式
		getModeFn() {
			this.$emit('setLoading', true);
			getMode()
				.then(resData => {
					this.data = resData;
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

		// 删除模式
		deleteModeFn(data) {
			this.$emit('setLoading', true);
			deleteMode(data)
				.then(resData => {
					if (resData.ok) {
						this.getModeFn();
						this.$message({
							showClose: true,
							center: true,
							message: '删除成功！',
							type: 'success',
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

	components: {
		ModeTaskItem,
	},

	created() {
		this.getModeFn();
	},
};
</script>

<style lang="scss" scoped>
.contextualModel-content {
	.item {
		margin-bottom: 20px;
		padding: 20px;
		@include info-card();

		&-title {
			@include flex-between();
			padding-bottom: 10px;
			border-bottom: 1px solid #ebeef5;
		}

		&-content {
			padding: 40px 0;
			@include flex-start();

			.device {
				width: 60px;
				height: 60px;
				margin: 0 20px;
				border: 1px solid #ebeef5;
				border-radius: 50%;
				font-size: 28px;
				cursor: pointer;

				@include flex-center();
			}

			.add {
				color: #c0c4cc;

				&:hover {
					color: #606266;
				}
			}
		}
	}

	.error {
		margin-top: 60px;
		color: #c0c4cc;
		@include flex-center();

		.error-icon {
			font-size: 48px;
			margin: 10px;
		}
	}
}
</style>
