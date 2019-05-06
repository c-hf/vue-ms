<template>
    <el-card class="view-group-info"
             :body-style="{display: 'flex',
                     'align-items': 'center',
                     'justify-content':'space-around'}">
        <div class="view-group-info-item">
            <ul class="view-group-info-item-text">
                <li>
                    <i>家庭组 ID</i>
                    <i v-if="groupId">
                        {{ groupId }}
                    </i>
                    <i v-else>
                        无
                    </i>
                </li>
                <li>
                    <i>家庭成员</i>
                    <i>
                        {{ memberNum }}
                    </i>
                </li>
            </ul>
            <span class="view-group-info-item-icon"
                  @click="displayGroupInfo">
                <svg-icon iconClass="icon-group" />
            </span>
        </div>
        <div class="view-group-info-item">
            <ul class="view-group-info-item-text">
                <li>
                    <i>房间</i>
                    <i>
                        {{roomNum}}
                    </i>
                </li>
                <li>
                    <i>设备</i>
                    <i>
                        {{deviceNum}}
                    </i>
                </li>
            </ul>
            <span class="view-group-info-item-icon">
                <svg-icon iconClass="icon-homepage" />
            </span>
        </div>
    </el-card>
</template>

<script>
export default {
	name: 'ViewGroupInfo',
	data() {
		return {};
	},

	methods: {
		// 查看群信息
		displayGroupInfo() {
			if (!this.groupId) {
				return;
			}
			this.$emit('displayGroupInfo');
		},
	},

	computed: {
		groupId() {
			return this.$store.state.group.groupId;
		},

		memberNum() {
			if (this.$store.state.group.groupId) {
				return this.$store.state.group.member.length;
			}
			return 0;
		},

		roomNum() {
			if (this.$store.state.rooms) {
				return this.$store.state.rooms.length;
			}
			return 1;
		},

		deviceNum() {
			return this.$store.state.device.length;
		},
	},
};
</script>

<style lang="scss" scoped>
.view-group-info {
	margin-bottom: 20px;

	&-item {
		width: 50%;
		height: 100px;

		@include flex-between();

		&-text {
			width: 60%;
			height: 100%;
			margin-left: 5%;
			color: rgba(48, 49, 51, 0.6);
			@include flex-around(column);
			align-items: flex-start;

			li {
				width: 100%;
				@include flex-center();

				i {
					width: 50%;
					@include ellipsis();
				}

				i:nth-of-type(1) {
					width: 80px;
					color: rgba(48, 49, 51, 1);
				}
			}
		}

		&-icon {
			height: 80px;
			width: 80px;
			margin-right: 5%;
			font-size: 36px;
			border-radius: 50%;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			background-color: rgba($color: #409eff, $alpha: 0.8);
			color: #fff;
			cursor: pointer;
			@include flex-center();
		}
	}

	&-item:nth-of-type(1) {
		border-right: 1px solid rgba(0, 0, 0, 0.1);
	}

	&-item:nth-last-of-type(1) {
		.view-group-info-item-icon {
			background-color: rgba($color: #909399, $alpha: 0.8);
		}
	}
}
</style>
