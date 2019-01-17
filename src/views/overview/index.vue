<template>
    <el-card class="overview"
             shadow="never">
        <el-row :gutter="24">
            <el-col :span="6"
                    v-for="(item, index) in device"
                    :key="index">
                <ceiling-lamp :device="item" />
            </el-col>
            <router-view />
        </el-row>
    </el-card>
</template>

<script>
import CeilingLamp from '@/components/lighting';

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
		CeilingLamp,
	},
};
</script>

<style lang="scss" scoped>
.overview {
	width: 100%;
	min-height: 600px;
	background-color: inherit;
}
</style>
