<template>
    <el-table :data="deviceData"
              :default-sort="{prop:'最后活跃时间',order: 'ascending'}"
              class="device-list"
              highlight-current-row
              ref="multipleTable"
              style="width: 100%"
              tooltip-effect="dark">
        <el-table-column type="selection"
                         width="30"></el-table-column>
        <el-table-column type="expand">
            <template slot-scope="props">
                <el-form class="device-list-table-expand"
                         inline
                         label-position="left">
                    <el-form-item label="名称">
                        <span>{{ props.row.name }}</span>
                    </el-form-item>
                    <el-form-item label="描述">
                        <span>{{ props.row.desc }}</span>
                    </el-form-item>
                    <el-form-item label="所属分类">
                        <span>{{ props.row.category.categoryId }}</span>
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
                        <span>{{ props.row.status.createTime }}</span>
                    </el-form-item>
                    <el-form-item label="最后活跃时间">
                        <span>{{ props.row.status.updateTime }}</span>
                    </el-form-item>
                </el-form>
            </template>
        </el-table-column>
        <el-table-column label="deviceId"
                         width="280">
            <template slot-scope="scope">{{ scope.row.deviceId }}</template>
        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         label="名称"
                         prop="name"></el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         label="设备类型"
                         prop="category.name"></el-table-column>
        <el-table-column label="状态">

        </el-table-column>
        <el-table-column :show-overflow-tooltip="true"
                         label="最后活跃时间"
                         prop="status.updateTime"></el-table-column>
        <el-table-column fixed="right"
                         label="操作"
                         width="100">
            <template slot-scope="scope">
                <el-tooltip content="编辑"
                            effect="dark"
                            placement="top">
                    <el-button @click="onEdit(scope.$index, scope.row)"
                               circle
                               icon="el-icon-edit-outline"
                               size="mini"></el-button>
                </el-tooltip>
                <el-tooltip content="删除"
                            effect="dark"
                            placement="top">
                    <el-button @click="onDelete(scope.$index, scope.row)"
                               circle
                               icon="el-icon-delete"
                               size="mini"></el-button>
                </el-tooltip>
            </template>
        </el-table-column>
    </el-table>
</template>

<script>
export default {
	name: 'DeviceList',
	data() {
		return {
			// deviceData: [],
			selection: false,
			multipleSelection: [],
		};
	},
	methods: {
		// 查看
		onEdit(index, row) {
			console.log(index);
			console.log(row);

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
				.catch(() => {
					this.$message({
						showClose: true,
						center: true,
						type: 'info',
						message: '已取消删除',
					});
				});
		},
	},
	computed: {
		deviceData() {
			return this.$store.state.device;
		},
	},
	mounted() {
		// console.log(this.$store.state.device);
		// setInterval(() => {
		// 	console.log(this.$store.state.device);
		// }, 3000);
	},
};
</script>

<style lang="scss">
.device-list {
	&-table-expand {
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
}
</style>
