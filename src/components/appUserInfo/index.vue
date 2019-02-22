<template>
    <div v-loading="loading">
        <span class="app-user-info-avatar block">
            <img :src="user.avatar"
                 alt="头像">
        </span>
        <span class="app-user-info-nickName block">
            {{ user.nickName }}
        </span>
        <span class="app-user-info-intro block">
            <i v-if="!user.intro">
                暂无介绍 ┐(´∇｀)┌
            </i>
            <i v-else>
                {{ user.intro }}
            </i>
        </span>
        <span class="app-user-info-item">
            <i>账号</i>
            <i>
                {{ user.userId }}
            </i>
        </span>
        <span class="app-user-info-item">
            <i>昵称</i>
            <i>
                {{ user.nickName }}
            </i>
        </span>
        <span class="app-user-info-item">
            <i>性别</i>
            <i>
                {{ user.sex }}
            </i>
        </span>
        <span class="app-user-info-item"
              :class="{bottom: type !== 'member'}">
            <i>年龄</i>
            <i>
                {{ new Date().getFullYear() - user.birthday.split('-')[0] }}
            </i>
        </span>
        <span v-show="type === 'member'"
              class="app-user-info-item bottom">
            <i>所在地</i>
            <i>
                {{ user.region }}
            </i>
        </span>
        <el-button v-show="type === 'member'"
                   class="app-user-info-delete"
                   type="danger"
                   icon="el-icon-delete"
                   circle
                   @click="deleteMember(user.userId)">
        </el-button>
        <el-button v-show="type === 'own'"
                   class="app-user-info-delete"
                   type="primary"
                   icon="el-icon-edit"
                   circle
                   @click="routerSet">
        </el-button>
    </div>

</template>

<script>
import { deleteGroupMember } from '@/api/user';

export default {
	name: 'AppUserInfo',
	data() {
		return {
			loading: false,
		};
	},

	methods: {
		// 路由至设置页面
		routerSet() {
			this.$router.push({ name: 'set' });
			this.$emit('setVisible', false);
		},

		// 删除成员
		deleteMember(id) {
			const ownerId = this.$store.state.group.ownerId;
			const userId = this.$store.state.user.userId;
			if (ownerId !== userId) {
				this.$message({
					showClose: true,
					center: true,
					type: 'warning',
					message: '不具备删除成员权限！',
				});
				return;
			} else if (id === userId) {
				this.$message({
					showClose: true,
					center: true,
					type: 'error',
					message: '删除失败！',
				});
				return;
			}
			this.$confirm('此操作将删除该成员, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.deleteGroupMemberFn(id);
				})
				.catch(() => {
					this.$message({
						showClose: true,
						center: true,
						type: 'info',
						message: '已取消删除',
					});
				});
		},

		// 删除成员封装
		deleteGroupMemberFn(userId) {
			this.loading = true;
			const data = {
				groupId: this.$store.state.group.groupId,
				userId: userId,
			};
			deleteGroupMember(data)
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							center: true,
							type: 'success',
							message: '删除成功!',
						});
						this.$emit('setVisible', false);
					}
				})
				.catch(error => {
					this.$elementUI.Message({
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
		user: {
			type: Object,
		},

		type: {
			type: String,
			default: 'user',
		},
	},
};
</script>

<style lang="scss">
@import '~@/assets/scss/mixins';

.app-user-info {
	.el-dialog__header,
	.el-dialog__body {
		padding: 0;
	}

	.block {
		display: block;
	}

	.bottom {
		padding-bottom: 20px;
	}

	&-avatar {
		width: 100%;
		height: 300px;
		position: relative;
		overflow: hidden;

		img {
			width: 100%;
			height: 360px;
			position: absolute;
			top: -60px;
		}
	}

	&-nickName {
		height: 50px;
		font-size: 22px;
		font-weight: bold;
		text-align: center;
		line-height: 50px;
	}

	&-intro {
		width: 80%;
		height: 30px;
		line-height: 30px;
		margin: 0 auto;
		text-align: center;
		font-size: 14px;
		color: #99a9bf;
		@include ellipsis();
	}

	&-item {
		font-size: 14px;
		text-align: center;
		margin: 10px 0;
		color: #303133;
		@include flex-center();

		i:nth-of-type(1) {
			display: inline-block;
			width: 50px;
			color: #c0c4cc;
			padding: 0 5px;
			text-align: right;
		}

		i:nth-of-type(2) {
			display: inline-block;
			width: 120px;
			padding-left: 10px;
			text-align: left;
		}
	}

	&-delete {
		position: absolute;
		top: 277px;
		right: 15px;
		font-size: 20px;
	}
}
</style>
