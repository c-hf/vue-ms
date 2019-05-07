<template>
    <div>
        <el-row class="access"
                shadow="never"
                v-loading="loading">
            <el-col :span="24"
                    v-if="info">
                <view-device-info :data="data"
                                  @infoSubmit="infoSubmit" />
            </el-col>
            <el-col :span="24"
                    v-else>
                <view-device-param :data="data"
                                   :custom="custom"
                                   :deviceParam="deviceParam"
                                   :deviceAttr="deviceAttr"
                                   @showInfo="showInfo"
                                   @setLoading="setLoading" />
            </el-col>
        </el-row>
    </div>
</template>

<script>
import ViewDeviceInfo from './components/deviceInfo';
import ViewDeviceParam from './components/deviceParam';

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
		ViewDeviceInfo,
		ViewDeviceParam,
	},
};
</script>

<style lang="scss" scoped>
.access {
	width: 100%;
}
</style>
