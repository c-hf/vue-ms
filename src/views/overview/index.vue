<template>
    <div class="overview">
        <el-row :gutter="24">
            <el-col :span="8"
                    v-for="(item, index) in device"
                    :key="index">
                <ceiling-lamp :device="item" />
            </el-col>
        </el-row>
        <router-view />
    </div>
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
	methods: {
		off() {},
	},
	components: {
		CeilingLamp,
	},
};
</script>

<style lang="scss" scoped>
.overview {
	width: 100%;
}
</style>
