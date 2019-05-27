<template>
    <div class="associate-info">
        <div class="associate-info-left">
            <span class="title">
                设备关联列表
            </span>
        </div>
    </div>
</template>

<script>
export default {
	name: 'AssociateInfo',
	data() {
		return {};
	},
};
</script>

<style lang="scss" scoped>
.associate-info {
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

