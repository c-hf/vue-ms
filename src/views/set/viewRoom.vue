<template>
    <div class="view-room"
         v-loading="loading">
        <el-table ref="multipleTable"
                  :data="data"
                  tooltip-effect="dark"
                  style="width: 100%">
            <el-table-column type="index"
                             width="50">
            </el-table-column>
            <el-table-column prop="roomId"
                             label="RoomID">
            </el-table-column>
            <el-table-column prop="icon"
                             label="图标">
                <template slot-scope="scope">
                    <svg-icon :iconClass="scope.row.icon" />
                </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="房间名称">
            </el-table-column>
            <el-table-column label="拥有设备数">
                <template slot-scope="scope">
                    <span v-if="scope.row.deviceNum">
                        {{ scope.row.deviceNum }}
                    </span>
                    <span v-else>
                        0
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-tooltip content="编辑"
                                effect="dark"
                                placement="top">
                        <el-button type="primary"
                                   circle
                                   icon="el-icon-edit-outline"
                                   size="mini"
                                   @click="editRoom(scope.$index, scope.row)">
                        </el-button>
                    </el-tooltip>
                    <el-tooltip content="删除"
                                effect="dark"
                                placement="top">
                        <el-button type="danger"
                                   circle
                                   icon="el-icon-delete"
                                   size="mini"
                                   @click="deleteRoom(scope.$index, scope.row)">
                        </el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <div class="view-room-btn">
            <el-button plain
                       @click="addRoom">
                添加房间
            </el-button>
        </div>
        <app-drawer :show.sync="show">
            <app-drawer-room v-if="show"
                             :type="type"
                             :room="roomData"
                             @setShow="setShow" />
        </app-drawer>
    </div>
</template>

<script>
import AppDrawer from '@/components/appDrawer';
import AppDrawerRoom from '@/components/appDrawerRoom';
import { deleteHouse } from '@/api/group';

export default {
	name: 'ViewRoom',
	data() {
		return {
			loading: false,
			show: false,
			roomData: {},
			edit: false,
			type: 'new',
		};
	},

	computed: {
		data() {
			let [rooms, deviceRooms] = [this.$store.state.rooms, {}];
			this.$store.state.device.forEach(el => {
				if (deviceRooms[el.roomId]) {
					deviceRooms[el.roomId] = deviceRooms[el.roomId] + 1;
				} else {
					deviceRooms[el.roomId] = 1;
				}
			});
			rooms.forEach((el, index) => {
				rooms[index].deviceNum = deviceRooms[el.roomId];
			});
			return rooms;
		},
	},

	methods: {
		// 抽屉显示/关闭
		setShow(value) {
			this.show = value;
		},

		// 添加
		addRoom() {
			this.type = 'new';
			this.show = true;
		},

		// 编辑
		editRoom(index, row) {
			this.type = 'edit';
			this.roomData = row;
			this.show = true;
		},

		// 编辑
		deleteRoom(index, row) {
			this.$confirm('确定要删除房间？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning',
			})
				.then(() => {
					if (row.deviceNum > 0) {
						this.$message({
							showClose: true,
							center: true,
							message: '房间存在关联设备，无法删除！',
							type: 'warning',
						});
						return;
					} else {
						this.deleteHouseFn({
							groupId: this.$store.state.group.groupId,
							roomId: row.roomId,
						});
					}
				})
				.catch(() => {});
		},

		// 删除封装
		deleteHouseFn(data) {
			this.loading = true;
			deleteHouse(data)
				.then(resData => {
					if (resData.ok) {
						return;
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
		AppDrawer,
		AppDrawerRoom,
	},
};
</script>

<style lang="scss" scoped>
.view-room {
	padding: 32px;
	padding-top: 40px;
	svg {
		font-size: 24px;
	}
	&-btn {
		margin-top: 40px;
	}
}
</style>

