<template>
    <el-card class="app-lighting-card"
             :class="{'off-line':!device.onLine}"
             body-style="display: flex; flex-direction: column; align-items: center;">
        <div class="app-lighting-card-top">
            <span class="app-lighting-card-top-icon"
                  :class="{'off-line-icon': !device.onLine}"
                  @click="routeDetails">
                <svg-icon iconClass="icon-tableLamp" />
            </span>
            <!-- <span class="app-lighting-card-top-set">
                <svg-icon iconClass="icon-collection" />
            </span> -->
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
                <el-button v-else
                           @click="setSwitch"
                           :loading="switchLoading"
                           :type="type"
                           plain
                           circle>
                    <svg-icon v-if="!switchLoading"
                              iconClass="icon-guanbi" />
                </el-button>
            </span>
        </div>
    </el-card>
</template>

<script>
import { setDesired } from '@/api/device';

export default {
	name: 'AppCeilingLamp',
	data() {
		return {
			switchLoading: false,
			timer: null,
			luminance: 0,
		};
	},

	computed: {
		type() {
			let type = 'primary';
			this.status.switch ? (type = 'primary') : (type = 'info');
			return type;
		},

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
		// 防抖动
		setTimeOut() {
			if (this.timer) {
				clearTimeout(this.timer);
				this.timer = null;
			}
			this.timer = setTimeout(() => {
				if (this.switchLoading) {
					this.$message({
						showClose: true,
						center: true,
						message: '操作超时！请重试',
						type: 'error',
					});
					this.switchLoading = false;
				}
			}, 2000);
		},

		// 设置开关
		setSwitch() {
			this.switchLoading = true;
			this.setTimeOut();
			setDesired({
				deviceId: this.device.deviceId,
				desired: { switch: !this.status.switch },
			}).catch(error => {
				this.$message({
					showClose: true,
					center: true,
					message: error.message,
					type: 'error',
				});
			});
		},

		// 设备接入
		routeDetails() {
			this.$router.push({
				name: 'details',
				query: {
					name: this.device.name,
				},
				params: { deviceId: this.device.deviceId },
			});
		},
	},

	props: {
		device: {
			type: Object,
		},
	},

	watch: {
		status() {
			if (this.switchLoading) {
				this.switchLoading = false;
				this.timer ? clearTimeout(this.timer) : (this.timer = null);
			}
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
		}
	}
}

.off-line {
	color: #c0c4cc;
}
</style>
