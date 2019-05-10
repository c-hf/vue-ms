<template>
    <el-card class="control-content"
             body-style="min-height:480px;">
        <el-table :data="deviceData"
                  :default-sort="{prop:'最后活跃时间', order: 'ascending'}"
                  class="table"
                  highlight-current-row
                  ref="multipleTable"
                  style="width: 100%"
                  tooltip-effect="dark">
            <el-table-column v-if="selection"
                             type="selection"
                             width="30">
            </el-table-column>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form class="table-expand"
                             inline
                             label-position="left">
                        <el-form-item label="名称">
                            <span>{{ props.row.name }}</span>
                        </el-form-item>
                        <el-form-item label="描述">
                            <span>{{ props.row.desc }}</span>
                        </el-form-item>
                        <el-form-item label="所属分类">
                            <span>{{ props.row.categoryName }}</span>
                        </el-form-item>
                        <el-form-item label="操作系统">
                            <span>{{ props.row.os }}</span>
                        </el-form-item>
                        <el-form-item label="联网方式">
                            <span>{{ props.row.networking }}</span>
                        </el-form-item>
                        <el-form-item label="设备接入协议">
                            <span>{{ props.row.protocol }}</span>
                        </el-form-item>
                        <el-form-item label="创建时间">
                            <span>{{ props.row.createTime }}</span>
                        </el-form-item>
                        <el-form-item label="最后活跃时间">
                            <span>{{ props.row.updateTime }}</span>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
            <el-table-column label="DeviceID"
                             width="200">
                <template slot-scope="scope">
                    {{ scope.row.deviceId }}
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true"
                             label="名称"
                             prop="name">
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true"
                             label="设备类型"
                             prop="categoryItemName">
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    <i class="on-line"
                       v-if="scope.row.onLine">
                        在线
                    </i>
                    <i class="off-line"
                       v-else>
                        离线
                    </i>
                </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true"
                             label="创建时间"
                             prop="createTime">
            </el-table-column>
            <el-table-column fixed="right"
                             label="操作"
                             width="100">
                <template slot-scope="scope">
                    <el-tooltip content="编辑"
                                effect="dark"
                                placement="top">
                        <el-button type="primary"
                                   circle
                                   icon="el-icon-edit-outline"
                                   size="mini"
                                   @click="onEdit(scope.$index, scope.row)">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="删除"
                                effect="dark"
                                placement="top">
                        <el-button type="danger"
                                   circle
                                   icon="el-icon-delete"
                                   size="mini"
                                   @click="onDelete(scope.$index, scope.row)">
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
export default {
	name: 'ControlContent',
	data() {
		return {
			selection: false,
			multipleSelection: [],
		};
	},

	computed: {
		deviceData() {
			return this.$store.state.device;
		},
	},

	methods: {
		// 编辑
		onEdit(index, row) {
			this.$emit('onEdit', row.deviceId);
		},

		// 删除
		onDelete(index, row) {
			this.$confirm(`确定删除设备 ${row.deviceId} ?`, '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					this.$emit('onDelete', row.deviceId);
				})
				.catch(() => {});
		},
	},
};
</script>

<style lang="scss">
.control-content {
	flex: 1;

	.table {
		&-expand {
			font-size: 0;
			padding-left: 50px;

			.el-form-item {
				width: 50%;
				margin-right: 0;
				margin-bottom: 0;

				&__label {
					width: 100px;
					color: #99a9bf;
				}
			}
		}

		.on-line,
		.off-line {
			display: block;
			margin-left: 20px;
			position: relative;

			&::after {
				content: ' ';
				display: block;
				width: 10px;
				height: 10px;
				border-radius: 50%;
				background-color: rgba($color: #67c23a, $alpha: 1);
				position: absolute;
				left: -20px;
				top: 50%;
				margin-top: -5px;
			}
		}

		.off-line {
			color: #909399;
			&::after {
				background-color: rgba($color: #f56c6c, $alpha: 1);
			}
		}
	}
}
</style>
