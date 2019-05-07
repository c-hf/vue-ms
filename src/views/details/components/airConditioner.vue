<template>
    <div class="view-lighting"
         ref="details">
        <el-row>
            <el-col :span="16"
                    class="view-lighting-left">
                <el-col :span="24"
                        class="view-lighting-left-top">
                    <el-tabs type="card"
                             v-model="activeName"
                             class="view-lighting-info">
                        <el-tab-pane label="设备信息"
                                     name="first">
                            <el-card class="view-lighting-info-content">
                                <span class="view-lighting-info-content-item">
                                    <i>设备名称</i>
                                    <i>
                                        {{ device.name }}
                                    </i>
                                </span>
                                <span class="view-lighting-info-content-item">
                                    <i>分类</i>
                                    <i>
                                        {{device.categoryId}}
                                    </i>
                                </span>
                                <span class="view-lighting-info-content-item">
                                    <i>位置</i>
                                    <i>
                                        {{ roomName }}
                                    </i>
                                </span>
                                <span class="view-lighting-info-content-item">
                                    <i>创建时间</i>
                                    <i>
                                        {{ device.createTime.split(' ')[0] }}
                                    </i>
                                </span>
                            </el-card>
                        </el-tab-pane>
                        <el-tab-pane label="配置管理"
                                     name="second">
                            配置管理
                        </el-tab-pane>

                    </el-tabs>
                    <div class="view-lighting-bubble">
                        <app-bubble :number="number" />
                    </div>
                </el-col>
                <el-col :span="24"
                        class="view-lighting-left-bottom">
                    <el-tabs type="border-card"
                             class="view-lighting-left-bottom-log">
                        <el-tab-pane label="操作日志"
                                     class="log-card">
                            <log-card :deviceId="this.device.deviceId" />
                        </el-tab-pane>
                        <el-tab-pane label="告警"
                                     class="warn-card">
                            告警
                        </el-tab-pane>
                    </el-tabs>
                </el-col>
            </el-col>
            <el-col :span="8"
                    class="view-lighting-control">
                <el-card class="view-lighting-control-content">
                    <div class="view-lighting-control-content-top">
                        <span class="item">
                            连接 -
                        </span>
                        <span class="item">
                            运行 -
                        </span>
                        <span class="item warn">
                            告警 -
                        </span>
                    </div>
                    <div class="view-lighting-control-content-middle">
                        <div class="temp">
                            <span class="temp-setting">
                                温度设定
                                <el-input-number controls-position="right"
                                                 v-model="temp"
                                                 :min="16"
                                                 :max="30">
                                </el-input-number>
                            </span>
                            <span class="temp-current">
                                <svg-icon iconClass="icon-iconset0480" />
                                <!-- <i>{{status.luminance}}</i> -->
                            </span>
                        </div>
                        <div class="mode">
                            <span class="mode-setting">
                                模式设定
                                <el-dropdown placement="bottom"
                                             trigger="click"
                                             @command="selectMode">
                                    <el-button circle
                                               plain>
                                        <svg-icon :iconClass="modeIcon" />
                                    </el-button>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item command="auto">
                                            <svg-icon iconClass="icon-zidong-" />
                                        </el-dropdown-item>
                                        <el-dropdown-item command="heat">
                                            <svg-icon iconClass="icon-zhire" />
                                        </el-dropdown-item>
                                        <el-dropdown-item command="cool">
                                            <svg-icon iconClass="icon-zhileng" />
                                        </el-dropdown-item>
                                        <el-dropdown-item command="dry">
                                            <svg-icon iconClass="icon-chushi" />
                                        </el-dropdown-item>
                                        <el-dropdown-item command="fan">
                                            <svg-icon iconClass="icon-songfeng" />
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </span>
                            <span class="mode-current">
                                <svg-icon iconClass="icon-iconfontmoshi" />
                                <!-- <i>{{status.luminance}}</i> -->
                            </span>
                        </div>
                    </div>
                    <div class="view-lighting-control-content-bottom">
                        <span>
                            <i>扫风</i>
                            <el-dropdown placement="bottom"
                                         trigger="click"
                                         @command="selectSwing">
                                <el-button class="button"
                                           circle
                                           plain>
                                    <svg-icon :iconClass="swingIcon" />
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="left_right">
                                        <svg-icon iconClass="icon-zuoyoubaifeng" />
                                    </el-dropdown-item>
                                    <el-dropdown-item command="up_down">
                                        <svg-icon iconClass="icon-shangxiabaifeng" />
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </span>
                        <span>
                            <i>风力</i>
                            <el-dropdown placement="bottom"
                                         trigger="click"
                                         @command="selectSpeed">
                                <el-button class="button"
                                           circle
                                           plain>
                                    <svg-icon :iconClass="speedIcon" />
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="1">
                                        <svg-icon iconClass="icon-xiaofeng" />
                                    </el-dropdown-item>
                                    <el-dropdown-item command="2">
                                        <svg-icon iconClass="icon-zhongfeng" />
                                    </el-dropdown-item>
                                    <el-dropdown-item command="3">
                                        <svg-icon iconClass="icon-dafeng" />
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </span>
                        <span>
                            <i>开启/关闭</i>
                            <el-button class=" button"
                                       type="info"
                                       circle
                                       plain>
                                <svg-icon iconClass="icon-guanbi" />
                            </el-button>
                        </span>
                    </div>
                </el-card>
                <el-card class="view-lighting-control-footer">
                    <span>定时任务</span>
                </el-card>
            </el-col>
        </el-row>
        <drawer :show.sync="show" />
    </div>
