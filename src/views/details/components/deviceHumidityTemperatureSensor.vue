<template>
    <div class="ceiling-lamp"
         ref="details">
        <div class="left">
            <div class="left-top">
                <details-info :device="device" />
                <div class="ceiling-lamp-lamp">
                    <app-bubble :temp="status.temp"
                                :humidity="status.humidity" />
                </div>
            </div>
            <div class="left-bottom">
                <details-log ref="log"
                             :deviceId="deviceId"
                             @moreDeviceLogs="moreDeviceLogs" />
            </div>
        </div>
        <div class="right">
            <el-card class="ceiling-lamp-control-content">
                <div class="ceiling-lamp-control-content-top">
                    <span class="item"
                          :class="{active: device.onLine}">
                        连接 -
                    </span>
                    <span class="item"
                          :class="{active: status.switch && device.onLine}">
                        运行 -
                    </span>
                    <span class="item warn">
                        告警 -
                    </span>
                </div>
                <div class="ceiling-lamp-control-content-middle">
                    <svg-icon iconClass="icon-iconset0480" />
                    <span class="title">
                        温度
                    </span>
                    <span class="value">
                        {{ status.temp }} &#8451;
                    </span>
                </div>
                <div class="ceiling-lamp-control-content-bottom">
                    <svg-icon iconClass="icon-kongqishidu" />
                    <span class="title">
                        湿度
                    </span>
                    <span class="value">
                        {{ status.humidity }} %
                    </span>
                </div>
            </el-card>
            <el-card class="ceiling-lamp-control-footer"
                     v-loading="timedTaskloading">
                <div slot="header"
                     class="header">
                    定时任务
                    <el-button type="primary"
                               icon="el-icon-plus"
                               size="small"
                               disabled
                               circle
                               plain>
                    </el-button>
                </div>
                <div class="content">
                    <app-task-card ref="appTaskCard"
                                   :deviceId="deviceId"
                                   :onLine="device.onLine"
                                   :height="260" />
                </div>
            </el-card>
        </div>
        <app-drawer :show.sync="drawerVisible">
            <app-drawer-log v-if="drawerVisible && drawerType === 'log'"
                            :deviceId="deviceId"
                            @deleteLogs="deleteLogs" />
        </app-drawer>
    </div>
</template>

<script>
import AppDrawer from '@/components/appDrawer';
import AppDrawerLog from '@/components/appDrawerLog';
import AppBubble from '@/components/appBubble';
import AppTaskCard from '@/components/appTaskCard';
import DetailsInfo from './info';
import DetailsLog from './log';

export default {
	name: 'HumidityTemperatureSensor',
	data() {
		return {
			switchLoading: false,
			timedTaskloading: false,
			drawerVisible: false,
			drawerType: 'log',
		};
	},

	computed: {
		// 设备状态
		status() {
			let status = {};
			if (this.device.deviceId) {
				status = this.$store.state.status[this.device.deviceId];
			}
			return status;
		},
	},

	methods: {
		// 查看更多日志
		moreDeviceLogs() {
			this.drawerVisible = true;
			this.drawerType = 'log';
		},

		// 侧边栏删除日志
		deleteLogs() {
			this.$refs.log.getDeviceLogByIdFn(this.deviceId);
		},
	},

	props: {
		deviceId: {
			type: String,
			default: '',
		},

		device: {
			type: Object,
			default: () => {
				return {
					categoryId: '',
					categoryItemId: '',
					categoryItemName: '',
					createTime: '',
					desc: '',
					deviceId: '',
					groupId: '',
					name: '',
					networking: '',
					onLine: false,
					os: '',
					protocol: '',
					roomId: '',
					updateTime: '',
				};
			},
		},
	},

	components: {
		AppDrawer,
		AppDrawerLog,
		AppTaskCard,
		AppBubble,
		DetailsInfo,
		DetailsLog,
	},
};
</script>

<style lang="scss" scoped>
.ceiling-lamp {
	flex: 1;
	@include flex-between();
	align-items: flex-start;

	.left {
		width: 70%;
		height: 100%;
		padding: 0 20px;
		box-sizing: border-box;

		&-top {
			height: 50%;
			@include flex-between();
		}
	}

	.right {
		width: 30%;
		padding: 0 20px;
		box-sizing: border-box;
	}

	&-lamp {
		width: 70%;
		@include flex-center(column);
	}

	&-control {
		&-content {
			height: 100%;
			width: 100%;
		}

		&-content-top {
			height: 80px;
			@include flex-around();

			.item {
				flex: 1;
				min-width: 70px;
				color: #606266;
				position: relative;
				@include ellipsis();

				&::after {
					content: ' ';
					display: block;
					height: 16px;
					width: 16px;
					border-radius: 50%;
					position: absolute;
					top: 50%;
					left: 50px;
					margin-top: -8px;
					background-image: linear-gradient(
						135deg,
						#f5f7fa 0%,
						#c3cfe2 100%
					);
				}
			}

			.warn {
				&::after {
					background-image: linear-gradient(
						135deg,
						#f5f7fa 0%,
						#c3cfe2 100%
					);
				}
			}

			.active {
				&::after {
					background-image: linear-gradient(
						to right,
						#43e97b 0%,
						#38f9d7 100%
					);
				}
			}
		}

		&-content-middle,
		&-content-bottom {
			height: 100px;
			margin-top: 20px;
			margin-bottom: 20px;
			box-sizing: border-box;
			@include flex-center();

			svg {
				font-size: 48px;
			}
			.title {
				margin: 0 40px;
			}
		}

		&-content-middle {
			border-top: 1px solid #e4e7ed;
		}

		&-content-bottom {
			border-bottom: 1px solid #e4e7ed;
			margin-bottom: 50px;
		}

		&-footer {
			height: 100%;
			width: 100%;
			margin-top: 10px;

			.header {
				height: 23px;
				@include flex-between();
			}

			.content {
				height: 260px;
			}
		}
	}

	.button {
		margin-left: 20px;
		margin-right: 10px;
		box-shadow: 0 0px 8px 0 rgba($color: #000000, $alpha: 0.2),
			0 5px 12px 0 rgba($color: #000000, $alpha: 0.1);
	}

	.flex-between {
		@include flex-between();
	}

	.margin-top {
		margin-top: 40px;
	}

	.margin {
		margin-bottom: 20px;
	}
}
</style>
