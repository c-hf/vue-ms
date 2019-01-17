<template>
    <el-scrollbar style="height:100%;"
                  class="app-drawer-card"
                  v-loading="loading">
        <div class="app-drawer-card-title">
            <span class="app-drawer-card-title-text">
                操作日志
            </span>
            <span class="app-drawer-card-title-btn">
                <el-radio v-model="radio"
                          label="3"
                          @change="getDeviceLogByIdFn">最近三天</el-radio>
                <el-radio v-model="radio"
                          label="7"
                          @change="getDeviceLogByIdFn">最近七天</el-radio>
                <el-radio v-model="radio"
                          label="30"
                          @change="getDeviceLogByIdFn">最近一月</el-radio>
            </span>
        </div>
        <div v-for="(item, index) in logsDate"
             :key="index">
            <span class="app-drawer-card-date">
                {{ item.split('/')[1] }}
                <i>
                    {{ item.split('/')[0] }}月
                </i>
            </span>
            <span class="app-drawer-card-text"
                  :class="{info:item.logType === 'info',
                      warn:item.logType === 'warn',
                      now: index===0 && textIndex === 0}"
                  v-for="(item, textIndex) in logsText[item]"
                  :key="textIndex">
                <i>
                    {{ item.time }} {{ item.message }}
                </i>
                <i>
                    操作来自 {{ item.source }}
                </i>
            </span>
        </div>
        <div class="app-drawer-card-error"
             v-if="!logsDate.length">
        </div>
        <div class="app-drawer-card-btn"
             v-if="logsDate.length">
            <el-button icon="el-icon-delete"
                       circle
                       plain
                       @click="deleteLogs">
            </el-button>
            <span class="app-drawer-card-btn-text">
                清空日志
            </span>
        </div>
    </el-scrollbar>
</template>

<script>
import { SOURCE, LOGWORD } from './config.js';
import { getDeviceLogById, deleteDeviceLog } from '@/api/device';

export default {
	name: 'AppDrawerCard',
	data() {
		return {
			loading: false,
			infoWord: LOGWORD,
			source: SOURCE,
			radio: '3',
			logs: [],
		};
	},

	computed: {
		logsText() {
			let logs = {};
			this.logs.forEach(el => {
				let element = {};
				element.source = this.source[el.source];
				element.logType = el.logType;
				element.message = el.message;
				const createTime = new Date(el.createTime)
					.toLocaleString('zh-CN', { hour12: false })
					.split(' ');
				let date = createTime[0].split('/');
				date.shift();
				element.date = date.join('/');
				element.time = createTime[1];
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
		deleteLogs() {
			this.loading = true;
			deleteDeviceLog({ deviceId: this.deviceId })
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							center: true,
							message: '删除成功！',
							type: 'success',
						});

						this.getDeviceLogByIdFn();
						this.$emit('deleteLogs');
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

		// 查看更多
		more() {
			this.$emit('more');
		},

		// 获取日志
		getDeviceLogByIdFn() {
			if (!this.deviceId) {
				return;
			}
			this.loading = true;
			getDeviceLogById({
				deviceId: this.deviceId,
				dayNum: this.radio,
			})
				.then(resData => {
					this.logs = resData;
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

	props: {
		deviceId: {
			type: String,
		},
	},

	watch: {
		deviceId() {
			this.getDeviceLogByIdFn();
		},
	},

	created() {
		this.getDeviceLogByIdFn();
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.app-drawer-card {
	&-title {
		@include flex-start(column);
		padding: 20px;
		&-text {
			color: #303133;
			font-size: 20px;
		}

		&-btn {
			padding-top: 20px;
		}
	}

	&-date {
		padding: 20px;
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
		margin-left: 60px;
		margin-right: 20px;
		position: relative;
		@include flex-between();

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
		padding: 20px 0;
		display: block;
		@include flex-center(column);

		&-text {
			font-size: 12px;
			color: #909399;
			margin-top: 10px;
		}
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
