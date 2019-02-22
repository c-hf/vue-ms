<template>
    <div>
        <el-row class="family"
                :gutter="24">
            <el-col :span="18"
                    :md="16"
                    :lg="18"
                    class="family-left">
                <el-col :span="24">
                    <view-group-info @displayGroupInfo="displayGroupInfo" />
                </el-col>
                <el-col :span="24">
                    <view-rooms-info />
                </el-col>
            </el-col>
            <el-col :span="6"
                    :md="8"
                    :lg="6"
                    class="family-right">
                <view-member @addMember="addMember"
                             @displayMemberInfo="displayMemberInfo"
                             @displayGroupInfo="displayGroupInfo" />
            </el-col>
        </el-row>
        <app-drawer :show.sync="show">
            <view-drawer-member v-if="show"
                                @setShow="setShow" />
        </app-drawer>
        <el-dialog class="app-user-info"
                   :visible.sync="userVisible"
                   width="360px">
            <app-user-info :user="member"
                           type="member"
                           @setVisible="setUserVisible" />
        </el-dialog>
        <el-dialog class="app-group-info"
                   :visible.sync="groupVisible"
                   width="600px">
            <app-group-info @setVisible="setGroupVisible"
                            @addMember="addMember" />
        </el-dialog>
    </div>
</template>

<script>
import AppDrawer from '@/components/appDrawer';
import AppUserInfo from '@/components/appUserInfo';
import AppGroupInfo from '@/components/appGroupInfo';
import ViewMember from './viewMember';
import ViewGroupInfo from './viewGroupInfo';
import ViewRoomsInfo from './viewRoomsInfo';
import ViewDrawerMember from './viewDrawerMember';

export default {
	name: 'Family',
	data() {
		return {
			show: false,
			member: {},
			userVisible: false,
			groupVisible: false,
		};
	},

	methods: {
		// 查看群信息
		displayGroupInfo() {
			this.groupVisible = true;
		},

		// 查看成员信息
		displayMemberInfo(member) {
			member.region = '';
			let region = this.$store.state.group.region;
			region = region.slice(0, 2);
			region.forEach(el => {
				member.region = `${member.region} ${el.name}`;
			});
			this.member = member;
			this.userVisible = true;
		},

		// 添加成员
		addMember() {
			this.show = true;
		},

		// 显示抽屉组件
		setShow(value) {
			this.show = value;
		},

		setUserVisible(value) {
			this.userVisible = value;
		},

		setGroupVisible(value) {
			this.groupVisible = value;
		},
	},
	components: {
		AppDrawer,
		AppUserInfo,
		AppGroupInfo,
		ViewMember,
		ViewGroupInfo,
		ViewRoomsInfo,
		ViewDrawerMember,
	},
};
</script>

<style lang="scss">
@import '~@/assets/scss/mixins';

.family {
	background-color: inherit;

	&-dialog {
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
}
</style>
