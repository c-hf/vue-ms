<template>
    <div class="view-group-message"
         v-loading="loading">
        <!-- Add Join Remove Ungroup -->
        <div class="view-group-message-content"
             v-if="messageData.feedback.groupType === 'Add' || 'Join'">
            <p class="content-title">
                尊敬的用户，
            </p>
            <p class="content-add"
               v-if="messageData.feedback.groupType === 'Add'">
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
            <p class="content-join"
               v-if="messageData.feedback.groupType === 'Join'">

            </p>
            <p class="content-btn">
                <el-button type="primary">
                    同意
                </el-button>
                <el-button type="danger">
                    拒绝
                </el-button>
            </p>
        </div>
        <div class="view-group-message-footer">
            <span class="">

            </span>
            <span class="time">
                {{ new Date(messageData.createTime).toLocaleString('zh-CN', { hour12: false }).split(' ')[0] }}
            </span>
        </div>
        <el-dialog :visible.sync="visible"
                   width="360px"
                   class="app-user-info">
            <app-user-info :user="userInfo" />
        </el-dialog>
    </div>
</template>

<script>
import { getGroupInfo, getUserById } from '@/api/user';
import AppUserInfo from '@/components/appUserInfo';

export default {
	name: 'ViewGroupMessage',
	data() {
		return {
			loading: false,
			groupInfo: {},
			userInfo: {},
			visible: false,
		};
	},

	methods: {
		// 展示用户信息
		displayUser() {
			this.visible = true;
		},

		// 获取用户信息封装
		getUserByIdFn() {
			if (this.messageData.feedback.groupType === 'Ungroup') {
				return;
			}
			this.loading = true;

			getUserById({
				type: 'userId',
				id: this.messageData.feedback.source,
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
					this.loading = false;
				});
		},

		// 获取群组信息
		getGroupInfoFn() {
			if (this.messageData.feedback.groupType !== 'Add') {
				return;
			}
			this.loading = true;

			getGroupInfo(this.messageData.feedback.groupId)
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
					this.loading = false;
				});
		},
	},

	components: {
		AppUserInfo,
	},

	props: {
		messageData: {
			type: Object,
		},
	},

	created() {
		this.getUserByIdFn();
		this.getGroupInfoFn();
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.view-group-message {
	padding: 20px;

	&-content {
		.content-add {
			@include flex-start();
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
			display: block;
			width: 100%;
			text-align: right;
			margin-top: 10px;
			padding-right: 100px;
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
