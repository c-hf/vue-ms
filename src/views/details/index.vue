<template>
    <div class="details">
        <view-lighting :device="device" />
    </div>
</template>

<script>
import ViewLighting from './viewLighting';

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
		ViewLighting,
	},

	created() {
		this.getRouteData();
	},
};
</script>

<style lang="scss" scoped>
.details {
	width: 100%;
	background-color: inherit;
}
</style>
