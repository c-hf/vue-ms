<template>
    <el-card class="view-device-param">
        <div slot="header"
             class="clearfix">
            <span>
                {{ data.name }}
                属性参数
            </span>
        </div>
        <el-form label-position="left"
                 label-width="115px"
                 class="device-form">
            <el-form-item v-for="(item, index) in deviceParam"
                          :key="index"
                          :label="item.name">
                <el-col :span="6">
                    <span>
                        {{ item.value }}
                        {{ item.unit }}
                    </span>
                </el-col>
            </el-form-item>
            <el-form-item label="属性">
                <el-table :data="deviceAttr"
                          highlight-current-row
                          style="width: 90%;">
                    <el-table-column v-for="(item, index) in tableData"
                                     :key="index"
                                     :prop="item.prop"
                                     :label="item.label">
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <div class="view-device-param-btn">
            <el-button type="primary"
                       @click="onSubmit">
                添加
            </el-button>
            <el-button @click="onReset">
                上一步
            </el-button>
        </div>
    </el-card>
</template>

<script>
import { TABLEDATA } from '../config.js';
import { setDevice } from '@/api/device';

export default {
	name: 'ViewDeviceParam',
	data() {
		return {
			tableData: TABLEDATA,
			disabled: false,
		};
	},

	methods: {
		// 提交按钮事件
		onSubmit() {
			let status = {};
			this.deviceAttr.forEach(el => {
				status[el.id] = el.value;
			});
			const reqData = {
				groupId: this.$store.state.user.groupId,
				categoryItemId: this.data.type[1],
				deviceId: this.data.deviceId,
				roomId: this.data.roomId,
				name: this.data.name,
				desc: this.data.desc,
				os: this.data.os,
				networking: this.data.networking,
				protocol: this.data.protocol,
				status: status,
			};

			this.setDeviceFn(reqData);
		},

		setDeviceFn(data) {
			this.$emit('setLoading', true);
			setDevice(data)
				.then(() => {
					this.$message({
						showClose: true,
						center: true,
						message: '创建成功！',
						type: 'success',
					});
					this.$router.push({ name: 'control' });
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

		// 重置按钮事件
		onReset() {
			this.$emit('showInfo');
		},
	},
	props: {
		data: {
			type: Object,
		},
		// 是否为定义
		custom: {
			tyep: Boolean,
			default: false,
		},
		// 参数
		deviceParam: {
			type: Array,
		},
		// 属性
		deviceAttr: {
			type: Array,
		},
	},
};
</script>

<style lang="scss" scoped>
.view-device-param {
	.device-form {
		padding-left: 8%;

		.title {
			margin-left: -0%;
		}
		.el-table {
			border: 1px solid #ebeef5;
			border-bottom: none;
		}
	}

	&-btn {
		padding-left: 8%;
		padding-top: 50px;
		padding-bottom: 50px;
	}
}
</style>
