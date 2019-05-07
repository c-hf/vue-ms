<template>
    <div class="view-drawer-group"
         v-loading="loading">
        <div class="view-drawer-group-title">
            查找家庭组
        </div>
        <el-button type="text"
                   class="view-drawer-group-btn"
                   icon="el-icon-arrow-left"
                   @click="setDrawerType">
            用户
        </el-button>
        <el-form class="view-drawer-group-form"
                 :model="data"
                 :rules="rules"
                 ref="addGroupForm"
                 @submit.native.prevent
                 @keyup.enter.native="findGroup('addGroupForm')">
            <el-form-item prop="groupId">
                <el-input class="view-drawer-group-input"
                          placeholder="请输入 ID"
                          autocomplete="off"
                          v-model="data.groupId"
                          autofocus>
                    <el-button slot="append"
                               icon="el-icon-search"
                               @click="findGroup('addGroupForm')">
                    </el-button>
                </el-input>
            </el-form-item>
        </el-form>
        <transition name="el-zoom-in-bottom">
            <div class="view-drawer-group-result"
                 v-if="info">
                <span class="view-drawer-group-result-title">
                    查找结果
                </span>
                <div class="group"
                     v-if="group.groupId">
                    <span class="group-avatar">
                        <svg-icon iconClass="icon-house" />
                    </span>
                    <span class="group-info">
                        <i class="group-info-nickName">
                            {{ group.groupName }} ( {{ group.groupId }} )
                        </i>
                        <el-tag v-show="groupFlag"
                                type="success"
                                size="mini">
                            当前家庭组
                        </el-tag>
                    </span>
                    <el-tooltip effect="dark"
                                content="申请加入"
                                placement="top">
                        <el-button class="group-btn"
                                   circle
                                   size="small"
                                   :disabled="groupFlag"
                                   @click="applyMembershipMsgFn">
                            <svg-icon iconClass="icon-group_fill" />
                        </el-button>
                    </el-tooltip>
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
import { getGroupInfo, applyMembershipMsg } from '@/api/group';

export default {
	name: 'ViewDrawerGroup',
	data() {
		const validateId = (rule, value, callback) => {
			const groupIdRegExp = /^[0-9]{10}$/;
			if (!value) {
				callback(new Error('请输入ID'));
			} else {
				if (groupIdRegExp.test(this.data.groupId)) {
					callback();
				}
				callback(new Error('请输入正确的ID'));
			}
		};
		return {
			loading: false,
			data: {
				groupId: '',
			},
			group: {},
			info: '',
			rules: {
				groupId: [
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
		// 群组标志
		groupFlag() {
			if (!this.$store.state.group.groupId) {
				return false;
			}
			const groupId = this.$store.state.group.groupId;
			if (groupId === this.group.groupId) {
				return true;
			}
			return false;
		},
	},

	methods: {
		setDrawerType() {
			this.$emit('setDrawerType', 'user');
		},

		// 查找
		findGroup(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return false;
				}
				this.getGroupInfoFn();
			});
		},

		// 查找家庭组封装
		getGroupInfoFn() {
			this.loading = true;
			getGroupInfo(this.data.groupId)
				.then(resData => {
					this.group = resData;
					this.info = '成功！';
					if (!resData.ok) {
						this.info = '没有找到符合搜索条件的家庭组';
					}
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					this.info = '没有找到符合搜索条件的家庭组';
				})
				.then(() => {
					this.loading = false;
				});
		},

		// 申请加入家庭组
		applyMembershipMsgFn() {
			if (this.$store.state.group.groupId) {
				this.$message({
					showClose: true,
					center: true,
					message: '已加入家庭组，无法申请加入新家庭组',
					type: 'warning',
				});
				return;
			}
			this.loading = true;
			applyMembershipMsg({
				groupId: this.data.groupId,
				userId: this.$store.state.user.userId,
			})
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							center: true,
							message: '申请已发送！',
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
};
</script>

<style lang="scss" scoped>
.view-drawer-group {
	height: 90%;
	padding: 50px 0;
	box-sizing: border-box;
	border-bottom: 1px solid #ebeef5;
	position: relative;
	@include flex-start(column);

	&-btn {
		position: absolute;
		top: 10px;
		left: 10px;
	}

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

	.group {
		height: 80px;
		padding: 0px 40px;
		position: relative;
		cursor: pointer;

		@include flex-start();

		&-avatar {
			width: 50px;
			height: 50px;
			line-height: 50px;
			text-align: center;
			display: block;
			border-radius: 50%;
			border: 1px solid rgb(210, 214, 222);
			font-size: 36px;
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

