<template>
    <div class="relevance-info">
        <div class="relevance-info-left">
            <span class="title">
                设备关联列表
            </span>
        </div>
        <div class="relevance-info-right">
            <el-button type="primary"
                       icon="el-icon-plus"
                       size="medium"
                       @click="routeAccess">
                添加关联
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
	name: 'RelevanceInfo',
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
.relevance-info {
	padding: 20px;
	margin-bottom: 20px;
	@include info-card();
	@include flex-between();

	&-left {
		height: 40px;
		line-height: 40px;
	}
}
</style>

