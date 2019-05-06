<template>
    <el-scrollbar style="height:100%; width:100%;"
                  class="app-drawer-message"
                  v-loading="loading">
        <div class="app-drawer-message-title">
            <span>
                未读消息
            </span>
            <el-button type="primary"
                       plain
                       size="small"
                       @click="routerMessage">
                进入消息中心
            </el-button>
        </div>
        <div class="app-drawer-message-warn"
             v-if="!messages.length">
            (～￣▽￣)～ 消息都处理完了
        </div>
        <ul class="app-drawer-message-content"
            v-else>
            <li class="message"
                v-for="(item, index) in messages"
                :key="index"
                @click="displayMessage(index)"
                @mousemove="messagesActive(index)"
                @mouseout="messagesActiveOut">
                <span class="message-label">
                    <i class="label"
                       v-if="item.message.category === 'GROUP'">
                        [ 家庭组 ]
                    </i>
                    <i class="label"
                       v-else-if="item.message.category === 'DEVICE'">
                        [ 设备 ]
                    </i>
                    <i class="time"
                       :class="{'time-active':index === isActive}">
                        {{ new Date(item.message.createTime).toLocaleString('zh-CN', { hour12: false }) }}
                    </i>
                    <el-button class="read-btn"
                               :class="{'read-btn-active':index === isActive}"
                               round
                               plain
                               size="mini"
                               @click="updateMessageStatusFn(item.message.messageId,index)">
                        设为已读
                    </el-button>
                </span>
                <span class="message-title">
                    {{ item.message.title }}
                </span>
            </li>
        </ul>
        <el-dialog :visible.sync="visible"
                   :modal-append-to-body="false"
                   :modal="false"
                   :title="messageData.title"
                   width="680px"
                   @close="dialogClose">
            <app-message-group :messageData="messageData" />
        </el-dialog>
    </el-scrollbar>
</template>

<script>
import AppMessageGroup from '@/components/appMessageGroup';
import { getMessages, updateMessageStatus } from '@/api/message';

export default {
	name: 'AppDrawerMessage',
	data() {
		return {
			loading: false,
			messages: [],
			isActive: -1,
			visible: false,
			messageData: {},
		};
	},

	computed: {},

	methods: {
		// 鼠标滑过
		messagesActive(index) {
			this.isActive = index;
		},

		// 鼠标离开
		messagesActiveOut() {
			this.isActive = -1;
		},

		// 显示消息详情
		displayMessage(index) {
			this.messageData = this.messages[index].message;
			this.visible = true;
		},

		// 对话框关闭
		dialogClose() {
			this.updateMessageStatusFn(this.messageData.messageId);
		},

		// 导航至消息中心
		routerMessage() {
			this.$router.push({ name: 'message' });
			this.$emit('setShow', false);
		},

		// 获取消息
		getMessagesFn() {
			this.loading = true;
			getMessages({
				query: {
					status: 'UNREAD',
				},
				pageNo: 0,
				pageSize: 20,
			})
				.then(resData => {
					this.messages = resData.page;
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

		// 设为已读
		updateMessageStatusFn(messageId) {
			this.loading = true;
			updateMessageStatus([messageId])
				.then(resData => {
					if (resData.ok) {
						this.getMessagesFn();
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

	props: {},

	components: {
		AppMessageGroup,
	},

	created() {
		this.getMessagesFn();
	},
};
</script>

<style lang="scss" scoped>
.app-drawer-message {
	&-title {
		padding: 20px;
		border-bottom: 1px solid #ebeef5;
		@include flex-between();

		span {
			color: #606266;
		}
	}

	&-warn {
		font-size: 18px;
		color: #909399;
		text-align: center;
		line-height: calc(100vh - 400px);
		height: calc(100vh - 120px);
		border-bottom: 1px solid #ebeef5;
	}

	&-content {
		min-height: calc(100vh - 120px);
		padding: 10px 0;
		margin: 0 20px;
		cursor: default;

		.message {
			margin-bottom: 20px;
			border-bottom: 1px solid #ebeef5;
		}

		.message-label {
			height: 20px;
			font-size: 14px;
			color: #909399;
			@include flex-between();

			.read-btn {
				display: none;
			}

			.time-active {
				display: none;
			}

			.read-btn-active {
				display: block;
			}
		}

		.message-title {
			width: 100%;
			color: #303133;
			padding: 10px 0;
			display: block;
			cursor: pointer;
			@include ellipsis();
		}
		border-bottom: 1px solid #ebeef5;
	}
}
</style>
