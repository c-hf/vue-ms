<template>
    <div class="app-timed-task-task">
        <span class="app-timed-task-task-title">
            任务设置
        </span>
        <span class="app-timed-task-task-item">
            <i>开关</i>
            <el-switch v-model="data.switch"
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
        </span>
        <span class="app-timed-task-task-item">
            <i>亮度</i>
            <el-slider v-model="data.luminance"
                       :step="10"
                       :min="10"
                       :disabled="!data.switch">
            </el-slider>
        </span>
    </div>
</template>

<script>
export default {
	name: 'CeilingLamp',
	data() {
		return {
			data: {
				switch: false,
				luminance: 100,
			},
		};
	},
};
</script>

<style lang="scss" scoped>
</style>
