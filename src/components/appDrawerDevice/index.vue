<template>
    <el-scrollbar style="height:100%;">
        <div class="app-drawer-device">
            <div class="app-drawer-device-title">
                设备信息修改
            </div>
            <el-form class="app-drawer-device-form"
                     ref="deviceForm"
                     :model="data"
                     :rules="rules"
                     label-position="left"
                     label-width="120px">
                <el-form-item label="DeviceID"
                              prop="deviceId">
                    {{ data.deviceId }}
                </el-form-item>
                <el-form-item label="设备类型"
                              prop="name">
                    {{ data.categoryItemName }}
                </el-form-item>
                <el-form-item label="设备名称"
                              prop="name">
                    {{ data.name }}
                </el-form-item>
                <el-form-item label="设备所在房间"
                              prop="roomId">
                    <el-select v-model="data.roomId"
                               placeholder="请选择">
                        <el-option v-for="(item,index) in roomOptions"
                                   :key="index"
                                   :label="item.name"
                                   :value="item.roomId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备描述"
                              prop="desc">
                    <el-input type="textarea"
                              :autosize="{ minRows: 4, maxRows: 6}"
                              v-model="data.desc">
                    </el-input>
                </el-form-item>
                <el-form-item label="操作系统"
                              prop="os">
                    <el-radio-group v-model="data.os">
                        <el-radio label="Linux">
                        </el-radio>
                        <el-radio label="Android"
                                  disabled>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="联网方式"
                              prop="networking">
                    <el-radio-group v-model="data.networking">
                        <el-radio label="wifi">
                        </el-radio>
                        <el-radio label="移动蜂窝网络"
                                  disabled>
                        </el-radio>
                        <el-radio label="NB-IoT"
                                  disabled>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="设备接入协议"
                              prop="protocol">
                    <el-select v-model="data.protocol"
                               placeholder="请选择">
                        <el-option label="MQTT"
                                   value="MQTT">
                        </el-option>
                        <el-option label="HTTP"
                                   value="HTTP">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               @click="submit('deviceForm')">
                        保存
                    </el-button>
                    <el-button @click="goBack">
                        返回
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </el-scrollbar>
</template>

<script>
import { getDeviceInfo, updateDevice } from '@/api/device';
import { DEVICERULES } from '@/config';

export default {
	name: 'AppDrawerDevice',
	data() {
		return {
			rules: DEVICERULES,
			data: {
				groupId: '',
				deviceId: '',
				name: '',
				roomId: '',
				categoryItemName: '',
				desc: '',
				networking: 'wifi',
				os: 'Linux',
				protocol: '',
			},
		};
	},

	computed: {
		roomOptions() {
			return this.$store.state.rooms;
		},
	},

	methods: {
		// 提交
		submit(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.updateDeviceFn(this.data);
				} else {
					return false;
				}
			});
		},

		// 返回
		goBack() {
			this.$emit('setShow', false);
		},

		// 获取设备信息封装
		getDeviceInfoFn() {
			this.loading = true;
			getDeviceInfo({
				deviceId: this.deviceId,
			})
				.then(resData => {
					if (resData.deviceId) {
						this.data = resData;
					}
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

		// 更新设备信息
		updateDeviceFn(data) {
			this.loading = true;
			updateDevice(data)
				.then(resData => {
					this.data = resData;
					this.$message({
						showClose: true,
						center: true,
						message: '保存成功！',
						type: 'success',
					});
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
	},

	props: {
		deviceId: {
			type: String,
		},
	},

	created() {
		this.getDeviceInfoFn();
	},
};
</script>

<style lang="scss" scoped>
.app-drawer-device {
	padding: 20px;
	@include flex-start(column);

	&-title {
		margin-top: 20px;
		padding: 10px;
		color: #303133;
		font-size: 20px;
		border-bottom: 1px solid #ebeef5;
	}

	&-form {
		margin-top: 20px;
	}
}
</style>
