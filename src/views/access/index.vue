<template>
    <div class="access"
         v-loading="loading">

        <access-device-info @infoSubmit="infoSubmit"
                            :data="data"
                            v-if="info" />
        <access-device-param v-else
                             @showInfo="showInfo"
                             @setLoading="setLoading"
                             :data="data"
                             :custom="custom"
                             :deviceParam="deviceParam"
                             :deviceAttr="deviceAttr" />
    </div>
</template>

<script>
import AccessDeviceInfo from './deviceInfo';
import AccessDeviceParam from './deviceParam';

import { getDeviceParamAndAttrById } from '@/api/device';

export default {
	name: 'DeviceAccess',
	data() {
		return {
			loading: false,
			info: true,
			custom: false,
			data: {
				deviceId: '',
				name: '',
				type: [],
				desc: '',
				os: 'Linux',
				networking: 'wifi',
				protocol: '',
			},
			deviceParam: [],
			deviceAttr: [],
		};
	},
	methods: {
		// 设备信息提交，进入下一步
		infoSubmit(data, custom) {
			this.loading = true;
			getDeviceParamAndAttrById(data.type[1])
				.then(resData => {
					this.data = data;
					this.custom = custom;
					if (resData.categoryItemId) {
						this.deviceParam = resData.param;
						this.deviceAttr = resData.attr;
					}
					this.info = false;
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				})
				.then(() => {
					this.loading = false;
				});
		},

		// 返回上一步
		showInfo() {
			this.info = true;
		},

		// loading
		setLoading(load) {
			this.loading = load;
		},
	},
	components: {
		AccessDeviceInfo,
		AccessDeviceParam,
	},
};
</script>

<style lang="scss" scoped>
.access {
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
	background-color: #f3f6f8;
	padding-bottom: 200px;
}
</style>
