<template>
    <div class="device">
        <el-row :gutter="24">
            <el-col :span="8"
                    v-for="(item, index) in device"
                    :key="index">
                <ceiling-lamp :device="item" />
            </el-col>
            <!-- <el-col :span="8">
                <el-card class="box-card">
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="box-card">
                </el-card>
            </el-col> -->
        </el-row>
        <router-view />
    </div>
</template>

<script>
import CeilingLamp from '@/components/lighting';
export default {
	name: 'Device', // 设备概览
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
.device {
	width: 100%;
	height: 100%;
	position: relative;
}
</style>
