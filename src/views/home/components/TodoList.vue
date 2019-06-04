<template>
    <el-card class="view-todo-list"
             v-loading="loading">
        <div slot="header"
             class="view-todo-list-header">
            <span class="view-todo-list-title">
                <i class="el-icon-document-checked"></i>
                待办事项
            </span>
            <span>
                <el-checkbox v-model="incomplete"
                             @change="incompleteChange">
                    仅显示待办事项
                </el-checkbox>
                <el-button type="primary"
                           plain
                           circle
                           icon="el-icon-plus"
                           size="mini"
                           @click="addTodoList">
                    <!-- 添加 -->
                </el-button>
            </span>
        </div>
        <div class="view-todo-list-content"
             v-if="data.length">
            <el-scrollbar class="drawer-To-do-list"
                          style="height:100%">
                <div class="item"
                     v-for="(item, index) in list"
                     :key="index"
                     :class="{active: item.finish}">
                    <div class="top">
                        <span class="item-title">
                            <svg-icon v-if="item.finish"
                                      class="item-icon"
                                      iconClass="icon-success_info" />
                            <svg-icon v-else
                                      class="item-icon"
                                      :iconClass="icons[item.todoType].icon"
                                      :style="{color: icons[item.todoType].color}" />
                            {{ item.displayTime }}
                        </span>
                        <span class="item-diff">
                            <i v-if="item.finish">
                                完成
                            </i>
                            <i v-else-if="item.diffTime > 0">
                                {{ setDiffTime(item.diffTime) }}
                            </i>
                            <i v-else>
                                超时
                            </i>
                        </span>
                    </div>
                    <div class="bottom">
                        <span class="item-content">
                            {{ item.content }}
                        </span>
                    </div>
                    <div class="wrap">
                        <el-button type="success"
                                   icon="el-icon-check"
                                   circle
                                   :disabled="item.finish"
                                   @click="finishTodoListFn(item.todoId)">
                        </el-button>
                        <el-button type="primary"
                                   icon="el-icon-edit"
                                   circle
                                   @click="editTodoList(item)">
                        </el-button>
                        <el-button type="danger"
                                   icon="el-icon-delete"
                                   circle
                                   @click="deleteTodoList(item.todoId)">
                        </el-button>
                    </div>
                </div>
            </el-scrollbar>
        </div>
        <div class="view-todo-list-error"
             v-else>
            <svg-icon iconClass="icon-meiyoushuju1" />
            <span>
                暂无待办事项
            </span>
        </div>
    </el-card>
</template>

<script>
import { finishTodoList, getTodoList, deleteTodoList } from '@/api/user';
import { setInterval } from 'timers';
import { TODOICONS } from '../config.js';

export default {
	name: 'ViewTodoList',
	data() {
		return {
			loading: false,
			icons: TODOICONS,
			incomplete: false,
			data: [],
			list: [],
		};
	},

	methods: {
		incompleteChange(value) {
			if (value) {
				this.list = [];
				this.data.forEach(el => {
					if (el.finish) {
						return;
					}
					this.list.push({
						todoId: el.todoId,
						todoType: el.todoType,
						content: el.content,
						finish: el.finish,
						time: el.time,
						displayTime: this.$day(el.time).format(' hh:mm A'),
						diffTime: this.$day(el.time).diff(
							this.$day(),
							'minute'
						),
					});
				});
			} else {
				this.list = this.data.map(el => {
					return {
						todoId: el.todoId,
						todoType: el.todoType,
						content: el.content,
						finish: el.finish,
						time: el.time,
						displayTime: this.$day(el.time).format(' hh:mm A'),
						diffTime: this.$day(el.time).diff(
							this.$day(),
							'minute'
						),
					};
				});
			}
		},
		// 添加
		addTodoList() {
			this.$emit('addTodoList');
		},

		// 编辑
		editTodoList(data) {
			this.$emit('editTodoList', data);
		},

		// 删除
		deleteTodoList(id) {
			this.$confirm('此操作将永久删除该待办事项, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.deleteTodoListFn(id);
				})
				.catch(() => {});
		},

		// 获取 to-dolist
		getTodoListFn() {
			this.loading = true;
			getTodoList()
				.then(resData => {
					this.data = resData;
					this.incompleteChange(this.incomplete);
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

		// 删除 to-dolist
		deleteTodoListFn(id) {
			deleteTodoList({
				todoId: id,
			})
				.then(resData => {
					// console.log(resData);
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
				})
				.then(() => {
					this.loading = false;
					this.getTodoListFn();
				});
		},

		// 更新状态 to-dolist
		finishTodoListFn(todoId) {
			this.loading = true;
			finishTodoList({
				todoId: todoId,
			})
				.then(resData => {
					// console.log(resData);
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
					this.loading = false;
					this.getTodoListFn();
				});
		},

		setDiffTime(time) {
			if (time > 60) {
				if (time % 60 === 0) {
					return `${Math.floor(time / 60)} hour`;
				}
				return `${Math.floor(time / 60)} h  ${time % 60} min`;
			} else {
				return `${time} min`;
			}
		},
	},

	created() {
		this.getTodoListFn();
	},

	mounted() {
		setInterval(() => {
			this.list = this.list.map(el => {
				el.diffTime = this.$day(el.time).diff(this.$day(), 'minute');
				return el;
			});
		}, 30000);
	},
};
</script>

<style lang="scss" scoped>
.view-todo-list {
	margin-bottom: 20px;

	&-header {
		height: 23px;
		@include flex-between();
	}

	&-title {
		display: inline-block;
		height: 23px;
	}

	&-content {
		height: 542px;

		.item {
			margin: 0 30px;
			margin-bottom: 10px;
			padding: 10px;
			border-bottom: 1px solid #f2f6fc;
			position: relative;
			z-index: 9;
			cursor: pointer;

			@include flex-around(column);
			align-items: flex-start;

			.wrap {
				width: 100%;
				height: 100%;
				border-radius: 4px;
				background-color: rgba($color: #fff, $alpha: 0.4);
				position: absolute;
				left: 0;
				z-index: 99;

				@include flex-center();
				display: none;

				.el-button {
					margin: 0 10px;
				}
			}

			&:hover {
				.wrap {
					display: flex;
				}

				.top,
				.bottom {
					filter: blur(4px);
					opacity: 0.8;
				}
			}

			.top {
				width: 100%;
				height: 50px;
				@include flex-between();
			}

			.bottom {
				display: flex;
				align-items: center;
			}

			&-icon {
				font-size: 24px;
				margin-right: 10px;
			}

			&-title {
				font-size: 20px;
				color: #303133;
				font-weight: bold;
			}

			&-diff {
				font-size: 14px;
				color: #909399;
			}

			&-content {
				flex: 1;
				color: #909399;
				padding: 0 20px;
				font-size: 14px;
				line-height: 26px;
			}

			&-btn {
				display: block;
				width: 40px;
				height: 40px;
				padding: 10px;
				margin: 20px;
				box-sizing: border-box;
				border-radius: 50%;
				line-height: 20px;
				text-align: center;
				border: 1px solid #dcdfe6;
				font-size: 18px;
				cursor: pointer;
			}
		}

		.item.active {
			.item-title {
				color: #909399;
			}
			.item-content {
				text-decoration: line-through;
				color: #909399;
			}
		}
	}

	&-error {
		height: 542px;
		box-sizing: border-box;
		font-size: 48px;
		@include flex-center(column);
		span {
			font-size: 16px;
			color: #909399;
			margin: 20px;
		}
	}
}
</style>
