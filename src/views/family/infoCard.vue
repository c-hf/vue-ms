<template>
    <el-card class="family-info-card"
             :body-style="{display: 'flex',
                     'align-items': 'center',
                     'justify-content':'space-around'}">
        <div class="family-info-card-item">
            <ul class="family-info-card-item-text">
                <li>
                    <i>家庭组 ID</i>
                    <i>{{groupId}}</i>
                </li>
                <li>
                    <i>家庭成员</i>
                    <i>{{memberNum}}</i>
                </li>
            </ul>
            <span class="family-info-card-item-icon">
                <svg-icon iconClass="icon-group" />
            </span>
        </div>
        <div class="family-info-card-item">
            <ul class="family-info-card-item-text">
                <li>
                    <i>房间</i>
                    <i>{{roomNum}}</i>
                </li>
                <li>
                    <i>设备</i>
                    <i>{{deviceNum}}</i>
                </li>
            </ul>
            <span class="family-info-card-item-icon">
                <svg-icon iconClass="icon-homepage" />
            </span>
        </div>
    </el-card>
</template>

<script>
export default {
	name: 'FamilyInfoCard',
	data() {
		return {};
	},
	computed: {
		groupId() {
			return this.$store.state.group.groupId;
		},
		memberNum() {
			if (this.$store.state.group.groupId) {
				return this.$store.state.group.member.length;
			}
			return 1;
		},
		roomNum() {
			if (this.$store.state.rooms) {
				return this.$store.state.rooms.length;
			}
			return 1;
		},
		deviceNum() {
			if (this.$store.state.device) {
				return this.$store.state.device.length;
			}
			return 0;
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.family-info-card {
	margin-bottom: 20px;

	&-item {
		width: 50%;
		height: 100px;

		@include flex-around();

		&-text {
			height: 100%;
			color: rgba(48, 49, 51, 0.6);

			@include flex-around(column);
			align-items: flex-start;

			li {
				@include flex-center();
				i {
					display: flex;
				}
				i:nth-of-type(1) {
					width: 100px;
					color: rgba(48, 49, 51, 1);
				}
			}
		}

		&-icon {
			height: 80px;
			width: 80px;
			font-size: 36px;
			border-radius: 50%;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			background-color: rgba($color: #409eff, $alpha: 0.8);
			color: #fff;
			@include flex-center();
		}
	}

	&-item:nth-of-type(1) {
		border-right: 1px solid rgba(0, 0, 0, 0.1);
	}

	&-item:nth-last-of-type(1) {
		.family-info-card-item-icon {
			background-color: rgba($color: #909399, $alpha: 0.8);
		}
	}
}
</style>
