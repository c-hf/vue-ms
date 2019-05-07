<template>
    <div class="message"
         v-loading="loading">
        <div class="message-header">
            <span class="title">
                消息中心
            </span>
            <el-checkbox v-model="unread"
                         @change="messageChange">
                仅看未读消息
            </el-checkbox>
        </div>
        <div class="message-menu">
            <span class="message-menu-left">
                <el-radio-group v-model="category"
                                @change="messageChange">
                    <el-radio label="ALL">
                        全部类型
                    </el-radio>
                    <el-radio label="GROUP">
                        家庭组
                    </el-radio>
                    <el-radio label="DEVICE">
                        设备
                    </el-radio>
                </el-radio-group>
                <el-button-group>
                    <el-button :disabled="disabled"
                               plain
                               size="medium"
                               @click="setAsRead">
                        标为已读
                    </el-button>
                    <el-button :disabled="disabled"
                               plain
                               size="medium"
                               @click="deleteMessage">
                        删除
                    </el-button>
                    <el-button plain
                               size="medium"
                               @click="refreshMessage">
                        刷新
                    </el-button>
                </el-button-group>
            </span>
            <span class="message-menu-right">
                <el-input placeholder="请输入搜索的标题"
                          v-model="keyword"
                          @keyup.enter="searchMessages">
                    <i slot="suffix"
                       class="el-input__icon el-icon-search"
                       @click="searchMessages">
                    </i>
                </el-input>
            </span>
        </div>
        <view-message-table :messages="messages"
                            @selectChange="selectChange"
                            @updateMessageStatus="updateMessageStatusFn"
                            @refreshMessage="refreshMessage"
                            @setLoading="setLoading" />
        <div class="message-footer">
            <el-pagination background
                           layout="prev, pager, next"
                           :total="total"
                           :current-page.sync="currentPage"
                           @current-change="currentChange">
            </el-pagination>
        </div>
    </div>
</template>

<script>
import {
	getMessages,
	updateMessageStatus,
	deleteMessage,
	getSearchMessages,
} from '@/api/message';
import ViewMessageTable from './components/messageTable';

export default {
	name: 'Message',
	data() {
		return {
			data: [],
			loading: false,
			disabled: true,
			unread: false,
			keyword: '',
			category: 'ALL',
			messages: [],
			selectMessages: [],
			total: 0,
			currentPage: 1,
		};
	},

	methods: {
		// 设为已读
		setAsRead() {
			this.$confirm('确定要对选中站内信设置已读吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					let messages = [];
					this.selectMessages.forEach(el => {
						if (el.status === 'UNREAD') {
							messages.push(el.messageId);
						}
					});
					this.selectMessages = [];
					this.updateMessageStatusFn(messages).then(resData => {
						if (resData.ok) {
							this.getMessagesFn(this.currentPage - 1, 10);
						}
					});
				})
				.catch(() => {});
		},

		// 删除消息
		deleteMessage() {
			this.$confirm('确定要删除已选中的站内信吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					let messages = [];
					this.selectMessages.forEach(el => {
						messages.push(el.messageId);
					});
					this.selectMessages = [];
					this.deleteMessageFn(messages);
				})
				.catch(() => {});
		},

		// 搜索消息
		searchMessages() {
			let [status, category] = this.getReqData();
			const data = {
				query: {
					status: status,
					category: category,
				},
				keyword: this.keyword,
				pageNo: 0,
				pageSize: 20,
			};
			this.getSearchMessagesFn(data);
		},

		// 多选
		selectChange(selectMessages, disabled) {
			this.selectMessages = selectMessages;
			this.disabled = disabled;
		},

		// 当前页
		currentChange(value) {
			this.getMessagesFn(value - 1, 10);
		},

		// 重新获取消息
		messageChange() {
			this.getMessagesFn(this.currentPage - 1, 10);
		},

		refreshMessage() {
			this.getMessagesFn(this.currentPage - 1, 10);
		},

		getReqData() {
			let [status, category] = ['', ''];
			this.unread ? (status = 'UNREAD') : (status = '');
			this.category !== 'ALL'
				? (category = this.category)
				: (category = '');
			return [status, category];
		},

		// 获取消息
		getMessagesFn(pageNo, pageSize) {
			this.loading = true;
			let [status, category] = this.getReqData();
			getMessages({
				query: {
					status: status,
					category: category,
				},
				pageNo: pageNo,
				pageSize: pageSize,
			})
				.then(resData => {
					this.total = resData.total;
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

		// 查找消息封装
		getSearchMessagesFn(data) {
			this.loading = true;

			getSearchMessages(data)
				.then(resData => {
					this.total = resData.total;
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

		// 设为已读封装
		updateMessageStatusFn(messages) {
			this.loading = true;
			return updateMessageStatus(messages)
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				})
				.then(resData => {
					this.loading = false;
					return resData;
				});
		},

		// 删除消息封装
		deleteMessageFn(messages) {
			this.loading = true;
			deleteMessage(messages)
				.then(resData => {
					if (resData.ok) {
						this.getMessagesFn(this.currentPage - 1, 10);
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
					setTimeout(() => {
						this.loading = false;
					}, 2000);
				});
		},

		setLoading(value) {
			this.loading = value;
		},
	},

	components: {
		ViewMessageTable,
	},

	created() {
		this.getMessagesFn(0, 10);
	},
};
</script>

<style lang="scss" scoped>
.message {
	@include flex-direction();
	@include content-background();

	&-header {
		padding-bottom: 18px;
		border-bottom: 1px solid #ebeef5;
		box-sizing: border-box;

		.title {
			font-size: 18px;
			padding: 0 10px;
		}
	}

	&-menu {
		height: 100px;
		margin-top: 20px;

		@include flex-between();
		align-items: flex-start;

		&-left {
			height: 100%;
			@include flex-around(column);
			align-items: flex-start;
		}
	}

	&-footer {
		width: 100%;
		margin-top: 20px;
		text-align: right;
		padding: 0 40px;
		box-sizing: border-box;
	}
}
</style>