</template>

<script>
import Drawer from '@/components/drawer';
import AppBubble from '@/components/appBubble';
import LogCard from '@/components/logCard';
import { ICONS } from '../config.js';

export default {
	name: 'ViewLighting',
	data() {
		return {
			activeName: 'first',
			show: false,
			number: 0,
			temp: 24,
			icons: ICONS,
			modeIcon: 'icon-zidong-',
			swingIcon: 'icon-zuoyoubaifeng',
			speedIcon: 'icon-xiaofeng',
		};
	},

	computed: {
		roomName() {
			const el = this.$store.state.rooms.find(
				el => el.roomId === this.device.roomId
			);
			if (el) {
				return el.name;
			}
			return '';
		},

		status() {
			return this.$store.state.status[this.device.deviceId];
		},

		partLogs() {
			let logs = [];

			this.logs.forEach((el, index) => {
				let element = {};
				if (index > 4) {
					return;
				}
				Object.keys(el.desired).forEach(key => {
					if (this.logWord[key]) {
						element.log = `${this.logWord[key]}${
							this.logWord[el.desired[key]]
						}`;
					}
				});
				element.source = el.source;
				element.logType = el.logType;
				element.createTime = new Date(el.createTime).toLocaleString();
				logs.push(element);
			});
			return logs;
		},
	},

	methods: {
		selectMode(command) {
			this.modeIcon = this.icons[command];
		},

		selectSwing(command) {
			this.swingIcon = this.icons[command];
		},

		selectSpeed(command) {
			this.speedIcon = this.icons[command];
		},
	},

	props: {
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
		Drawer,
		AppBubble,
		LogCard,
	},
};
</script>

<style lang="scss" scoped>
.view-lighting {
	&-left {
		&-top,
		&-bottom {
			display: flex;
		}

		&-bottom-log {
			width: 100%;
			margin-top: 10px;
			margin-right: 10px;
		}
	}

	&-info {
		width: 30%;
		height: 350px;

		&-content {
			&-item {
				width: 100%;
				height: 50px;
				line-height: 50px;
				color: #909399;

				@include flex-start();

				i:nth-of-type(1) {
					width: 80px;
					display: block;
				}
			}
		}
	}

	&-bubble {
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
						to right,
						#43e97b 0%,
						#38f9d7 100%
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
		}

		&-content-middle {
			.el-input-number {
				width: 120px;
				margin-left: 10px;
			}

			.temp {
				height: 80px;
				@include flex-center();

				&-setting {
					width: 60%;
					height: 100%;
					border-bottom: 1px solid #e4e7ed;
					@include flex-between();
				}

				&-current {
					width: 40%;
					font-size: 36px;
					@include flex-center();

					svg {
						font-size: 36px;
						color: #909399;
					}

					i {
						margin-left: 10px;
					}
				}
			}

			.mode {
				height: 80px;
				@include flex-center();

				&-setting {
					width: 60%;
					height: 100%;
					border-bottom: 1px solid #e4e7ed;
					@include flex-between();

					.el-button {
						margin: 0 40px;
					}
				}

				&-current {
					width: 40%;
					font-size: 36px;
					@include flex-center();

					svg {
						font-size: 36px;
						color: #909399;
					}

					i {
						margin-left: 10px;
					}
				}
			}
		}

		&-content-bottom {
			height: 100px;
			@include flex-center();
			span {
				flex: 1;
				@include flex-center(column);
				i {
					color: #909399;
					font-size: 14px;
					margin: 10px 0;
				}
			}
		}

		&-footer {
			height: 100%;
			width: 100%;
			margin-top: 10px;

			span {
				display: block;
				height: 100px;
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
