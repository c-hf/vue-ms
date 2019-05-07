<template>
    <el-card class="view-member"
             v-loading="loading">
        <div slot="header">
            <div class="user">
                <span class="user-avatar">
                    <img :src="user.avatar"
                         :alt="user.nickName">
                </span>
                <span class="user-info">
                    <i class="user-info-nickName">
                        {{ user.nickName }}
                    </i>
                    <i class="user-info-intro"
                       v-if="user.intro">
                        {{ user.intro }}
                    </i>
                    <i v-else
                       class="user-info-intro">
                        暂无介绍 ┐(´∇｀)┌
                    </i>
                </span>
                <span class="hidden">
                    {{ memberNum }}
                </span>
            </div>
            <el-input class="user-search"
                      size="mini"
                      v-model="searchValue"
                      placeholder="搜索"
                      @input="searchUser">
                <i slot="prefix"
                   class="el-input__icon el-icon-search">
                </i>
            </el-input>
        </div>
        <div class="view-member-list">
            <span class="view-member-list-title">
                <i>
                    {{ title }}
                </i>
                <i class="el-icon-star-on">
                </i>
            </span>
            <view-search v-if="isSearch"
                         :userList="searchList"
                         @displayMemberInfo="displaySearchMemberInfo" />
            <div class="view-member-list-error"
                 v-else-if="!members.length">
                还未加入家庭组，你可以
                <el-button type="text"
                           @click="routerCreate">
                    创建新家庭组
                </el-button>
                或者
                <el-button type="text"
                           @click="addMember('group')">
                    加入家庭组
                </el-button>
            </div>
            <div v-else
                 class="user-item"
                 v-for="(item, index) in members"
                 :key="index"
                 @click="displayMemberInfo(index)">
                <span class="user-item-avatar">
                    <img :src="item.avatar"
                         :alt="item.nickName">
                </span>
                <span class="user-item-info">
                    <i class="user-item-info-nickName">
                        {{ item.nickName }}
                    </i>
                    <i class="user-item-info-intro">
                        {{ item.intro }}
                    </i>
                </span>
                <div class="user-item-mask-layer">
                </div>
            </div>
        </div>
        <div class="view-member-tool">
            <el-dropdown trigger="click"
                         placement="top-start"
                         @command="handleCommand">
                <el-button class="view-member-tool-btn"
                           type="text">
                    <svg-icon iconClass="icon-bars" />
                </el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="info"
                                      :disabled="disabled">
                        查看群资料
                    </el-dropdown-item>
                    <el-dropdown-item command="create"
                                      :disabled="!disabled">
                        创建群组
                    </el-dropdown-item>
                    <el-dropdown-item command="add">
                        添加成员/群
                    </el-dropdown-item>
                    <el-dropdown-item v-if="ownerId === user.userId"
                                      command="unGroup"
                                      :disabled="disabled">
                        解散群
                    </el-dropdown-item>
                    <el-dropdown-item v-else
                                      command="exit"
                                      :disabled="disabled">
                        退出群组
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-button class="view-member-tool-btn"
                       type="text"
                       @click="addMember('user')">
                <svg-icon iconClass="icon-addpeople_fill" />
            </el-button>
        </div>
    </el-card>
</template>

<script>
import { getUserById } from '@/api/user';
import { getGroupById, exitGroup, unGroup } from '@/api/group';

import ViewSearch from './search';

