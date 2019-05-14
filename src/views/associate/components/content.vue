<template>
    <el-row class="associate-content"
            :gutter="24">
        <el-col class="item"
                :sm="8"
                :md="8"
                :lg="8"
                :xl="6"
                v-for="(item, index) in list"
                :key="index">
            <div class="item-content">
                <div class="item-content-title">
                    设备关联
                    <el-button type="danger"
                               icon="el-icon-delete"
                               circle
                               size="medium"
                               @click="deleteAssociate(item.associateId)">
                    </el-button>
                </div>
                <div class="item-content-icon"
                     :class="{active: item.open}">
                    <span class="device"
                          @click="updateAssociate(item, 1)">
                        <svg-icon v-if="item.condition.deviceId"
                                  :iconClass="icons[item.condition.categoryItemId]" />
                        <i v-else
                           class="el-icon-plus"></i>
                    </span>
                    <span class="associate"
                          :class="{active: item.open, 'not-allowed': !item.expect.deviceId}"
                          @click="openAssociate(item)">
                        <el-tooltip class="item"
                                    effect="dark"
                                    placement="top-start">
                            <i v-if="item.open"
                               slot="content">
                                已激活
                            </i>
                            <i v-else-if="!item.expect.deviceId"
                               slot="content">
                                禁止激活
                            </i>
                            <i v-else
                               slot="content">
                                未激活
                            </i>
                            <svg-icon iconClass="icon-guanlian1" />
                        </el-tooltip>
                    </span>
                    <span class="device"
                          @click="updateAssociate(item, 2)">
                        <svg-icon v-if="item.expect.deviceId"
                                  :iconClass="icons[item.expect.categoryItemId]" />
                        <i v-else
                           class="el-icon-plus"></i>
                    </span>
                </div>
                <div class="item-content-info">
                    <span>
                        <i>
                            {{ item.condition.deviceName }}
                        </i>
                        <i>
                            {{ item.condition.roomName }}
                        </i>
                    </span>
                    <span>
                        <i>
                            {{ item.expect.deviceName }}
                        </i>
                        <i>
                            {{ item.expect.roomName }}
                        </i>
                    </span>
                </div>
                <!-- <div class="item-content-btn">
                    <span class="item">
                        <i>消息通知</i>
                        <el-switch style="display: block"
                                   v-model="item.notice"
                                   active-color="#13ce66"
                                   inactive-color="#ff4949">
                        </el-switch>
                    </span>
                </div> -->
            </div>
        </el-col>
        <el-col class="item"
                :sm="8"
                :md="8"
                :lg="8"
                :xl="6">
            <div class="add-item"
                 @click="addAssociate">
                <i class="el-icon-plus"></i>
            </div>
        </el-col>
    </el-row>
</template>


<script>
import {
	getDeviceAssociate,
	openDeviceAssociate,
	deleteDeviceAssociate,
} from '@/api/device';
import { DEVICEICON } from '@/config';

