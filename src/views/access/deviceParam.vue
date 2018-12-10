<template>
    <div class="access-device-param">
        <el-card class="device-list">
            <div slot="header"
                 class="clearfix">
                <span>{{ data.name }} 属性参数</span>
            </div>
            <el-form label-position="left"
                     label-width="115px"
                     class="device-form">
                <el-form-item v-for="(item, index) in deviceParam"
                              :key="index"
                              :label="item.name">
                    <el-col :span="6">
                        <span>{{ item.value }}<i v-show="item.unit !== 'null'"> {{ item.unit }}</i></span>
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
                        <el-table-column label="操作"
                                         fixed="right">
                            <template slot-scope="scope">
                                <el-button v-if="!custom"
                                           type="text"
                                           size="mini"
                                           disabled>
                                    Delete
                                </el-button>
                                <el-button v-else
                                           type="text"
                                           size="mini">
                                    Delete
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <div class="device-list-btn">
                <el-button type="primary"
                           @click="onSubmit">添加</el-button>
                <el-button @click="onReset">上一步</el-button>
            </div>
        </el-card>
    </div>
</template>

<script>
import { TABLEDATA } from './config.js';
import { setDevice } from '@/api/device';

export default {
	name: 'AccessDeviceParam',
	data() {
		return {
			tableData: TABLEDATA,
			disabled: false,
		};
	},

	methods: {
		// 提交按钮事件
		onSubmit() {
			this.$emit('setLoading', true);
			let status = [];
			this.deviceAttr.forEach(el => {
				status.push({
					id: el.id,
					value: el.value,
				});
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
			setDevice(reqData)
				.then(() => {
					this.$message({
						showClose: true,
						center: true,
						message: '创建成功！',
						type: 'success',
					});
					this.$emit('setLoading', false);
					this.$router.push({ name: 'control' });
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
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
.access-device-param {
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
	.device-list-btn {
		padding-left: 8%;
		padding-top: 50px;
		padding-bottom: 50px;
	}
}
</style>
