<template>
    <div class="control-info">
        <div class="control-info-left">
            <span class="title">
                设备列表
            </span>
        </div>
        <div class="control-info-right">
            <el-button type="primary"
                       icon="el-icon-plus"
                       size="medium"
                       @click="routeAccess">
                添加设备
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
	name: 'ControlInfo',
	data() {
		return {};
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
.control-info {
	padding: 20px;
	margin-bottom: 20px;
	@include info-card();
	@include flex-between();

	&-left {
		height: 40px;
		line-height: 40px;

		&-num {
			padding: 10px 0;
			border-top: 1px solid #ebeef5;
			font-size: 14px;
			color: #909399;
		}
	}
}
</style>

