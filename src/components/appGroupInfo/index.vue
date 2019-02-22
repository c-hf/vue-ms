<template>
    <div v-loading="loading"
         class="app-group-info-content">
        <div class="app-group-info-left">
            <span class="app-group-info-icon">
            </span>
            <span class="app-group-info-left-name">
                {{ data.group.groupName }}
            </span>
            <span class="app-group-info-left-id">
                {{ data.group.groupId }}
            </span>
            <el-button class="app-group-info-left-btn"
                       plain
                       size="medium"
                       @click="addMember">
                添加新成员
            </el-button>
        </div>
        <div class="app-group-info-right">
            <span class="app-group-info-right-title">
                家庭组
                <el-button class="app-group-info-right-edit"
                           type="text"
                           @click="routerSet">
                    编辑资料
                </el-button>
            </span>
            <span class="app-group-info-right-item height">
                <i class="title">介绍&nbsp;</i>
                <i>
                    创建于 {{ new Date(data.group.createTime).toLocaleDateString('zh-CN', {
                    hour12: false,
                    }) }}
                </i>
            </span>
            <span class="app-group-info-right-item height">
                <i class="title">
                    群主/成员（{{ members.length }}）
                </i>
            </span>
            <span class="app-group-info-right-item user">
                <i class="user-item-avatar">
                    <img :src="owner.avatar"
                         :alt="owner.nickName">
                </i>
                <i class="border"></i>
                <i class="user-item-avatar"
                   v-for="(item, index) in members"
                   :key="index">
                    <img :src="item.avatar"
                         :alt="item.nickName">
                </i>
            </span>
            <span class="app-group-info-right-item height">
                <i class="title">房间数&nbsp;</i>
                <el-tag>
                    {{data.roomNum }} 间
                </el-tag>
            </span>
            <span class="app-group-info-right-item height">
                <i class="title">拥有设备&nbsp;</i>
                <i>
                    {{data.deviceNum }}
                </i>
            </span>
            <span class="app-group-info-right-item height">
                <i class="title">所在地&nbsp;</i>
                <i>
                    {{ data.group.region[0].name }},
                    {{ data.group.region[1].name }},
                    {{ data.group.region[2].name }}
                </i>
            </span>
            <span class="app-group-info-right-item btn">
                <i class="title">
                    其他&nbsp;
                </i>
                <el-button plain
                           size="small">
                    解散家庭组
                </el-button>
            </span>

        </div>
    </div>
</template>

<script>
import { getGroupById } from '@/api/user';

export default {
	name: 'AppGroupInfo',
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
			let [group = {}, roomNum = 0, deviceNum = 0] = [
				this.$store.state.group,
				this.$store.state.rooms.length,
				this.$store.state.device.length,
			];

			return {
				group: group,
				roomNum: roomNum,
				deviceNum: deviceNum,
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
	},

	created() {
		this.getGrpupByIdFn();
	},
};
</script>

<style lang="scss">
@import '~@/assets/scss/mixins';

.app-group-info {
	.el-dialog__header,
	.el-dialog__body {
		padding: 0;
	}

	&-content {
		height: 440px;
		@include flex-between();
	}

	&-icon {
		display: block;
		width: 110px;
		height: 110px;
		border-radius: 50%;
		border: 2px solid rgba(151, 140, 140, 0.4);
		box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
		background-image: url(~@/assets/img/information/house.svg);
		background-color: rgba($color: #d7dada, $alpha: 0.3);
		background-size: 70% 70%;
		background-position: center center;
		background-repeat: no-repeat;
	}

	&-left {
		width: 40%;
		height: 100%;
		padding-top: 40px;
		box-sizing: border-box;
		color: #fff;
		background-color: #909399;
		position: relative;

		@include flex-start(column);

		&-name {
			width: 100%;
			margin-top: 30px;
			font-size: 20px;
			text-align: center;

			@include ellipsis();
		}

		&-id {
			margin-top: 10px;
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

