<template>
    <div class="contextualModel-info">
        <div class="contextualModel-info-left">
            <span class="title">
                模式列表
            </span>
        </div>
        <div class="contextualModel-info-right">
            <el-button type="primary"
                       icon="el-icon-plus"
                       size="medium"
                       @click="addMode">
                添加模式
            </el-button>
        </div>
    </div>
</template>

<script>
export default {
	name: 'ContextualModelInfo',
	data() {
		return {};
	},

	methods: {
		addMode() {
			this.$emit('addMode');
		},
	},
};
</script>

<style lang="scss" scoped>
.contextualModel-info {
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

