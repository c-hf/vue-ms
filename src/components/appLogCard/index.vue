<template>
    <el-card class="log-card"
             shadow="never"
             body-style="height:160px">
        <el-scrollbar style="height:100%">
            <div v-for="(item, index) in logsDate"
                 :key="index">
                <span class="log-card-date">
                    {{ item.split('/')[1] }}
                    <i>
                        {{ item.split('/')[0] }}月
                    </i>
                </span>
                <span class="log-card-text"
                      :class="{info:item.logType === 'info',
                      warn:item.logType === 'warn',
                      now: index===0 && textIndex === 0}"
                      v-for="(item, textIndex) in logsText[item]"
                      :key="textIndex">
                    <i class="message">
                        {{ item.time }} {{ item.message }}
                    </i>
                    <i>
                        来自 {{ item.source }}
                    </i>
                </span>
            </div>
            <div class="log-card-error"
                 v-if="!logsDate.length">
            </div>
            <div class="log-card-btn">
                <el-button type="text"
                           @click="more">
                    查看更多
                </el-button>
            </div>
        </el-scrollbar>
    </el-card>
</template>

<script>
import { DEVICESOURCE } from '@/config/index.js';
// import { getDeviceLogById } from '@/api/device';

export default {
	name: 'AppLogCard',
	data() {
		return {
			source: DEVICESOURCE,
			// logs: [],
			// socket: {},
		};
	},

	computed: {
		logsText() {
			let logs = {};
			this.deviceLogs.forEach(el => {
				if (this.logType === 'warn' && el.logType === 'info') {
					return;
				}
				let [element, date, time] = [{}, [], []];
				const createTime = new Date(el.createTime)
					.toLocaleString('zh-CN', { hour12: false })
					.split(' ');
				element.source = this.source[el.source];
				element.logType = el.logType;
				element.message = el.message;
				date = createTime[0].split('/');
				date.shift();
				element.date = date.join('/');
				time = createTime[1].split(':');
				time.splice(2, 1);
				element.time = time.join(':');
				if (!logs[element.date]) {
					logs[element.date] = [];
				}
				logs[element.date].push(element);
			});
			return logs;
		},

		logsDate() {
			return Object.keys(this.logsText).sort((a, b) => {
				const [a_date, b_date] = [a.split('/'), b.split('/')];
				if (a_date[0] === b_date[0]) {
					return b_date[1] - a_date[1];
				} else {
					return b_date[1] - a_date[1];
				}
			});
		},
	},

	methods: {
		// 查看更多
		more() {
			this.$emit('more');
		},

		// 监听日志更新
		// socketOn() {
		// 	try {
		// 		this.socket = this.$store.state.socket;
		// 		if (!this.socket.on || this.logType === 'warn') {
		// 			return;
		// 		}
		// 		this.socket.on(`${this.deviceId}-updateDeviceLog`, data => {
		// 			this.logs.unshift(data);
		// 		});
		// 	} catch (error) {
		// 		this.$message({
		// 			showClose: true,
		// 			center: true,
		// 			message: error.message,
		// 			type: 'error',
		// 		});
		// 	}
		// },

		// 获取日志
		// getDeviceLogByIdFn() {
		// 	if (!this.deviceId) {
		// 		return;
		// 	}

		// 	getDeviceLogById({
		// 		deviceId: this.deviceId,
		// 		dayNum: 0,
		// 	}).then(resData => {
		// 		this.logs = resData;
		// 	});
		// },
	},

	props: {
		// deviceId: {
		// 	type: String,
		// },

		logType: {
			type: String,
			default: 'log',
		},

		deviceLogs: {
			type: Array,
			default: () => {
				return [];
			},
		},
	},

	// watch: {
	// 	deviceId() {
	// 		this.getDeviceLogByIdFn();
	// 		this.socketOn();
	// 	},
	// },

	// created() {
	// 	this.getDeviceLogByIdFn();
	// },

	// mounted() {
	// 	this.socketOn();
	// },

	// destroyed() {
	// 	if (this.socket.on) {
	// 		this.socket.off(`${this.deviceId}-updateDeviceLog`);
	// 	}
	// },
};
</script>

<style lang="scss" scoped>
.log-card {
	&-date {
		display: block;
		font-size: 32px;
		font-weight: bold;

		i {
			font-size: 16px;
			font-weight: normal;
			color: #909399;
		}
	}

	&-text {
		padding: 20px 0;
		display: block;
		margin-left: 40px;
		position: relative;
		@include flex-between();

		.message {
			width: 70%;
			@include ellipsis();
		}

		i:nth-of-type(2) {
			font-size: 12px;
			color: #c0c4cc;
			padding-right: 20px;
		}

		&::after {
			content: ' ';
			display: block;
			height: 12px;
			width: 12px;
			border-radius: 50%;
			position: absolute;
			top: 50%;
			left: -20px;
			margin-top: -6px;
		}
	}

	&-error {
		height: 160px;
		background-image: url(~@/assets/img/svg/no_data.svg);
		background-size: 80% 80%;
		background-position: center center;
		background-repeat: no-repeat;
	}

	&-btn {
		display: block;
		@include flex-center();
	}

	.info {
		&::after {
			background-image: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
		}
	}

	.now {
		&::after {
			background-image: linear-gradient(
				to right,
				#43e97b 0%,
				#38f9d7 100%
			);
		}
	}

	.warn {
		&::after {
			background-image: linear-gradient(to top, #ff0844 0%, #ffb199 100%);
		}
	}
}
</style>
