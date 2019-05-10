<template>
    <div>
        <el-row class="overview"
                :gutter="12">
            <el-col class="item"
                    :sm="8"
                    :md="6"
                    :lg="6"
                    :xl="4"
                    v-for="(item, index) in device"
                    :key="index">
                <app-ceiling-lamp :device="item" />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import AppCeilingLamp from '@/components/appLighting/appCeilingLamp';

export default {
	name: 'Overview', // 设备概览
	data() {
		return {
			switch: false,
			luminance: 0,
		};
	},

	computed: {
		device() {
			return this.$store.state.device;
		},
	},

	methods: {},

	components: {
		AppCeilingLamp,
	},
};
</script>

<style lang="scss" scoped>
.overview {
	width: 100%;
	height: 100%;
	// padding: 0 40px;
	// min-height: 600px;

	.item {
		padding-bottom: 24px;
		// 	margin-top: 20px;
	}
}
</style>
