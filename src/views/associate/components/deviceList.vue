<template>
    <div class="device-list">
        <el-scrollbar style="height: 100%; width: 100%;">
            <el-table :data="deviceData"
                      class="table"
                      highlight-current-row
                      ref="multipleTable"
                      style="width: 100%"
                      tooltip-effect="dark"
                      @row-click="selectDevice"
                      @row-dblclick="dblclick">
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
                <el-table-column :show-overflow-tooltip="true"
                                 label="所属分类"
                                 prop="categoryName">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 label="所在房间"
                                 prop="roomName">
                </el-table-column>
                <el-table-column :show-overflow-tooltip="true"
                                 label="创建时间"
                                 prop="createTime">
                </el-table-column>
            </el-table>
        </el-scrollbar>
        <div class="device-list-btn">
            <el-button plain
                       @click="onBack">
                返回
            </el-button>
            <el-button type="primary"
                       plain
                       @click="onSubmit">
                确定
            </el-button>
        </div>
    </div>
</template>


<script>
export default {
	name: 'DeviceList',
	data() {
		return {
			device: {},
		};
	},

	computed: {
		deviceData() {
			let deviceData = [];
			this.$store.state.device.forEach(el => {
				if (el.deviceId === this.deviceId) {
					return;
				} else if (this.type === 2 && el.categoryId === 'sensor') {
					return;
				}
				let device = el;
				const room = this.$store.state.rooms.find(
					room => room.roomId === device.roomId
				);
				device.roomName = room.name;
				deviceData.push(device);
			});
			return deviceData;
		},
	},

	methods: {
		selectDevice(row) {
			this.device = row;
		},

		dblclick(row) {
			this.device = row;
			this.onSubmit();
		},

		onSubmit() {
			if (this.device.deviceId) {
				this.$emit('getDevice', this.device);
			} else {
				this.$message({
					showClose: true,
					center: true,
					message: '还未选择设备',
					type: 'warning',
				});
			}
		},

		onBack() {
			this.$emit('onBack');
		},
	},

	props: {
		deviceId: {
			type: String,
		},

		type: {
			type: Number, // 1 触发设备 2 响应设备
		},
	},
};
</script>

<style lang="scss" scoped>
.device-list {
	height: 500px;
	padding-bottom: 60px;
	position: relative;
	overflow: hidden;

	&-btn {
		width: 100%;
		text-align: right;
		position: absolute;
		bottom: 10px;
	}
}
</style>
<style lang="scss">
.device-list {
	.el-scrollbar__wrap {
		overflow-x: hidden;
	}
}
</style>

