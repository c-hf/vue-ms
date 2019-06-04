<template>
    <el-scrollbar class="drawer-To-do-list"
                  v-loading="loading"
                  style="height:100%">
        <div class="title">
            To-Do List
        </div>
        <div class="todo-icon">
            <span class="item"
                  v-for="(item, index) in Object.keys(icons)"
                  :key="index"
                  :class="{active: data.todoType === item }"
                  @click="data.todoType = item">
                <svg-icon :iconClass="icons[item].icon"
                          :style="{color: icons[item].color}" />
                <i>
                    {{ icons[item].label }}
                </i>
            </span>
        </div>
        <el-form class="content"
                 :model="data"
                 :rules="rules"
                 ref="Form"
                 label-width="100px"
                 label-position="top">
            <el-form-item prop="content">
                <span slot="label">
                    待办事项
                </span>
                <el-input type="textarea"
                          placeholder="请输入内容"
                          v-model="data.content"
                          :autosize="{ minRows: 6}"
                          maxlength="60"
                          show-word-limit
                          req>
                </el-input>
            </el-form-item>
            <el-form-item prop="time">
                <span slot="label">
                    时间
                </span>
                <el-time-picker v-model="data.time"
                                placeholder="选择时间"
                                format="hh:mm A">
                </el-time-picker>
            </el-form-item>
        </el-form>
        <div class="btn">
            <el-button type="primary"
                       plain
                       @click="onSubmit('Form')">
                确定
            </el-button>
            <el-button plain
                       @click="onReset('Form')">
                重置
            </el-button>
        </div>
    </el-scrollbar>
</template>


<script>
import { setTodoList, updateTodoList } from '@/api/user';
import { TODOICONS } from '../config.js';

export default {
	name: 'DrawerToDoList',
	data() {
		return {
			loading: false,
			icons: TODOICONS,
			data: this.todoData,
			iconType: '1',
			rules: {
				content: [
					{
						required: true,
						message: '请输入待办事项内容',
						trigger: 'blur',
					},
				],
				time: [
					{
						required: true,
						message: '请选择时间',
						trigger: 'change',
					},
				],
			},
		};
	},

	methods: {
		// 提交
		onSubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					if (this.data.todoId) {
						this.updateTodoListFn(this.data);
					} else {
						this.setTodoListFn(this.data);
					}
				}
			});
		},

		// 重置
		onReset(formName) {
			this.$refs[formName].resetFields();
		},

		// 添加 to-dolist
		setTodoListFn(data) {
			this.loading = true;
			setTodoList({
				todoType: parseInt(data.todoType),
				content: data.content,
				time: data.time,
			})
				.then(resData => {
					if (resData.ok) {
						this.$emit('getTodoList');
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

		// 更新 to-dolist
		updateTodoListFn(data) {
			this.loading = true;
			updateTodoList({
				todoType: parseInt(data.todoType),
				content: data.content,
				time: data.time,
			})
				.then(resData => {
					// console.log(resData);
					if (resData.ok) {
						this.$emit('getTodoList');
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
		todoData: {
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
.drawer-To-do-list {
	.title {
		margin: 20px;
		padding: 20px;
		text-align: center;
		color: #303133;
		font-size: 20px;
		border-bottom: 1px solid #ebeef5;
	}

	.todo-icon {
		width: 100%;
		height: 100px;
		margin: 40px 0;
		@include flex-center();

		.item {
			margin: 0 8px;
			font-size: 64px;
			opacity: 0.2;
			transition: all 0.5s;
			@include flex-center(column);

			i {
				font-size: 14px;
				color: #909399;
			}
		}
		.active {
			opacity: 1;
		}
	}

	.content {
		padding: 0 20px;

		span {
			font-size: 16px;
			font-weight: bold;
		}

		.el-date-editor {
			width: 100%;
		}
	}

	.btn {
		padding: 40px 0;
		margin: 0 20px;
		text-align: center;
	}
}
</style>
