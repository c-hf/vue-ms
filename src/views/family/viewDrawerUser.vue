<template>
    <div class="view-drawer-member"
         v-loading="loading">
        <div class="view-drawer-member-title">
            查找用户
        </div>
        <el-button type="text"
                   class="view-drawer-member-btn"
                   icon="el-icon-arrow-left"
                   @click="setDrawerType">
            家庭组
        </el-button>
        <el-form class="view-drawer-member-form"
                 :model="userData"
                 :rules="rules"
                 ref="addMemberForm"
                 @submit.native.prevent
                 @keyup.enter.native="findUser('addMemberForm')">
            <el-form-item prop="id">
                <el-input class="view-drawer-member-input"
                          placeholder="请输入 ID / 邮箱"
                          autocomplete="off"
                          v-model="userData.id"
                          autofocus>
                    <el-button slot="append"
                               icon="el-icon-search"
                               @click="findUser('addMemberForm')">
                    </el-button>
                </el-input>
            </el-form-item>
        </el-form>
        <transition name="el-zoom-in-bottom">
            <div class="view-drawer-member-result"
                 v-if="info">
                <span class="view-drawer-member-result-title">
                    查找结果
                </span>
                <div class="user"
                     v-if="member.id">
                    <span class="user-avatar">
                        <img :src="member.avatar"
                             :alt="member.nickName">
                    </span>
                    <span class="user-info">
                        <i class="user-info-nickName">
                            {{ member.nickName }} ( {{ member.userId }} )
                        </i>
                        <i class="user-info-userFlag">
                            <svg-icon v-if="member.sex === '男'"
                                      iconClass="icon-male_color" />
                            <svg-icon v-else
                                      iconClass="icon-female_color" />
                            <el-tag v-if="userFlag"
                                    type="success"
                                    size="mini">
                                {{ userFlagMsg }}
                            </el-tag>
                            <el-tag v-else
                                    type="info"
                                    size="mini">
                                {{ userFlagMsg }}
                            </el-tag>
                        </i>
                    </span>
                    <el-button class="user-btn"
                               circle
                               size="small"
                               :disabled="userFlag"
                               @click="addGroupMemberMsgFn">
                        <svg-icon iconClass="icon-addpeople_fill" />
                    </el-button>
                </div>
                <div class="error"
                     v-else>
                    {{ info }}
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import { getUserById } from '@/api/user';
import { addGroupMemberMsg } from '@/api/group';

export default {
	name: 'ViewDrawerUser',
	data() {
		const validateId = (rule, value, callback) => {
			const [userIdRegExp, emailRegExp] = [
				/^[0-9]{10}$/,
				/^[a-z0-9]+(?:[._-][a-z0-9]+)*@[a-z0-9]+(?:[._-][a-z0-9]+)*\.[a-z]{2,4}$/i,
			];
			if (!value) {
				callback(new Error('请输入ID/邮箱'));
			} else {
				if (userIdRegExp.test(this.userData.id)) {
					this.userData.type = 'userId';
					callback();
				} else if (emailRegExp.test(this.userData.id)) {
					this.userData.type = 'email';
					callback();
				}
				callback(new Error('请输入正确的ID/邮箱'));
			}
		};
		return {
			loading: false,
			userData: {
				type: '',
				id: 'chf960827@163.com',
			},
			info: '',
			member: {},
			rules: {
				id: [
					{
						validator: validateId,
						required: true,
						trigger: 'blur',
					},
				],
			},
		};
	},

	computed: {
		// 用户 ID
		userId() {
			return this.$store.state.user.userId;
		},

		// 用户标志
		userFlag() {
			if (!this.$store.state.group.groupId) {
				return false;
			}
			const members = this.$store.state.group.member;
			const index = members.findIndex(el => {
				return el.userId === this.member.userId;
			});
			if (index === -1) {
				return false;
			}
			return true;
		},

		userFlagMsg() {
			let message = '';
			this.userFlag ? (message = '已添加') : (message = '未添加');
			return message;
		},
	},

	methods: {
		setDrawerType() {
			this.$emit('setDrawerType', 'group');
		},

		// 查找
		findUser(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return false;
				}
				this.getUserByIdFn();
			});
		},

		// 查找用户封装
		getUserByIdFn() {
			this.member = {};
			this.loading = true;
			if (this.userData.type === 'email') {
				const emailRegExp = /(\w+)@(\w+\.\w+)/;
				const email = emailRegExp.exec(this.userData.id);
				this.userData.id = `${email[1]}@${email[2].toLowerCase()}`;
			}
			getUserById(this.userData)
				.then(resData => {
					if (resData.ok) {
						this.member = resData.data;
						this.info = '成功！';
						this.member.id = this.userData.id;
					} else {
						this.info = '没有找到符合搜索条件的用户';
					}
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					this.info = '没有找到符合搜索条件的用户';
				})
				.then(() => {
					this.loading = false;
				});
		},

		// 添加家庭成员
		addGroupMemberMsgFn() {
			if (!this.$store.state.group.groupId) {
				this.$message({
					showClose: true,
					center: true,
					message: '还未加入家庭组，无法添加新成员',
					type: 'warning',
				});
				return;
			}
			this.loading = true;
			addGroupMemberMsg({
				groupId: this.$store.state.group.groupId,
				userId: this.member.userId,
			})
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							center: true,
							message: '邀请已发送！',
							type: 'success',
						});
						// this.$emit('setShow', false);
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
};
</script>

<style lang="scss" scoped>
.view-drawer-member {
	height: 90%;
	padding: 50px 0;
	box-sizing: border-box;
	border-bottom: 1px solid #ebeef5;
	position: relative;

	@include flex-start(column);

	&-title {
		margin-top: 20px;
		padding: 20px;
		color: #303133;
		font-size: 20px;
		border-bottom: 1px solid #ebeef5;
	}

	&-btn {
		position: absolute;
		top: 10px;
		left: 10px;
	}

	&-form {
		width: 80%;
		margin-top: 20px;
		padding: 20px;
	}

	&-result {
		width: 100%;

		&-title {
			display: block;
			width: 80%;
			padding: 20px 40px;
			color: #909399;
		}
	}

	.error {
		height: 200px;
		padding: 0px 40px;
		line-height: 200px;
		text-align: center;
		color: #909399;
	}

	.user {
		height: 80px;
		padding: 0px 40px;
		position: relative;
		cursor: pointer;

		@include flex-start();

		&-avatar {
			width: 50px;
			height: 50px;
			border-radius: 50%;
			display: block;
			position: relative;
			z-index: 15;

			img {
				border-radius: 50%;
			}
		}

		&-info {
			width: 60%;
			text-align: left;
			margin-left: 5%;
			color: #303133;
			position: relative;
			z-index: 15;
			@include flex-around(column);
			align-items: flex-start;

			&-nickName {
				font-size: 16px;
			}

			&-userFlag {
				margin-top: 5px;
				color: #99a9bf;

				svg {
					margin-right: 10px;
				}
			}

			&-id {
				margin-left: 10px;
				color: #99a9bf;
			}
		}

		&-btn {
			font-size: 16px;
			position: absolute;
			right: 50px;
			z-index: 15;
		}
	}
}
</style>

