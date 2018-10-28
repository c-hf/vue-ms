<template>
    <div class="access-information">
        <el-row>
            <el-col :span="24">
                <el-card class="device-list">
                    <div slot="header"
                         class="clearfix">
                        <span>设备信息</span>
                    </div>
                    <el-form ref="deviceForm"
                             :model="device"
                             :rules="rules"
                             label-position="left"
                             label-width="10%">

                        <el-form-item label="DeviceID:"
                                      class="device-id">
                            <el-col :span="8">
                                <span class="device-id">{{ device.id }}</span>
                            </el-col>
                            <el-col :span="2"
                                    :offset="0">
                                <el-button icon="el-icon-refresh"
                                           size="mini"
                                           :loading="loading"
                                           circle></el-button>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="设备名称:"
                                      prop="name">
                            <el-col :span="8">
                                <el-input v-model="device.name"
                                          placeholder="最多输入 16 个字符"></el-input>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="设备类型:"
                                      prop="type">
                            <el-cascader :options="options"
                                         :show-all-levels="false"
                                         v-model="device.type"></el-cascader>
                        </el-form-item>

                        <el-form-item label="设备描述:"
                                      prop="desc">
                            <el-col :span="8">
                                <el-input type="textarea"
                                          :autosize="{ minRows: 4, maxRows: 6}"
                                          v-model="device.desc"></el-input>
                            </el-col>
                        </el-form-item>

                        <el-form-item label="操作系统"
                                      prop="os">
                            <el-radio-group v-model="device.os">
                                <el-radio label="Linux"></el-radio>
                                <el-radio label="Android"
                                          disabled></el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="联网方式"
                                      prop="networking">
                            <el-radio-group v-model="device.networking">
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
                            <el-col :span="4">
                                <el-select v-model="device.protocol"
                                           @change="setProtocol"
                                           placeholder="请选择">
                                    <el-option label="HTTP"
                                               value="HTTP"></el-option>
                                    <el-option label="MQTT"
                                               value="MQTT"></el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="8"
                                    :offset="1">
                                <div class="device-protocol"
                                     v-show="device.protocol">
                                    <h5>{{ device.protocol }} 基本功能：</h5>
                                    <span>{{ protocolIntro }}</span>
                                </div>
                            </el-col>
                        </el-form-item>

                        <el-form-item>
                            <el-button type="primary"
                                       @click="submitForm('deviceForm')">下一步</el-button>
                            <el-button @click="resetForm('deviceForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { RULES, OPTIONS } from './config.js';

export default {
	name: 'AccessInformation',
	data() {
		return {
			// 表单信息
			device: {
				id: 'AKFIEOCJHaks48vc56',
				name: '',
				type: [],
				desc: '',
				os: 'Linux',
				networking: 'wifi',
				protocol: '',
			},
			// 验证规则
			rules: RULES,
			// 数据源
			options: OPTIONS,
			protocolIntro: '',
			loading: false,
			custom: false,
		};
	},
	methods: {
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
					this.$emit('infoSubmit', this.device, this.custom);
				} else {
					return false;
				}
			});
		},
		// 重置按钮事件
		resetForm(formName) {
			this.$refs[formName].resetFields();
		},
	},
};
</script>

<style lang="scss" scoped>
.access-information {
	.el-form {
		width: 100%;
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
