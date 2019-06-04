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
import CeilingLamp from '@/components/appDevice/ceilingLamp';
import TableLamp from '@/components/appDevice/tableLamp';
import LEDLamp from '@/components/appDevice/lEDLamp';
import AirFan from '@/components/appDevice/airFan';
import Alarm from '@/components/appDevice/alarm';
import HumidityTemperatureSensor from '@/components/appDevice/humidityTemperatureSensor';
import FlameSensor from '@/components/appDevice/flameSensor';
import LightIntensitySensor from '@/components/appDevice/lightIntensitySensor';
import Car from '@/components/appDevice/car';
// car

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
		AirFan,
		Alarm,
		HumidityTemperatureSensor,
		FlameSensor,
		LightIntensitySensor,
		Car,
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
