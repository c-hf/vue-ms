<template>
    <div>
        <el-row class="overview"
                :gutter="24">
            <el-col :span="6"
                    :sm="8"
                    :lg="6"
                    :xl="4"
                    v-for="(item, index) in device"
                    :key="index">
                <app-ceiling-lamp :device="item" />
            </el-col>
            <router-view />
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
	min-height: 600px;
}
</style>
