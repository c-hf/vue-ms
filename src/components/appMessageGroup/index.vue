<template>
    <div class="app-message-group">
        <div class="app-message-group-content"
             v-if="content_type_first[messageData.operation.groupType]">
            <p class="content-title">
                尊敬的用户，
            </p>
            <p class="flex-start"
               v-if="messageData.operation.groupType === 'Apply'">
                用户&nbsp;
                <span class="user"
                      @click="displayUser">
                    <i class="user-avatar">
                        <img :src="userInfo.avatar"
                             :alt="userInfo.nickName">
                    </i>
                    <i class="user-info">
                        {{ userInfo.nickName }} ({{ userInfo.userId }})
                    </i>
                </span>
                <span class="content">
                    &nbsp;{{ messageData.content }}
                </span>
                。
            </p>
            <p v-else
               class="flex-start">
                用户&nbsp;
                <span class="user"
                      @click="displayUser">
                    <i class="user-avatar">
                        <img :src="userInfo.avatar"
                             :alt="userInfo.nickName">
                    </i>
                    <i class="user-info">
                        {{ userInfo.nickName }} ({{ userInfo.userId }})
                    </i>
                </span>
                <span class="content">
                    &nbsp;{{ messageData.content }}
                </span>
                <span class="group">
                    {{ groupInfo.groupName }} ( {{ groupInfo.groupId }} )
                </span>
                。
            </p>
            <p class="content-result"
               v-if="type === 'drawer'">
                请在消息中心进行处理
            </p>
            <p class="content-result"
               v-else-if="messageData.operation.error">
                {{ messageData.operation.error }}
            </p>
            <p class="content-btn"
               v-else-if="messageData.operation.operation">
                <el-button type="primary"
                           @click="agree">
                    同意
                </el-button>
                <el-button type="danger"
                           @click="refuse">
                    拒绝
                </el-button>
            </p>
            <p v-else
               class="content-result">
                <span v-if="messageData.operation.agree">
                    已同意
                </span>
                <span v-else>
                    已拒绝
                </span>
            </p>
        </div>
        <div class="app-message-group-content"
             v-else-if="content_type_second[messageData.operation.groupType]">
            <p class="content-title">
                尊敬的用户，
            </p>
            <p class="flex-start"
               v-if="messageData.operation.groupType ===  'Delete_Own'">
                <span class="content">
                    你{{ messageData.content }}&nbsp;
                </span>
                <span class="group">
                    {{ groupInfo.groupName }} ( {{ groupInfo.groupId }} )
                </span>
                。
            </p>
            <p class="flex-start"
               v-else-if="messageData.operation.groupType ===  'Refuse_Apply'">
                加入家庭组 &nbsp;
                <span class="group">
                    {{ groupInfo.groupName }} ( {{ groupInfo.groupId }} )
                </span>
                <span class="content">
                    &nbsp;的{{ messageData.content }}
                </span>
                。
            </p>
            <p class="flex-start"
               v-else>
                <span v-if="messageData.operation.groupType !==  'Refuse_Invite'">
                    家庭成员&nbsp;
                </span>
                <span v-else>
                    用户&nbsp;
                </span>
                <span class="user"
                      @click="displayUser">
                    <i class="user-avatar">
                        <img :src="userInfo.avatar"
                             :alt="userInfo.nickName">
                    </i>
                    <i class="user-info">
                        {{ userInfo.nickName }} ({{ userInfo.userId }})
                    </i>
                </span>
                <span class="content">
                    &nbsp;{{ messageData.content }}
                </span>
                。
            </p>
        </div>
        <div class="app-message-group-content"
             v-else-if="content_type_third[messageData.operation.groupType]">
            <p class="content-title">
                尊敬的用户，
            </p>
            <p class="flex-start">
                {{ messageData.content }}
            </p>
        </div>
        <div class="app-message-group-footer">
            <span class="">

            </span>
            <span class="time">
                {{ new Date(messageData.createTime).toLocaleString('zh-CN', { hour12: false }).split(' ')[0] }}
            </span>
        </div>
        <el-dialog class="app-dialog-user"
                   :visible.sync="visible"
                   :modal-append-to-body="false"
                   width="360px">
            <app-dialog-user :user="userInfo" />
        </el-dialog>
    </div>
</template>

<script>
import {
	getGroupInfo,
	addGroupMemberHandle,
	applyMembershipHandle,
} from '@/api/group';
import { getUserById } from '@/api/user';
import AppDialogUser from '@/components/appDialogUser';

