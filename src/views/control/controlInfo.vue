<template>
    <el-card class="control-info"
             body-style="display: flex;
             justify-content: space-between;
             alignItems: center">
        <div class="control-info-left">
            <span class="control-info-left-title">
                设备列表
            </span>
            <!-- <span class="control-info-left-num">
                设备总数：{{ deviceNum }}
            </span> -->
        </div>
        <div class="control-info-right">
            <el-button type="primary"
                       icon="el-icon-plus"
                       @click="routeAccess">
                添加设备
            </el-button>
        </div>
    </el-card>
</template>

<script>
export default {
	name: 'ControlInfo',
	data() {
		return {};
	},

	computed: {
		deviceNum() {
			return this.$store.state.device.length;
		},
	},

	methods: {
		// 设备接入
		routeAccess() {
			this.$router.push({ name: 'access' });
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.control-info {
	margin-bottom: 10px;

	&-left {
		height: 60px;
		@include flex-around(column);
		align-items: flex-start;

		&-title {
			font-size: 18px;
			padding: 10px 0;
		}

		&-num {
			padding: 10px 0;
			border-top: 1px solid #ebeef5;
			font-size: 14px;
			color: #909399;
		}
	}
}
</style>

