<template>
    <div v-loading="loading"
         class="app-dialog-group-content">
        <div class="app-dialog-group-left">
            <span class="app-dialog-group-icon">
                <svg-icon iconClass="icon-house" />
            </span>
            <span class="app-dialog-group-left-name">
                {{ data.group.groupName }}
            </span>
            <span class="app-dialog-group-left-id">
                {{ data.group.groupId }}
            </span>
            <el-button class="app-dialog-group-left-btn"
                       plain
                       size="medium"
                       @click="addMember">
                添加新成员
            </el-button>
        </div>
        <div class="app-dialog-group-right">
            <span class="app-dialog-group-right-title">
                家庭组
                <el-button class="app-dialog-group-right-edit"
                           type="text"
                           @click="routerSet">
                    编辑资料
                </el-button>
            </span>
            <span class="app-dialog-group-right-item height">
                <i class="title">介绍&nbsp;</i>
                <i>
                    创建于 {{ new Date(data.group.createTime).toLocaleDateString('zh-CN', {
                    hour12: false,
                    }) }}
                </i>
            </span>
            <span class="app-dialog-group-right-item height">
                <i class="title">
                    群主/成员（{{ members.length }}）
                </i>
            </span>
            <span class="app-dialog-group-right-item user">
                <el-tooltip class="item"
                            effect="light"
                            :content="owner.nickName"
                            placement="top">
                    <i class="user-item-avatar">
                        <img :src="owner.avatar"
                             :alt="owner.nickName">
                    </i>
                </el-tooltip>
                <i class="border"></i>
                <i class="user-item-avatar"
                   v-for="(item, index) in members"
                   :key="index">
                    <el-tooltip class="item"
                                effect="light"
                                :content="item.nickName"
                                placement="top">
                        <img :src="item.avatar"
                             :alt="item.nickName">
                    </el-tooltip>
                </i>
            </span>
            <span class="app-dialog-group-right-item height">
                <i class="title">房间数&nbsp;</i>
                <el-tag type="success"
                        size="mini">
                    {{data.roomNum }} 间
                </el-tag>
            </span>
            <span class="app-dialog-group-right-item height">
                <i class="title">
                    拥有设备&nbsp;
                </i>
                <i>
                    {{data.deviceNum }}
                </i>
            </span>
            <span class="app-dialog-group-right-item height">
                <i class="title">
                    所在地&nbsp;
                </i>
                <i>
                    {{ data.group.region[0].name }},
                    {{ data.group.region[1].name }},
                    {{ data.group.region[2].name }}
                </i>
            </span>
            <span class="app-dialog-group-right-item btn">
                <i class="title">
                    其他&nbsp;
                </i>
                <el-button v-if="data.group.ownerId === data.userId"
                           plain
                           size="small"
                           @click="setUnGroup">
                    解散家庭组
                </el-button>
                <el-button v-else
                           plain
                           size="small"
                           @click="setExitGroup">
                    退出家庭组
                </el-button>
            </span>

        </div>
    </div>
</template>

<script>
import storage from '@/assets/js/storage';
import { getGroupById, exitGroup, unGroup } from '@/api/group';

export default {
	name: 'AppDialogGroup',
	data() {
		return {
			loading: false,
			members: [],
			owner: [],
			activeName: this.activeTab,
		};
	},

	computed: {
		data() {
			let [group = {}, roomNum = 0, deviceNum = 0, userId = ''] = [
				this.$store.state.group,
				this.$store.state.rooms.length,
				this.$store.state.device.length,
				this.$store.state.user.userId,
			];

			return {
				group: group,
				roomNum: roomNum,
				deviceNum: deviceNum,
				userId: userId,
			};
		},
	},

	methods: {
		// 路由至设置
		routerSet() {
			this.$emit('setVisible', false, 'set');
			setTimeout(() => {
				this.$router.push({ name: 'set' });
			}, 300);
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

		// 添加群成员
		addMember() {
			this.$emit('setVisible', false);
			this.$emit('addMember');
		},

		// 获取群组信息
		getGrpupByIdFn() {
			if (!this.data.group.groupId) {
				return;
			}
			this.loading = true;

			getGroupById(this.data.group.groupId)
				.then(resData => {
					if (!resData.ok) {
						this.members = resData.members;
						this.owner = this.members.find(el => {
							return el.userId === resData.ownerId;
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

		// 退出家庭组封装
		exitGroupFn() {
			this.loading = true;
			exitGroup({
				groupId: this.data.group.groupId,
				userId: this.data.userId,
			})
				.then(resData => {
					storage.set('token', resData.token);
					this.$store.dispatch('token', resData.token);
					this.$store.dispatch('user', resData.userInfo);
					this.$store.dispatch('group', {});
					this.$store.dispatch('homeData', {});
					this.$store.dispatch('rooms', []);
					this.$store.dispatch('device', []);
					const socket = this.$store.state.socket;
					socket.disconnect();
					socket.io.opts.query = {
						token: resData.token,
					};
					socket.open();
					this.$store.dispatch('socket', socket);
					this.$notify({
						title: '家庭组',
						message: '已退出家庭组，数据更新',
					});
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
					this.$emit('setVisible', false);
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

	created() {
		this.getGrpupByIdFn();
	},
};
</script>

<style lang="scss">
.app-dialog-group {
	.el-dialog__header,
	.el-dialog__body {
		padding: 0;
	}

	&-content {
		height: 500px;
		@include flex-between();
	}

	&-icon {
		display: block;
		width: 110px;
		height: 110px;
		border-radius: 50%;
		font-size: 70px;
		border: 2px solid rgba(151, 140, 140, 0.4);
		box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
		background-color: rgba($color: #d7dada, $alpha: 0.3);
		@include flex-center();
	}

	&-left {
		width: 40%;
		height: 100%;
		padding-top: 60px;
		box-sizing: border-box;
		background-color: #909399;
		position: relative;

		@include flex-start(column);

		&-name {
			width: 100%;
			margin-top: 60px;
			color: #fff;
			font-size: 20px;
			text-align: center;

			@include ellipsis();
		}

		&-id {
			margin-top: 10px;
			color: #fff;
			font-size: 14px;
		}

		&-btn {
			position: absolute;
			bottom: 60px;
		}
	}

	&-right {
		width: 60%;
		height: 100%;
		box-sizing: border-box;
		padding: 20px;
		padding-left: 40px;

		&-title {
			margin-top: 10px;
			height: 60px;
			display: block;
			font-size: 18px;
			font-weight: bold;
			border-bottom: 1px solid #ebeef5;

			@include flex-between();
		}

		&-item {
			display: block;
			color: #303133;
		}

		.title {
			color: #909399;
			margin-right: 10px;
		}

		.height {
			height: 40px;
			line-height: 40px;
		}

		.btn {
			margin-top: 20px;
		}

		.border {
			height: 30px;
			display: block;
			border-right: 1px solid #909399;
			margin: 0 4px;
		}

		.user {
			width: 100%;
			min-height: 40px;
			@include ellipsis();
			@include flex-start();

			&-item-avatar {
				width: 30px;
				height: 30px;
				margin: 0 2px;
				border-radius: 50%;
				display: block;

				img {
					height: 100%;
					width: 100%;
					border-radius: 50%;
				}
			}
		}
	}
}
</style>

