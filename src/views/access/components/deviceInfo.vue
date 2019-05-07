<template>
    <el-card class="view-device-info"
             v-loading="loading">
        <div slot="header"
             class="view-device-info-header">
            <el-button type="text"
                       icon="el-icon-arrow-left"
                       @click="goBack">
                返回
            </el-button>
            <span>设备信息</span>
        </div>
        <el-form ref="deviceForm"
                 :model="deviceData"
                 :rules="rules"
                 label-position="left"
                 label-width="120px">
            <el-form-item label="家庭组 ID"
                          prop="groupId"
                          class="group-id">
                <el-col :lg="8"
                        :md="10"
                        :span="14">
                    <span class="group-id">
                        {{ deviceData.groupId }}
                    </span>
                </el-col>
            </el-form-item>
            <el-form-item label="DeviceID"
                          prop="deviceId">
                <el-col :lg="8"
                        :md="10"
                        :span="14">
                    <span class="device-id">
                        {{ deviceData.deviceId }}
                    </span>
                </el-col>
                <el-col :span="2">
                    <el-button icon="el-icon-refresh"
                               size="mini"
                               :loading="getIdLoading"
                               @click="getId"
                               circle>
                    </el-button>
                </el-col>
            </el-form-item>
            <el-form-item label="设备类型"
                          prop="type">
                <el-col :lg="8"
                        :md="8"
                        :span="14">
                    <el-cascader :options="options"
                                 :show-all-levels="true"
                                 v-model="deviceData.type"
                                 @change="typeChange">
                    </el-cascader>
                </el-col>
            </el-form-item>
            <el-form-item label="设备名称"
                          prop="name">
                <el-col :lg="8"
                        :md="10"
                        :span="14">
                    {{ deviceData.name }}
                </el-col>
            </el-form-item>
            <el-form-item label="设备所在房间"
                          prop="roomId">
                <el-col :lg="8"
                        :md="10"
                        :span="14">
                    <el-select v-model="deviceData.roomId"
                               placeholder="请选择">
                        <el-option v-for="(item,index) in roomOptions"
                                   :key="index"
                                   :label="item.name"
                                   :value="item.roomId">
                        </el-option>
                    </el-select>
                </el-col>
            </el-form-item>
            <el-form-item label="设备描述"
                          prop="desc">
                <el-col :lg="8"
                        :md="10"
                        :span="14">
                    <el-input type="textarea"
                              :autosize="{ minRows: 4, maxRows: 6}"
                              v-model="deviceData.desc">
                    </el-input>
                </el-col>
            </el-form-item>
            <el-form-item label="操作系统"
                          prop="os">
                <el-radio-group v-model="deviceData.os">
                    <el-radio label="Linux">
                    </el-radio>
                    <el-radio label="Android"
                              disabled>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="联网方式"
                          prop="networking">
                <el-radio-group v-model="deviceData.networking">
                    <el-radio label="wifi"></el-radio>
                    <el-radio label="移动蜂窝网络"
                              disabled></el-radio>
                    <el-radio label="NB-IoT"
                              disabled>
                    </el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="设备接入协议"
                          prop="protocol">
                <el-col :lg="4"
                        :md="6"
                        :span="10">
                    <el-select v-model="deviceData.protocol"
                               @change="setProtocol"
                               placeholder="请选择">
                        <el-option label="MQTT"
                                   value="MQTT">
                        </el-option>
                        <el-option label="HTTP"
                                   value="HTTP">
                        </el-option>
                    </el-select>
                </el-col>
                <el-col :lg="12"
                        :md="16"
                        :span="23"
                        :offset="0">
                    <div class="device-protocol"
                         v-show="deviceData.protocol">
                        <h5>{{ deviceData.protocol }} 基本功能：</h5>
                        <span>{{ protocolIntro }}</span>
                    </div>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button type="primary"
                           @click="submitForm('deviceForm')">
                    下一步
                </el-button>
                <el-button @click="resetForm('deviceForm')">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import {
	INFORMATION_DATA_KEY,
	CATEGORY_CONTENT_UPDATE_TIME_INTERVAL,
} from '../config.js';
import { DEVICERULES } from '@/config';

import { getAllDeviceCategory, getDeviceId } from '@/api/device';
import storage from '@/assets/js/storage';

