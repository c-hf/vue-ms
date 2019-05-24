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
                <component :is="item.categoryItemId"
                           :device="item"></component>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import CeilingLamp from '@/components/appLighting/ceilingLamp';
import TableLamp from '@/components/appLighting/tableLamp';
import LEDLamp from '@/components/appLighting/lEDLamp';

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
		TableLamp,
		LEDLamp,
	},
};
</script>

<style lang="scss" scoped>
.overview {
	width: 100%;
	height: 100%;

	.item {
		padding-bottom: 24px;
	}
}
</style>