export default {
	name: 'AppMessageGroup',
	data() {
		return {
			groupInfo: {},
			userInfo: {},
			visible: false,
			content_type_first: {
				Add: true,
				Apply: true,
			},
			content_type_second: {
				Delete: true,
				Delete_Own: true,
				Exit: true,
				Refuse: true,
				Refuse_Invite: true,
				Refuse_Apply: true,
			},
			content_type_third: {
				Ungroup: true,
			},
			methods: {
				Add: this.addGroupMemberHandleFn,
				Apply: this.applyMembershipHandleFn,
			},
		};
	},

	methods: {
		agree() {
			this.methods[this.messageData.operation.groupType](true);
		},
		refuse() {
			this.methods[this.messageData.operation.groupType](false);
		},

		// 展示用户信息
		displayUser() {
			this.visible = true;
		},

		// 初始化数据
		initalData() {
			const methods = {
				Add: () => {
					this.getUserByIdFn(this.messageData.operation.sourceId);
					this.getGroupInfoFn(this.messageData.operation.groupId);
				},
				Delete: () => {
					this.getUserByIdFn(this.messageData.operation.userId);
				},
				Delete_Own: () => {
					this.getGroupInfoFn(this.messageData.operation.groupId);
				},
				Exit: () => {
					this.getUserByIdFn(this.messageData.operation.userId);
				},
				Apply: () => {
					this.getUserByIdFn(this.messageData.operation.userId);
				},
				Refuse_Invite: () => {
					this.getUserByIdFn(this.messageData.operation.userId);
				},
				Refuse_Apply: () => {
					this.getGroupInfoFn(this.messageData.operation.groupId);
				},
			};
			if (!methods[this.messageData.operation.groupType]) {
				return;
			}
			methods[this.messageData.operation.groupType]();
		},

		// 获取用户信息封装
		getUserByIdFn(id) {
			this.$emit('setLoading', true);
			getUserById({
				type: 'userId',
				id: id,
			})
				.then(resData => {
					this.userInfo = resData.data;
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

		// 获取群组信息
		getGroupInfoFn(groupId) {
			this.$emit('setLoading', true);
			getGroupInfo(groupId)
				.then(resData => {
					this.groupInfo = resData;
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

		// 邀请入群处理封装
		addGroupMemberHandleFn(agree) {
			this.$emit('setLoading', true);
			const data = {
				messageId: this.messageData.messageId,
				sourceId: this.messageData.operation.sourceId,
				userId: this.messageData.operation.userId,
				groupId: this.messageData.operation.groupId,
				agree: agree,
			};
			addGroupMemberHandle(data)
				.then(resData => {
					if (resData.ok) {
						this.$emit('refreshMessage');
					}
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					this.$emit('refreshMessage');
				})
				.then(() => {
					this.$emit('setLoading', false);
				});
		},

		// 入群申请处理
		applyMembershipHandleFn(agree) {
			this.$emit('setLoading', true);
			const data = {
				messageId: this.messageData.messageId,
				userId: this.messageData.operation.userId,
				groupId: this.messageData.operation.groupId,
				agree: agree,
			};
			applyMembershipHandle(data)
				.then(resData => {
					if (resData.ok) {
						this.$emit('refreshMessage');
					}
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					this.$emit('refreshMessage');
				})
				.then(() => {
					this.$emit('setLoading', false);
				});
		},
	},

	components: {
		AppDialogUser,
	},

	props: {
		messageData: {
			type: Object,
		},

		type: {
			type: String,
			default: 'drawer',
		},
	},

	created() {
		this.initalData();
	},
};
</script>

<style lang="scss" scoped>
.app-message-group {
	padding: 20px;

	&-content {
		.flex-start {
			@include flex-start();
			margin-left: 2em;
		}

		.content-title {
			margin-bottom: 10px;
		}

		.user,
		.group {
			@include flex-start();
			cursor: pointer;

			&:hover {
				color: #409eff;
			}
		}

		.user {
			&-avatar {
				width: 25px;
				height: 25px;
				margin-right: 5px;
				border-radius: 50%;
				display: block;
				border: 1px solid rgb(210, 214, 222);

				img {
					height: 100%;
					width: 100%;
					border-radius: 50%;
				}
			}
		}
		.content {
			padding: 0 5px;
		}

		.content-btn {
			width: 100%;
			text-align: right;
			margin-top: 10px;
		}

		.content-result {
			display: block;
			width: 100%;
			text-align: right;
			margin-top: 10px;
			color: #909399;
		}
	}

	&-footer {
		margin-top: 30px;
		text-align: right;
		.time {
			font-size: 14px;
		}
	}
}
</style>
