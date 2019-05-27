<template>
    <el-tabs class="details-info"
             v-model="activeName"
             type="border-card">
        <el-tab-pane label="设备信息"
                     name="first">
            <div class="content">
                <span class="content-item">
                    <i>设备名称</i>
                    <i>
                        {{ device.name }}
                    </i>
                </span>
                <span class="content-item">
                    <i>分类</i>
                    <i>
                        {{ device.categoryName }}
                    </i>
                </span>
                <span class="content-item">
                    <i>位置</i>
                    <i>
                        {{ roomName }}
                    </i>
                </span>
                <span class="content-item">
                    <i>创建时间</i>
                    <i>
                        {{ device.createTime.split(' ')[0] }}
                    </i>
                </span>
            </div>
        </el-tab-pane>
        <el-tab-pane label="配置管理"
                     name="second">
            <div class="content">
                <span class="content-id">
                    <i>群组 ID</i>
                    <i>
                        {{ device.groupId }}
                    </i>
                </span>
                <span class="content-id">
                    <i>DeviceID</i>
                    <i>
                        {{ device.deviceId }}
                    </i>
                </span>
            </div>
        </el-tab-pane>
    </el-tabs>
</template>


<script>
export default {
	name: 'DetailsInfo',
	data() {
		return {
			activeName: 'first',
		};
	},

	computed: {
		// 房间名
		roomName() {
			const el = this.$store.state.rooms.find(
				el => el.roomId === this.device.roomId
			);
			if (el) {
				return el.name;
			}
			return '';
		},
	},

	props: {
		device: {
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
.details-info {
	width: 30%;
	margin-bottom: 50px;
	min-width: 220px;

	.content {
		height: 300px;
		margin: 10px;
		padding: 20px;
		border: 1px solid #f2f6fc;
		border-radius: 4px;
		box-sizing: border-box;

		&-item {
			width: 100%;
			height: 60px;
			line-height: 60px;
			color: #909399;
			@include flex-start();

			i:nth-of-type(1) {
				width: 80px;
				display: block;
			}
			i:nth-of-type(2) {
				color: #606266;
			}
		}

		&-id {
			width: 100%;
			height: 50px;
			line-height: 50px;
			color: #909399;

			i {
				display: block;
			}
			i:nth-of-type(2) {
				color: #606266;
			}
		}
	}
}
</style>
