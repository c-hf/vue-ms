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
                        <div class="left">
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
                        <div class="right">
                            <template v-if="item.perform">
                                <span>
                                    执行中...
                                </span>
                            </template>
                            <template v-else>
                                <span v-if="item.timeType === 0">
                                    <el-switch style="display: block"
                                               v-model="item.switch"
                                               active-color="#13ce66"
                                               inactive-color="#ff4949"
                                               active-text="开启"
                                               inactive-text="关闭"
                                               :disabled="item.modeTasks.length < 1"
                                               @change="switchChange(item)">
                                    </el-switch>
                                </span>
                                <span v-if="item.timeType === 1"
                                      class="">
                                    <i v-if="new Date() < new Date(item.time)">
                                        {{ new Date(item.time).toLocaleString('zh-CN', { hour12: false }) }}
                                        <el-switch style="display: block; margin-top: 20px;"
                                                   v-model="item.switch"
                                                   active-color="#13ce66"
                                                   inactive-color="#ff4949"
                                                   active-text="开启"
                                                   inactive-text="关闭"
                                                   :disabled="item.modeTasks.length < 1"
                                                   @change="switchChange(item)">
                                        </el-switch>
                                    </i>
                                    <i v-else>
                                        {{ new Date(item.time).toLocaleString('zh-CN', { hour12: false }) }}
                                        已过期...
                                    </i>
                                </span>
                                <span v-if="item.timeType === 2">
                                    <i>
                                        周 {{ item.date.toString() }}
                                        {{ new Date(item.time).getHours() }}:{{ new Date(item.time).getMinutes() }}
                                        <el-switch style="display: block; margin-top: 20px;"
                                                   v-model="item.switch"
                                                   active-color="#13ce66"
                                                   inactive-color="#ff4949"
                                                   active-text="开启"
                                                   inactive-text="关闭"
                                                   :disabled="item.modeTasks.length < 1"
                                                   @change="switchChange(item)">
                                        </el-switch>
                                    </i>
                                </span>
                            </template>
                        </div>
                    </div>
                    <div class="wrap"
                         :class="{'active': item.perform}">
                        执行期间禁止操作
                        <!-- <i class="el-icon-loading"></i> -->
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
import { getMode, deleteMode, updateModeSwitch } from '@/api/device';
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

		// 开关
		switchChange(data) {
			this.$emit('setLoading', true);
			updateModeSwitch({
				modeId: data.modeId,
				switch: data.switch,
			})
				.then(resData => {
					if (resData.ok) {
						return;
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

		socketOn() {
			try {
				this.socket = this.$store.state.socket;
				if (!this.socket.on) {
					return;
				}
				this.socket.on('updateMode', data => {
					// this.deviceLogs.unshift(data);
					// console.log(data);
					const index = this.data.findIndex(
						el => el.modeId === data.modeId
					);
					if (index !== -1) {
						Object.keys(data.data).forEach(el => {
							this.data[index][el] = data.data[el];
						});
						// type: 'perform',
						// 	modeId: data.modeId,
						// 	data: {
						// 		perform: true,
						// 	},
					}
					if (data.message) {
						this.$notify({
							title: data.title,
							message: data.message,
						});
					}
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
	},

	components: {
		ModeTaskItem,
	},

	created() {
		this.getModeFn();
	},

	mounted() {
		this.socketOn();
	},

	destroyed() {
		if (this.socket.on) {
			this.socket.off('updateMode');
		}
	},
};
</script>

<style lang="scss" scoped>
.contextualModel-content {
	.item {
		margin-bottom: 20px;
		padding: 20px;
		position: relative;
		@include info-card();

		&-title {
			@include flex-between();
			padding-bottom: 10px;
			border-bottom: 1px solid #ebeef5;
		}

		&-content {
			padding: 40px 0;
			@include flex-between();

			.left {
				width: 80%;
				@include flex-start();
			}

			.right {
				width: 20%;
			}

			.device {
				width: 80px;
				height: 80px;
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
		.wrap {
			width: 100%;
			height: 100%;
			background-color: #fff;
			opacity: 0.6;
			font-weight: bold;
			user-select: none;
			position: absolute;
			top: 0;
			left: 0;
			cursor: pointer;

			@include flex-center(column);
			display: none;

			i {
				margin-top: 20px;
				opacity: 1;
				font-size: 18px;
			}
		}

		.wrap.active {
			display: flex;
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
