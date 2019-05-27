<template>
    <el-scrollbar class="drawer-associate"
                  v-loading="loading"
                  style="height:100%">
        <div class="drawer-associate-title">
            设备关联 - {{ title }}
        </div>
        <div class="drawer-associate-name item">
            <span class="item-title">
                关联名称
            </span>
            <el-form :model="data"
                     ref="Form"
                     :rules="rules"
                     label-width="0">
                <el-form-item prop="name">
                    <el-input placeholder="关联名称"
                              v-model="data.name"
                              :maxlength="8"
                              :minlength="2"
                              clearable>
                    </el-input>
                </el-form-item>
            </el-form>
        </div>
        <div class="drawer-associate-device item">
            <span class="item-title">
                选择设备
                <el-button class="refresh"
                           type="text"
                           icon="el-icon-refresh"
                           circle
                           @click="selectDevice">
                </el-button>
            </span>
            <div class="device"
                 v-if="device.deviceId">
                <div class="device-icon">
                    <svg-icon :iconClass="deviceIcon" />
                </div>
                <div class="device-info">
                    <span>
                        <i>
                            DeviceID
                        </i>
                        {{ device.deviceId }}
                    </span>
                    <span>
                        <i>
                            名称
                        </i>
                        {{ device.name }}
                    </span>
                    <span>
                        <i>
                            所在位置
                        </i>
                        {{ device.roomName }}
                    </span>
                </div>
            </div>
            <div class="select-device"
                 v-else>
                未选择设备，是否选择
                <el-button type="text"
                           @click="selectDevice">
                    设备
                </el-button>
            </div>
        </div>
        <div class="drawer-associate-attr">
            <span class="drawer-associate-attr-title">
                <i>属性设置</i>
                <el-dropdown class="drawer-associate-attr-title-button"
                             trigger="click"
                             placement="bottom"
                             :disabled="!attrItems.length"
                             @command="commandEvent">
                    <el-button type="text"
                               :disabled="!attrItems.length">
                        添加属性
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item, index) in attrItems"
                                          :key="index"
                                          :command="item.id">
                            {{ item.name }}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </span>
            <span v-if="!condition.name"
                  class="drawer-associate-attr-error">
                <svg-icon class="error-icon"
                          iconClass="icon-File-Error" />
                未设置属性
            </span>
            <span v-else
                  class="drawer-associate-attr-item">
                <i class="name">
                    {{ condition.name }}
                </i>
                <el-switch v-if="condition.el === 'switch'"
                           v-model="condition.value"
                           active-color="#13ce66"
                           inactive-color="#ff4949">
                </el-switch>
                <el-slider v-else-if="condition.el === 'slider'"
                           v-model="condition.value"
                           :step="condition.step"
                           :min="condition.min"
                           :max="item.max">
                </el-slider>
                <el-switch v-if="condition.el === 'flame'"
                           v-model="condition.value"
                           active-color="#13ce66"
                           inactive-color="#ff4949"
                           disabled>
                </el-switch>
                <el-radio-group v-if="condition.el === 'color'"
                                v-model="condition.value">
                    <el-radio-button :label="0">
                        白色
                    </el-radio-button>
                    <el-radio-button :label="1">
                        红色
                    </el-radio-button>
                    <el-radio-button :label="2">
                        绿色
                    </el-radio-button>
                    <el-radio-button :label="3">
                        蓝色
                    </el-radio-button>
                </el-radio-group>
                <span class="judge"
                      v-if="condition.el === 'judge'">
                    <el-select v-model="condition.judge"
                               placeholder="请选择">
                        <el-option v-for="item in options"
                                   :key="item.value"
                                   :label="item.label"
                                   :value="item.value">
                        </el-option>
                    </el-select>
                    <el-input-number v-model="condition.value"
                                     :min="condition.min"
                                     :max="condition.max">
                    </el-input-number>
                </span>
                <el-button class="delete"
                           icon="el-icon-close"
                           size="mini"
                           circle
                           @click="deleteCondition">
                </el-button>
            </span>
        </div>
        <div class="drawer-associate-btn">
            <el-button type="primary"
                       plain
                       @click="onSubmit('Form')">
                确定
            </el-button>
            <el-button plain
                       @click="onReset('Form')">
                重置
            </el-button>
        </div>
        <el-dialog class="app-dialog-group"
                   :visible.sync="visible"
                   :append-to-body="true"
                   title="选择设备"
                   width="1000px">
            <device-list :deviceId="editData.deviceId"
                         :type="type"
                         @getDevice="getDevice"
                         @onBack="onBack" />
        </el-dialog>
    </el-scrollbar>
