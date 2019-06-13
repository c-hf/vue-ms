<template>
    <el-card class="app-lighting-card"
             :class="{'off-line':!device.onLine}"
             body-style="display: flex; flex-direction: column; align-items: center;">
        <div class="app-lighting-card-top">
            <span class="app-lighting-card-top-icon"
                  :class="{'off-line-icon': !device.onLine}"
                  @click="routeDetails">
                <svg-icon iconClass="icon-chelianwang" />
            </span>
        </div>
        <div class="app-lighting-card-bottom">
            <span class="app-lighting-card-bottom-item name">
                {{roomName}} - {{device.name}}
            </span>
            <span class="app-lighting-card-bottom-item info"
                  :class="{'off-line-info': !device.onLine}">
                <i v-if="!device.onLine">
                    设备离线
                </i>
                <i v-else>
                    设备在线
                </i>
            </span>
        </div>
    </el-card>
</template>

<script>
export default {
	name: 'AppCeilingLamp',
	data() {
		return {};
	},

	computed: {
		roomName() {
			const index = this.$store.state.rooms.findIndex(value => {
				return value.roomId === this.device.roomId;
			});
			return this.$store.state.rooms[index].name;
		},

		status() {
			return this.$store.state.status[this.device.deviceId];
		},
	},

	methods: {
		// 设备接入
		routeDetails() {
			// this.$router.push({
			// 	name: 'details',
			// 	query: {
			// 		name: this.device.name,
			// 	},
			// 	params: { deviceId: this.device.deviceId },
			// });
		},
	},

	props: {
		device: {
			type: Object,
		},
	},
};
</script>

<style lang="scss">
.app-lighting-card {
	user-select: none;

	&-top {
		width: 100%;
		height: 220px;
		position: relative;
		@include flex-center();

		&-icon {
			cursor: pointer;
			font-size: 100px;
		}

		&-warn {
			position: absolute;
			top: 0;
			right: 0;
			font-size: 24px;
		}

		&-set {
			position: absolute;
			top: 0;
			left: 0;
			font-size: 24px;
		}
	}

	&-bottom {
		width: 100%;
		height: 100px;
		@include flex-start(column);

		.info {
			margin-top: 30px;
			color: #909399;

			i {
				width: 100%;
				font-weight: bold;
			}

			&-on-line {
				border-color: #409eff;
				color: #409eff;
			}
		}

		.off-line-info {
			i {
				color: #c0c4cc;
			}
			i:nth-of-type(2) {
				color: #909399;
			}
		}
	}
}

.off-line {
	color: #c0c4cc;
}
</style>