export default {
	name: 'Member',
	data() {
		return {
			loading: false,
			isSearch: false,
			title: '群成员',
			searchValue: '',
			ownerId: '',
			members: [],
			searchList: [],
			infoTimer: null,
			searchTimer: null,
		};
	},

	computed: {
		user() {
			return this.$store.state.user;
		},

		memberNum() {
			if (!this.$store.state.group.member) {
				return 0;
			}
			return this.$store.state.group.member.length;
		},

		disabled() {
			if (this.user.groupId) {
				return false;
			} else {
				return true;
			}
		},
	},

	methods: {
		// 功能
		handleCommand(command) {
			const methods = {
				add: this.addMember,
				info: this.displayGroupInfo,
				exit: this.setExitGroup,
				unGroup: this.setUnGroup,
				create: this.routerCreate,
			};
			methods[command]();
		},

		// 路由至创建群组页
		routerCreate() {
			if (this.$store.state.user.groupId) {
				this.$message({
					showClose: true,
					center: true,
					message: '已加入家庭组,无法创建新家庭组',
					type: 'error',
				});
				return;
			}
			this.$router.push({ name: 'createGroup' });
		},

		// 退出群组
		setExitGroup() {
			this.$confirm('确定要退出家庭组吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.exitGroupFn();
				})
				.catch(() => {});
		},

		// 解散群组
		setUnGroup() {
			this.$confirm('确定要解散家庭组吗？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.unGroupFn();
				})
				.catch(() => {});
		},

		// 查看详细资料
		displayMemberInfo(index) {
			const data = this.members[index];
			this.$emit('displayMemberInfo', data);
		},

		// 查看搜索项详细资料
		displaySearchMemberInfo(index) {
			const data = this.searchList[index];
			this.$emit('displayMemberInfo', data);
		},

		// 查看群资料
		displayGroupInfo() {
			this.$emit('displayGroupInfo');
		},

		// 添加群成员
		addMember(value) {
			this.$emit('addMember', value);
		},

		// 获取用户信息封装
		getUserByIdFn(userId) {
			this.loading = true;
			getUserById({ type: 'userId', id: userId })
				.then(resData => {
					this.$emit('viewMemberInfo', resData.data);
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

		// 查询用户
		searchUser(value) {
			if (this.searchValue.length === 0) {
				this.isSearch = false;
				this.title = '群成员';
				clearTimeout(this.timer);
				return;
			} else {
				this.title = '搜索结果';
				this.isSearch = true;
			}

			if (this.searchTimer) {
				clearTimeout(this.searchTimer);
				this.searchTimer = null;
			}
			this.searchTimer = setTimeout(() => {
				this.searchList = [];
				this.members.forEach(el => {
					if (el.nickName.indexOf(value) >= 0) {
						this.searchList.push(el);
					} else if (el.userId.indexOf(value) >= 0) {
						this.searchList.push(el);
					}
				});
			}, 300);
		},

		// 获取群组信息
		getGrpupByIdFn(groupId) {
			if (!groupId) {
				return;
			}
			this.loading = true;

			getGroupById(groupId)
				.then(resData => {
					if (!resData.ok) {
						this.members = resData.members;
						this.ownerId = resData.ownerId;
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

		// 退出家庭组封装
		exitGroupFn() {
			this.loading = true;
			exitGroup({
				groupId: this.user.groupId,
				userId: this.user.userId,
			})
				.then(resData => {
					if (resData.ok) {
						this.ownerId = null;
						this.members = [];
						this.searchList = [];
						this.$notify({
							title: '家庭组',
							message: '已退出家庭组，数据更新',
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

		// 解散群组封装
		unGroupFn() {
			this.loading = true;
			unGroup({ groupId: this.user.groupId })
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
					this.loading = false;
				});
		},
	},

	components: {
		ViewSearch,
	},

	watch: {
		memberNum(newVal) {
			if (newVal === 0) {
				this.ownerId = null;
				this.members = [];
				this.searchList = [];
			} else {
				this.getGrpupByIdFn(this.user.groupId);
			}
		},
	},

	created() {
		this.getGrpupByIdFn(this.user.groupId);
	},
};
</script>

<style lang="scss">
.view-member {
	background-image: url(~@/assets/img/signLeft/4.jpg);
	background-size: 100% 100%;
	background-position: 0 0;
	background-repeat: no-repeat;
	position: relative;
	z-index: 2;

	&::after {
		content: ' ';
		display: block;
		width: 100%;
		height: 100%;
		background: linear-gradient(
			transparent 30%,
			rgb(204, 204, 204) 80%,
			#fff 90%
		);
		opacity: 0.8;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 3;
	}

	.el-card__header {
		padding: 0;
		border-bottom: none;
		position: relative;
		z-index: 10;
	}

	.el-card__body {
		padding: 0;
		position: relative;
		z-index: 10;
	}

	.hidden {
		display: none;
	}

	.user {
		@include flex-start();
		padding: 18px 15px;
		padding-bottom: 10px;

		&-avatar {
			width: 60px;
			height: 60px;
			border-radius: 50%;
			display: block;
			border: 2px solid rgb(210, 214, 222);

			img {
				height: 100%;
				width: 100%;
				border-radius: 50%;
			}
		}

		&-info {
			width: 50%;
			text-align: left;
			margin-left: 5%;

			i {
				display: block;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}

			&-nickName {
				font-size: 16px;
				font-weight: bold;
			}

			&-intro {
				margin-top: 4px;
				font-size: 14px;
				color: #909399;
			}
		}

		&-search {
			input {
				height: 30px;
				background-color: rgba($color: #bbb, $alpha: 0.4);
				color: #303133;
				border: none;
				border-radius: 0;

				&::placeholder {
					color: #606266;
				}
			}

			.el-icon-search {
				color: #606266;
			}
		}
	}

	&-list {
		margin-top: 10px;
		min-height: 480px;
		height: calc(100vh - 330px);

		&-title {
			display: block;
			height: 30px;
			padding: 0 20px;
			line-height: 30px;
			font-size: 14px;
			color: #909399;
			user-select: none;
			cursor: default;
			@include flex-between();
		}

		&-create-group {
			@include flex-center(column);
		}

		&-error {
			height: 100%;
			margin-top: 5vh;
			padding: 10px;
			color: #606266;
			text-align: center;
		}

		.user-item {
			height: 60px;
			padding: 0 20px;
			position: relative;
			cursor: pointer;

			@include flex-start();

			// 遮罩
			&:hover .user-item-mask-layer {
				width: 100%;
				height: 100%;
				background: #000;
				opacity: 0.1;
				position: absolute;
				top: 0;
				left: 0;
				z-index: 12;
			}

			&-avatar {
				width: 40px;
				height: 40px;
				border-radius: 50%;
				display: block;
				z-index: 15;

				img {
					height: 100%;
					width: 100%;
					border-radius: 50%;
				}
			}

			&-info {
				width: 50%;
				text-align: left;
				margin-left: 5%;
				position: relative;
				z-index: 15;

				&-nickName {
					font-size: 16px;
				}

				&-intro {
					@include ellipsis();

					margin-left: 14px;
					font-size: 12px;
					color: #909399;
				}
			}
		}
	}

	&-tool {
		width: 100%;
		height: 40px;
		border-top: 1px solid rgba($color: #ddd, $alpha: 0.6);
		position: absolute;
		bottom: 0;
		z-index: 10;

		&-btn {
			height: 100%;
			font-size: 20px;
			padding: 5px;
			// color: #909399;

			// &:hover {
			// 	color: #606266;
			// }

			// &:active {

			// }
		}
	}
}
</style>
