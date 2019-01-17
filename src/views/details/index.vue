<template>
    <el-card class="details"
             shadow="never">
        <details-lighting :device="device" />
    </el-card>
</template>

<script>
import DetailsLighting from './DetailsLighting';

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
		DetailsLighting,
	},

	created() {
		this.getRouteData();
	},
};
</script>

<style lang="scss" scoped>
.details {
	width: 100%;
	min-height: 600px;
	min-width: 1000px;
	background-color: inherit;
}
</style>