export default {
	name: 'ViewDeviceInfo',
	data() {
		return {
			deviceData: this.data,
			rules: DEVICERULES,
			options: [], // 数据源
			protocolIntro: '',
			loading: false,
			getIdLoading: false,
			custom: false,
		};
	},

	computed: {
		roomOptions() {
			return this.$store.state.rooms;
		},
	},

	methods: {
		typeChange(value) {
			this.options.forEach((el, index) => {
				if (el.value === value[0]) {
					this.deviceData.name = this.options[index].children.find(
						el => {
							return el.value === value[1];
						}
					).label;
				}
			});
		},

		goBack() {
			this.$router.push({ name: 'control' });
		},

		// 获取设备id
		getId() {
			this.getIdLoading = true;
			getDeviceId()
				.then(resData => {
					this.deviceData.deviceId = resData.deviceId;
					this.getIdLoading = false;
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					this.getIdLoading = false;
				});
		},

		// 获取分组 ID
		getGroupId() {
			if (this.$store.state.user.groupId) {
				this.deviceData.groupId = this.$store.state.user.groupId;
				return;
			}
		},

		// 获取设备分类
		getInfo() {
			this.loading = true;
			let [contents = {}, id, updateTime] = [
				storage.get(INFORMATION_DATA_KEY),
				this.$store.state.user.userId,
				'',
			];

			const curTime = new Date().getTime(); // 获取当前时间
			if (contents && contents[id]) {
				updateTime = contents[id].updateTime || 0;

				if (
					curTime - updateTime <=
					CATEGORY_CONTENT_UPDATE_TIME_INTERVAL
				) {
					// localstorage
					this.options = contents[id].data;
					this.loading = false;
				} else {
					// HTTP
					this.getInfoByHttp(id, contents, curTime);
				}
			} else {
				// HTTP
				this.getInfoByHttp(id, contents, curTime);
			}
		},

		// http获取设备分类
		getInfoByHttp(id, contents, updateTime) {
			getAllDeviceCategory()
				.then(data => {
					this.setOptions(data);
					this.updateLocalStorage(id, contents, updateTime);
					this.loading = false;
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					this.loading = false;
				});
		},

		// 更新本地缓存
		updateLocalStorage(id, contents, curTime) {
			contents = contents || {};
			contents[id] = {};
			contents[id].data = this.options;
			contents[id].updateTime = curTime;
			storage.set(INFORMATION_DATA_KEY, contents);
		},

		// 设置 intro 信息
		setProtocol(value) {
			if (value === 'MQTT') {
				this.protocolIntro =
					'1、上传设备状态信息    2、订阅自定义TOPIC    3、接收实时消息或离线消息';
			} else if (value === 'HTTP') {
				this.protocolIntro = '1、上传设备状态信息';
			}
		},

		// 提交按钮事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$emit('infoSubmit', this.deviceData, this.custom);
				} else {
					return false;
				}
			});
		},

		// 重置按钮事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},

		// 设置 options
		setOptions(data) {
			data.forEach(el => {
				let optionItem = {};
				optionItem.value = el.categoryId;
				optionItem.label = el.name;
				optionItem.children = [];
				el.categoryItem.forEach(el => {
					let childrenItem = {};
					childrenItem.value = el.categoryItemId;
					childrenItem.label = el.name;
					optionItem.children.push(childrenItem);
				});
				this.options.push(optionItem);
			});
		},
	},

	props: {
		data: {
			type: Object,
		},
	},

	created() {
		this.getId();
		this.getInfo();
		this.getGroupId();
	},

	mounted() {
		this.setProtocol(this.deviceData.protocol);
	},
};
</script>

<style lang="scss" scoped>
.view-device-info {
	width: 100%;

	&-header {
		@include flex-between();
	}

	.el-form {
		padding-left: 10%;

		.device-id {
			width: 100%;
			display: block;
			.el-button {
				margin-left: 10px;
			}
		}

		.device-protocol {
			height: 40px;
			display: flex;
			flex-direction: column;
			margin-left: 20px;

			h5 {
				height: 50%;
				line-height: 20px;
			}
			span {
				height: 50%;
				display: block;
				font-size: 10px;
				line-height: 20px;
			}
		}
	}
}
</style>
