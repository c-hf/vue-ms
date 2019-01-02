<template>
    <el-card class="member">
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
                    <i class="user-info-intro">
                        {{ user.intro }}
                    </i>
                </span>
            </div>
            <el-input class="user-search"
                      size="mini"
                      v-model="searchValue"
                      @change="searchUser"
                      placeholder="搜索">
                <i slot="prefix"
                   class="el-input__icon el-icon-search"></i>
            </el-input>
        </div>
        <div class="member-list">
            <search :userList="userList"
                    v-if="isSearch" />
            <div class="user-item"
                 v-else
                 v-for="(item, index) in memberList"
                 :key="index">
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
        <div class="member-tool">
            <el-button class="add-member-btn"
                       type="text"
                       icon="el-icon-circle-plus-outline"
                       @click="addMember"></el-button>
        </div>
    </el-card>
</template>

<script>
import {
	getUserInfo,
	setGroup,
	// addGroupMember,
	getGroupById,
	// getUserById,
} from '@/api/user';

import Search from './search';

export default {
	name: 'Member',
	data() {
		return {
			searchValue: '',
			isSearch: false,
			userList: '',
			memberList: [],
		};
	},
	computed: {
		user() {
			return this.$store.state.user;
		},
	},
	methods: {
		getUserInfoFn() {
			getUserInfo()
				.then(resData => {
					this.$store.dispatch('user', resData);
					this.user = resData;
					this.getGrpupByIdFn();
				})
				.catch(error => {
					this.$elementUI.Message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				});
		},

		searchUser() {
			let timer = null;
			if (timer) {
				clearTimeout(timer);
				timer = null;
			}
			timer = setTimeout(() => {
				console.log(this.searchValue);
			}, 300);
		},

		setGroupFn() {
			setGroup({
				groupName: 'test',
				region: ['中国', '福建', '福州'],
			})
				.then(resData => {
					console.log(resData);

					this.$message({
						showClose: true,
						center: true,
						message: '创建成功！',
						type: 'success',
					});

					this.getUserInfoFn();
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
					// this.loading = false;
				});
		},

		addMember() {
			this.dialogTableVisible = true;
			this.$emit('addMember');
		},

		getGrpupByIdFn() {
			// this.loading = true;
			if (!this.user.groupId) {
				return;
			}
			getGroupById(this.user.groupId)
				.then(resData => {
					this.memberList = resData[0].memberList;
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
					// this.loading = false;
				});
		},
	},

	components: {
		Search,
	},
	created() {
		this.getGrpupByIdFn();
	},
};
</script>

<style lang="scss">
.member {
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

	.user {
		display: flex;
		align-items: center;
		justify-content: start;
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
			}

			&-intro {
				margin-top: 4px;
				font-size: 16px;
				color: #909399;
			}
		}
	}

	.search {
		width: 100%;
		> input {
			border-radius: 0;
		}
	}

	&-list {
		height: 480px;

		&-create-group {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		.user-item {
			height: 60px;
			padding: 0 20px;
			display: flex;
			align-items: center;
			justify-content: start;
			position: relative;
			cursor: pointer;

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
				position: relative;
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
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
					margin-left: 14px;
					font-size: 10px;
					color: #99a9bf;
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
	}
}
</style>