</template>

<script>
import { setDeviceAssociate, updateDeviceAssociate } from '@/api/device';
import DeviceList from './deviceList';
import { DEVICEICON, ATTRS } from '@/config';

export default {
	name: 'DrawerAssociate',
	data() {
		return {
			loading: false,
			title: '触发设备',
			data: {
				name: '',
			},
			rules: {
				name: [
					{
						required: true,
						message: '请输入关联名称',
						trigger: 'blur',
					},
					{
						min: 3,
						max: 5,
						message: '长度在 3 到 5 个字符',
						trigger: 'blur',
					},
				],
			},
			options: [
				{
					value: 1,
					label: '大于',
				},
				{
					value: 2,
					label: '小于',
				},
				{
					value: 3,
					label: '等于',
				},
			],
			device: {},
			visible: false,
			condition: {},
			attrs: ATTRS,
			attrItems: [],
		};
	},

	computed: {
		deviceIcon() {
			const icon = DEVICEICON;
			if (!this.device.categoryItemId) {
				return '';
			}
			return icon[this.device.categoryItemId];
		},
	},

	methods: {
		onSubmit(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return;
				}
			});
			if (!this.device.deviceId || !this.condition.id) {
				this.$message({
					showClose: true,
					center: true,
					message: '信息不完整',
					type: 'warning',
				});
				return;
			}

			let data = {
				name: this.data.name,
			};
			if (this.type === 1) {
				data.condition = {
					deviceId: this.device.deviceId, // 设备 ID
					id: this.condition.id,
					value: this.condition.value,
				};
				if (this.condition.el === 'judge') {
					data.condition.judge = this.condition.judge;
				}
			} else if (this.type === 2) {
				data.expect = {
					deviceId: this.device.deviceId, // 设备 ID
					id: this.condition.id,
					value: this.condition.value,
				};
				if (this.condition.el === 'judge') {
					data.expect.judge = this.condition.judge;
				}
			}

			if (this.editData.associateId) {
				data.associateId = this.editData.associateId;
				data.type = this.type;
				this.updateDeviceAssociateFn(data);
			} else {
				this.setDeviceAssociateFn(data);
			}
		},

		// 重置
		onReset(formName) {
			this.$refs[formName].resetFields();
			this.data.name = '';
			this.device = {};
			this.condition = {};
		},

		// 设备列表返回
		onBack() {
			this.visible = false;
		},

		// 选择设备
		selectDevice() {
			this.visible = true;
		},

		// 获取设备数据
		getDevice(device) {
			this.device = device;
			this.visible = false;
			this.condition = {};
			this.statusInit(this.device.deviceId);
		},

		// attrItems 初始化
		statusInit(deviceId) {
			this.attrItems = [];
			Object.keys(this.$store.state.status[deviceId]).forEach(el => {
				this.attrItems.push(this.attrs.get(el));
			});
		},

		// 添加任务
		commandEvent(value) {
			const item = this.attrItems.find(el => el.id === value);
			this.condition = item;
		},

		// 删除条件
		deleteCondition() {
			this.condition = {};
		},

		// 添加关联
		setDeviceAssociateFn(data) {
			this.loading = true;
			setDeviceAssociate(data)
				.then(resData => {
					if (resData.ok) {
						this.$emit('getDeviceAssociate');
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

		// 更新
		updateDeviceAssociateFn(data) {
			this.loading = true;
			updateDeviceAssociate(data)
				.then(resData => {
					if (resData.ok) {
						this.$emit('getDeviceAssociate');
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
	},

	components: {
		DeviceList,
	},

	props: {
		editData: {
			type: Object,
		},

		type: {
			type: Number, // 1 触发 2 响应
		},
	},

	created() {
		if (!this.editData.associateId) {
			return;
		} else if (this.editData.device.deviceId) {
			const device = this.$store.state.device.find(
				el => el.deviceId === this.editData.device.deviceId
			);
			this.getDevice(device);
			this.commandEvent(this.editData.device.id);
			this.condition.value = this.editData.device.value;
		}
		this.data.name = this.editData.name;
		this.title = this.type === 1 ? '触发设备' : '响应设备';
	},
};
</script>

<style lang="scss">
.drawer-associate {
	&-title {
		padding-top: 20px;
		text-align: center;
		line-height: 60px;
		font-size: 20px;
	}

	.item {
		padding: 0 20px;
		&-title {
			display: block;
			padding: 20px 0;
			font-weight: bold;
			@include flex-between();
		}
	}

	&-device {
		padding: 0 20px;

		.device {
			height: 80px;
			padding: 10px 0;
			border: 1px solid #ebeef5;
			border-radius: 4px;
			position: relative;

			@include flex-between();

			&-icon {
				width: 30%;
				height: 100%;
				font-size: 64px;
				@include flex-center();
			}

			&-info {
				width: 70%;
				height: 100%;
				font-size: 14px;
				@include flex-around(column);

				span {
					display: block;
					width: 100%;
					color: #303133;

					i {
						display: inline-block;
						width: 80px;
						color: #909399;
					}
				}
			}
			.refresh {
				position: absolute;
				right: 20px;
			}
		}

		.select-device {
			height: 80px;
			line-height: 80px;
			text-align: center;
			font-size: 14px;
			color: #909399;
		}
	}

	&-attr {
		&-title {
			padding: 20px;
			font-weight: bold;
			@include flex-between();

			&-button {
				padding: 0 20px;
			}
		}
		&-error {
			height: 200px;
			color: #c0c4cc;
			@include flex-center();

			.error-icon {
				font-size: 48px;
				margin: 10px;
			}
		}

		&-item {
			height: 80px;
			border: 1px solid #e4e7ed;
			border-radius: 5px;
			margin: 20px 30px;
			position: relative;
			@include flex-start();

			.delete {
				position: absolute;
				right: -14px;
				top: -14px;
			}

			.name {
				width: 120px;
				display: block;
				padding-left: 50px;
			}

			.judge {
				.el-select {
					width: 100px;
					margin-right: 10px;
				}
				.el-input-number {
					width: 140px;
				}
			}

			.color {
				span {
					display: block;
					width: 25px;
					height: 25px;
					border-radius: 50%;
					padding: 5px;
					cursor: pointer;
				}
				span:nth-of-type(1) {
					background-image: radial-gradient(
						rgb(255, 254, 255) 10%,
						rgb(255, 253, 220) 100%
					);
				}

				span:nth-of-type(2) {
					background-image: radial-gradient(
						rgb(245, 108, 108) 10%,
						rgb(248, 179, 179) 100%
					);
				}
				span:nth-of-type(3) {
					background-image: radial-gradient(
						rgb(103, 194, 58) 10%,
						rgb(151, 200, 127) 100%
					);
				}
				span:nth-of-type(4) {
					background-image: radial-gradient(
						rgb(64, 158, 255) 10%,
						rgb(140, 197, 235) 100%
					);
				}
			}

			.el-slider {
				width: 180px;
			}

			.button {
				text-align: center;
				line-height: 100%;
			}
		}

		&-button {
			margin: 10px 20px;
			@include flex-center();
		}
	}

	&-content {
		height: 320px;
	}

	&-btn {
		padding-top: 30px;
		@include flex-center();
	}
}
</style>
