<template>
    <div class="access-param">
        <el-row>
            <el-col :span="24">
                <el-card class="device-list">
                    <div slot="header"
                         class="clearfix">
                        <span>{{ name }} 属性参数</span>
                    </div>
                    <el-form ref="deviceForm"
                             :model="deviceParam"
                             label-position="left"
                             label-width="10%">
                        <el-form-item v-for="(item, index) in deviceParam"
                                      :key="index"
                                      :label="item.name">
                            <el-col :span="6">
                                <span>{{ item.attr }}<i v-show="item.unit"> {{ item.unit }}</i></span>
                            </el-col>
                            <!-- <el-col :span="2"
                                    :offset="0">
                                <el-button type="text"
                                           size="mini"
                                           disabled>
                                    Delete
                                </el-button>
                            </el-col> -->
                        </el-form-item>
                        <el-form-item label="属性">
                            <el-table :data="deviceAttr"
                                      highlight-current-row
                                      style="width: 90%;">
                                <el-table-column prop="id"
                                                 label="参数名称">
                                </el-table-column>
                                <el-table-column prop="name"
                                                 label="显示名称">
                                </el-table-column>
                                <el-table-column prop="type"
                                                 label="类型">
                                </el-table-column>
                                <el-table-column prop="attr"
                                                 label="值">
                                </el-table-column>
                                <el-table-column prop="unit"
                                                 label="单位">
                                </el-table-column>
                                <el-table-column label="操作">
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
                        <el-form-item>
                            <el-button type="primary"
                                       @click="submitForm('deviceForm')">创建</el-button>
                            <el-button @click="resetForm('deviceForm')">上一步</el-button>
                        </el-form-item>

                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
	name: 'AccessParam',
	data() {
		return {
			deviceParam: {
				type: {
					name: '设备分类',
					attr: '照明 - 吸顶灯',
					unit: null,
				},
				model: {
					name: '型号',
					attr: '9290012681',
					unit: null,
				},
				voltage: {
					name: '额定电压',
					attr: '100 - 240',
					unit: 'V',
				},
				frequency: {
					name: '额定频率',
					attr: '50/60',
					unit: 'HZ',
				},
				current: {
					name: '额定电流',
					attr: '0.3',
					unit: 'A',
				},
				power: {
					name: '额定功率',
					attr: '10',
					unit: 'W',
				},
				wifi: {
					name: 'Wi-Fi 模组',
					attr: 'Wi-Fi IEEE 802.11 b/g/n 2.4G',
					unit: null,
				},
			},
			deviceAttr: [
				{
					id: 'activate',
					name: '是否激活',
					type: 'Boolean',
					attr: 'true',
					unit: null,
				},
				{
					id: 'status',
					name: '状态',
					type: 'String',
					attr: '在线',
					unit: null,
				},
				{
					id: 'switch',
					name: '开关',
					type: 'Boolean',
					attr: 'true',
					unit: null,
				},
				{
					id: 'luminance',
					name: '亮度',
					type: 'Number',
					attr: 45,
					unit: '%',
				},
				{
					id: 'delay',
					name: '延时关灯',
					type: 'Number',
					attr: 0,
					unit: '分',
				},
				{
					id: 'runTime',
					name: '运行时间',
					type: 'Number',
					attr: 0,
					unit: '分',
				},
				{
					id: 'totalRunningTime',
					name: '总运行时间',
					type: 'Number',
					attr: 0,
					unit: '分',
				},
			],
		};
	},
	props: {
		name: {
			type: String,
			default: '设备',
		},
		custom: {
			tyep: Boolean,
			default: false,
		},
	},
	methods: {
		// 提交按钮事件
		submitForm(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.$emit('infoSubmit', this.device);
				} else {
					return false;
				}
			});
		},
		// 重置按钮事件
		resetForm() {
			this.$emit('setInfo');
		},
	},
};
</script>

<style lang="scss" scoped>
.access-param {
	.el-form {
		width: 100%;
		padding-left: 5%;

		.title {
			margin-left: -0%;
		}
		.el-table {
			border: 1px solid #ebeef5;
			border-bottom: none;
		}
	}
}
</style>
