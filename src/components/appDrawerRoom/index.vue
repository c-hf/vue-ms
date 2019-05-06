<template>
    <div class="app-drawer-room"
         v-loading="loading">
        <div class="app-drawer-room-title">
            添加房间
        </div>
        <el-form class="app-drawer-room-form"
                 :model="roomData"
                 :rules="rules"
                 ref="addRoomForm"
                 label-width="60px"
                 label-position="left"
                 @submit.native.prevent>
            <el-form-item prop="name"
                          label="名称">
                <el-input class="app-drawer-room-input"
                          placeholder="请输入房间名称"
                          autocomplete="off"
                          v-model="roomData.name"
                          autofocus>
                </el-input>
            </el-form-item>
            <el-form-item prop="icon"
                          label="图标">
                <ul class="app-drawer-room-icons">
                    <li class="app-drawer-room-icons-item"
                        :class="{active: isActive === index}"
                        v-for="(item, index) in icons"
                        :key="index"
                        @click="setActive(index)">
                        <svg-icon :iconClass="item" />
                    </li>
                </ul>
            </el-form-item>
            <el-form-item class="app-drawer-room-btn">
                <el-button type="primary"
                           plain
                           @click="submit('addRoomForm')">
                    保存
                </el-button>
                <el-button plain
                           @click="goBack">
                    返回
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { addRoom, updateHouse } from '@/api/group';
import { ROOMICONS } from '@/config';

export default {
	name: 'AppDrawerRoom',
	data() {
		// 密码验证
		const validateName = (rule, value, callback) => {
			if (!value) {
				callback(new Error('请输入名称'));
			} else {
				if (value.length < 2 || value.length > 16) {
					callback(new Error('长度在 2 到 16 个字符'));
					return;
				}

				const index = this.$store.state.rooms.findIndex(el => {
					return el.name === value;
				});

				if (index === -1) {
					callback();
					return;
				}
				if (this.type === 'edit') {
					this.room.name === value
						? callback()
						: callback(new Error('房间名称已存在！'));
				} else {
					callback(new Error('房间名称已存在！'));
				}
			}
		};
		return {
			loading: false,
			roomData: {
				name: '',
				icon: '',
			},
			rules: {
				name: [
					{
						validator: validateName,
						required: true,
						trigger: 'blur',
					},
				],

				icon: [
					{
						required: true,
						trigger: 'blur',
					},
				],
			},
			icons: ROOMICONS,
			isActive: 0,
		};
	},

	methods: {
		setActive(index) {
			this.isActive = index;
			this.roomData.icon = this.icons[index];
		},

		// 保存
		submit(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return false;
				}
				if (this.type === 'new') {
					this.addRoomFn({
						groupId: this.$store.state.group.groupId,
						name: this.roomData.name,
						icon: this.roomData.icon,
					});
				} else {
					this.updateHouseFn({
						groupId: this.$store.state.group.groupId,
						roomId: this.roomData.roomId,
						name: this.roomData.name,
						icon: this.roomData.icon,
					});
				}
			});
		},

		// 重置
		goBack() {
			this.$emit('setShow', false);
		},

		// 添加房间封装
		addRoomFn(data) {
			this.loading = true;
			addRoom(data)
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							center: true,
							message: '创建成功',
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
					this.loading = false;
				});
		},

		// 更新房间封装
		updateHouseFn(data) {
			this.loading = true;
			updateHouse(data)
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							center: true,
							message: '保存成功',
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
					this.loading = false;
				});
		},
	},

	props: {
		room: {
			type: Object,
			defaule: () => {
				return {
					name: '',
					icon: '',
				};
			},
		},

		type: {
			type: String,
			defalue: 'new',
		},
	},

	created() {
		if (this.type === 'new') {
			this.setActive(0);
		} else {
			Object.assign(this.roomData, this.room);
			const index = this.icons.findIndex(el => {
				return el === this.roomData.icon;
			});
			this.setActive(index);
		}
	},
};
</script>

<style lang="scss" scoped>
.app-drawer-room {
	padding: 50px 0;
	padding-bottom: 0;
	box-sizing: border-box;
	position: relative;

	@include flex-center(column);

	&-title {
		margin-top: 20px;
		padding: 20px;
		color: #303133;
		font-size: 20px;
		border-bottom: 1px solid #ebeef5;
	}

	&-form {
		width: 80%;
		margin-top: 20px;
		padding: 20px;
		border-bottom: 1px solid #ebeef5;
	}

	&-icons {
		.active {
			border-color: #409eff;
		}

		&-item {
			display: inline-block;
			width: 25%;
			height: 80px;
			text-align: center;
			line-height: 80px;
			font-size: 30px;
			border: 1px solid #ebeef5;
			box-sizing: border-box;
			transform: all 5s;
		}
	}

	&-btn {
		padding-top: 40px;
	}
}
</style>