export default {
	name: 'AssociateContent',
	data() {
		return {
			data: [],
			icons: DEVICEICON,
		};
	},

	computed: {
		list() {
			const list = this.data.map(el => {
				let device = {
					associateId: el.associateId,
					name: el.name,
					condition: el.condition,
					expect: el.expect,
					notice: el.notice,
					open: el.open,
				};
				if (device.condition) {
					device = this.setDeviceAssociate(device, 'condition');
				} else {
					device.condition = {};
				}
				if (device.expect) {
					device = this.setDeviceAssociate(device, 'expect');
				} else {
					device.expect = {};
				}
				return device;
			});
			return list;
		},
	},

	methods: {
		// 添加设备关联
		addAssociate() {
			this.$emit('addAssociate');
		},

		// 更新
		updateAssociate(item, type) {
			let associate = { associateId: item.associateId, name: item.name };
			if (type === 1) {
				associate.device = item.condition;
				associate.deviceId = '';
				if (item.expect.deviceId) {
					associate.deviceId = item.expect.deviceId;
				}
			} else if (type === 2) {
				associate.device = item.expect;
				associate.deviceId = item.condition.deviceId;
			}
			this.$emit('updateAssociate', associate, type);
		},

		// 开启关闭
		openAssociate(item) {
			if (item.condition.deviceId && item.expect.deviceId) {
				const data = {
					associateId: item.associateId,
					open: !item.open,
				};
				this.openDeviceAssociateFn(data);
			}
		},

		// 设置数据
		setDeviceAssociate(device, key) {
			const info = this.$store.state.device.find(
				element => element.deviceId === device[key].deviceId
			);
			const room = this.$store.state.rooms.find(
				room => room.roomId === info.roomId
			);
			if (!info || !room) {
				return device;
			}
			device[key].deviceName = info.name;
			device[key].categoryItemId = info.categoryItemId;
			device[key].roomName = room.name;
			return device;
		},

		// 删除关联
		deleteAssociate(associateId) {
			this.$confirm('此操作将永久删除该设备关联, 是否继续?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.deleteDeviceAssociateFn({
						associateId: associateId,
					});
				})
				.catch(() => {});
		},

		// 获取设备关联封装
		getDeviceAssociateFn() {
			this.$emit('setLoading', true);
			getDeviceAssociate()
				.then(resData => {
					this.data = resData;
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
					this.$emit('setLoading', false);
				});
		},

		// 开启关闭封装
		openDeviceAssociateFn(data) {
			this.$emit('setLoading', true);
			openDeviceAssociate(data)
				.then(resData => {
					if (resData.ok) {
						this.getDeviceAssociateFn();
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
					this.$emit('setLoading', false);
				});
		},

		// 删除设备关联封装
		deleteDeviceAssociateFn(data) {
			this.$emit('setLoading', true);
			deleteDeviceAssociate(data)
				.then(resData => {
					if (resData.ok) {
						this.getDeviceAssociateFn();
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
					this.$emit('setLoading', false);
				});
		},
	},

	created() {
		this.getDeviceAssociateFn();
	},
};
</script>

<style lang="scss" scoped>
.associate-content {
	flex: 1;

	.item {
		&-content {
			height: 400px;
			padding: 20px;
			box-sizing: border-box;
			position: relative;
			padding-bottom: 80px;
			@include info-card();
			@include flex-between(column);

			&-title {
				width: 100%;
				padding-bottom: 10px;
				border-bottom: 1px solid #ebeef5;

				@include flex-between();
			}

			&-icon {
				margin-top: 20px;
				@include flex-center();

				span.device {
					display: block;
					width: 100px;
					height: 100px;
					font-size: 64px;
					border: 1px solid #ebeef5;
					border-radius: 50%;
					cursor: pointer;
					color: #c0c4cc;

					@include flex-center();

					i {
						font-size: 32px;
						color: #c0c4cc;

						&:hover {
							color: #909399;
						}
					}
				}

				.associate {
					font-size: 48px;
					color: #c0c4cc;
					margin: 0 20px;
					cursor: pointer;

					&:hover {
						color: #909399;
					}
				}

				.associate.active {
					color: #606266;

					&:hover {
						color: #606266;
					}
				}

				.associate.not-allowed {
					cursor: not-allowed;

					&:hover {
						color: #c0c4cc;
					}
				}
			}
			&-icon.active {
				span.device {
					color: #606266;
				}
			}

			&-info {
				width: 100%;
				@include flex-between();
				span {
					display: block;
					width: 50%;
					padding: 10px;
					color: #909399;
					@include flex-center(column);
					i {
						padding: 10px 0;
					}
				}
			}

			&-btn {
				height: 80px;
				width: 100%;
				padding: 20px;
				position: absolute;
				box-sizing: border-box;
				bottom: 0px;
				transition: all 0.5s;

				.item {
					width: 100%;
					@include flex-center();

					i {
						display: block;
						width: 40%;
						text-align: left;
					}
				}
			}
		}
	}

	.add-item {
		height: 400px;
		line-height: 400px;
		text-align: center;
		font-size: 64px;
		cursor: pointer;

		@include info-card();
		color: #909399;

		&:hover {
			color: #606266;
		}
	}
}
</style>
