<template>
    <el-scrollbar class="drawer-associate"
                  style="height:100%">
        <div class="drawer-associate-title">
            设备关联 - {{ title }}
        </div>
        <div class="drawer-associate-name item">
            <span class="item-title">
                关联名称
            </span>
            <el-input placeholder="关联名称"
                      v-model="data.name"
                      :maxlength="8"
                      :minlength="2"
                      clearable>
            </el-input>
        </div>
        <div class="drawer-associate-device item">
            <span class="item-title">
                选择设备
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
                           :min="condition.min">
                </el-slider>
                <el-button class="delete"
                           icon="el-icon-close"
                           size="mini"
                           circle>
                </el-button>
            </span>
        </div>
        <div class="drawer-associate-btn">
            <el-button type="primary"
                       plain
                       @click="onSubmit">
                确定
            </el-button>
            <el-button plain>
                重置
            </el-button>
        </div>
        <el-dialog class="app-dialog-group"
                   :visible.sync="visible"
                   :append-to-body="true"
                   title="选择设备"
                   width="1000px">
            <device-list @getDevice="getDevice" />
        </el-dialog>
    </el-scrollbar>
</template>

<script>
import { setDeviceAssociate } from '@/api/device';
import DeviceList from './deviceList';
import { DEVICEICON } from '@/config';
import { ATTRS } from '../config';

export default {
	name: 'DrawerAssociate',
	data() {
		return {
			loading: false,
			title: '触发设备',
			data: {
				name: '',
			},
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
		onSubmit() {
			// console.log(this.data, this.device, this.condition);
			const data = {
				deviceId: this.device.deviceId, // 设备 ID
				condition: {
					id: this.condition.id,
					value: this.condition.value,
				},
			};
			this.setDeviceAssociateFn(data);
		},

		// 选择设备
		selectDevice() {
			this.visible = true;
		},

		// 获取设备数据
		getDevice(device) {
			this.device = device;
			this.visible = false;
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

		// 添加关联
		setDeviceAssociateFn(data) {
			this.loading = true;
			setDeviceAssociate(data)
				.then(resData => {
					console.log(resData);
				})
				.then(() => {
					this.loading = false;
				});
		},
	},

	components: {
		DeviceList,
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
		}
	}

	&-device {
		padding: 0 20px;

		.device {
			height: 80px;
			padding: 10px 0;
			border: 1px solid #ebeef5;
			border-radius: 4px;

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
