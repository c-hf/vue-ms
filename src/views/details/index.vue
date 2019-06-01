<template>
    <div class="details">
        <component v-if="device"
                   :is="device.categoryItemId"
                   :device="device"
                   :deviceId="deviceId">
        </component>
    </div>
</template>

<script>
import CeilingLamp from './components/deviceCeilingLamp';
import LEDLamp from './components/deviceLEDLamp';
import TableLamp from './components/deviceTableLamp';
import Alarm from './components/deviceAlarm';
import AirFan from './components/deviceAirFan';
import HumidityTemperatureSensor from './components/deviceHumidityTemperatureSensor';
import FlameSensor from './components/deviceFlameSensor';
import LightIntensitySensor from './components/deviceLightIntensitySensor';

export default {
	name: 'Details',
	data() {
		return {
			deviceId: '',
			deviceName: '',
		};
	},

	computed: {
		device() {
			return this.$store.state.device.find(
				el => el.deviceId === this.deviceId
			);
		},
	},

	methods: {
		// 获取路由数据
		getRouteData() {
			this.deviceId = this.$route.params.deviceId;
			this.deviceName = this.$route.query.name;
		},
	},

	components: {
		CeilingLamp,
		LEDLamp,
		TableLamp,
		Alarm,
		AirFan,
		HumidityTemperatureSensor,
		FlameSensor,
		LightIntensitySensor,
	},

	created() {
		this.getRouteData();
	},
};
</script>

<style lang="scss" scoped>
.details {
	background-color: inherit;
	padding-top: 20px;

	@include flex-direction();
}
</style>
