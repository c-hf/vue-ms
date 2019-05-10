<template>
    <el-card class="log-card"
             shadow="never"
             :body-style="{height: `${height}px`, padding: '10px'}">
        <el-scrollbar style="height: 100%">
            <el-timeline :style="{ margin: '20px'}">
                <el-timeline-item v-for="(item, index) in logs"
                                  :key="index"
                                  :timestamp="item.time"
                                  placement="top"
                                  :type="item.type">
                    <div class="content">
                        <span class="message">
                            {{ item.message }}
                        </span>
                        <span>
                            ——— 操作来自 {{ item.source }}
                        </span>
                    </div>
                </el-timeline-item>
            </el-timeline>
            <div class="log-card-error"
                 v-if="!logs.length"
                 :style="{height: `${height}px`,}">
                <svg-icon class="error-icon"
                          iconClass="icon-meiyoushuju" />
                暂无日志
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

export default {
	name: 'AppLogCard',
	data() {
		return {
			source: DEVICESOURCE,
		};
	},

	computed: {
		logs() {
			const logTypes = {
				warn: 'danger',
				info: 'primary',
			};
			let logs = [];
			this.deviceLogs.forEach(el => {
				if (this.logType === 'warn' && el.logType === 'info') {
					return;
				}
				let element = {};
				const createTime = new Date(el.createTime).toLocaleString(
					'zh-CN',
					{ hour12: false }
				);
				element.source = this.source[el.source];
				element.logType = el.logType;
				element.message = el.message;
				element.time = createTime;
				element.type = logTypes[el.logType];
				logs.push(element);
			});
			return logs;
		},
	},

	methods: {
		// 查看更多
		more() {
			this.$emit('more');
		},
	},

	props: {
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

		height: {
			type: Number,
			default: 240,
		},
	},
};
</script>

<style lang="scss" scoped>
.log-card {
	.content {
		border: 1px solid #f2f6fc;
		border-radius: 4px;
		padding: 20px;
		margin-right: 20px;

		span {
			display: block;
		}

		span:nth-of-type(2) {
			text-align: right;
			font-size: 12px;
			color: #c0c4cc;
			padding-right: 20px;
		}
	}

	&-error {
		color: #c0c4cc;
		@include flex-center();

		.error-icon {
			font-size: 48px;
			margin: 10px;
		}
	}

	&-btn {
		display: block;
		@include flex-center();
	}
}
</style>
