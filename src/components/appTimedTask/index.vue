<template>
    <div class="app-timed-task">
        <div class="app-timed-task-title">
            定时任务
        </div>
        <div class="app-timed-task-time">
            <span class="app-timed-task-time-title">
                时间设置
            </span>
            <span class="app-timed-task-time-content">
                <i>小时</i>
                <el-input-number v-model="hour"
                                 :min="0"
                                 :max="24"
                                 controls-position="right"
                                 label="小时"
                                 @change="hourChange">
                </el-input-number>
                <i>分钟</i>
                <el-input-number v-model="minute"
                                 :min="0"
                                 :max="60"
                                 controls-position="right"
                                 label="分钟"
                                 @change="minuteChange">
                </el-input-number>
            </span>
        </div>
        <ceiling-lamp v-if="categoryItemId === 'ceilingLamp'"
                      ref="task" />
        <div slot="footer"
             class="app-timed-task-btn">
            <el-button type="primary"
                       plain
                       @click="onSubmit">
                确定
            </el-button>
            <el-button plain
                       @click="onReset">
                重置
            </el-button>
        </div>
    </div>
</template>

<script>
import CeilingLamp from './ceilingLamp';

export default {
	name: 'AppTimedTask',
	data() {
		return {
			hour: 0,
			minute: 0,
		};
	},

	methods: {
		onSubmit() {},

		onReset() {},

		hourChange(value) {
			if (value >= 24) {
				this.minute = 0;
			}
		},

		minuteChange(value) {
			if (value === 60) {
				this.hour = this.hour + 1;
				this.minute = 0;
			}
			if (this.hour >= 24) {
				this.minute = 0;
			}
		},
	},

	props: {
		categoryItemId: String,
	},

	components: {
		CeilingLamp,
	},
};
</script>

<style lang="scss">
@import '~@/assets/scss/mixins';
.app-timed-task {
	&-title {
		padding: 20px;
		text-align: center;
		line-height: 60px;
		font-size: 20px;
	}

	&-time {
		padding: 0 20px;

		&-title {
			display: block;
			padding: 20px 0;
			font-weight: bold;
		}

		&-content {
			text-align: center;
			display: block;
			padding: 10px 0;
			@include flex-around();
			i {
				padding: 0 10px;
			}
		}
		.el-input-number {
			width: 140px;
		}
	}

	&-task {
		padding: 0 20px;

		&-title {
			display: block;
			padding: 20px 0;
			font-weight: bold;
		}

		&-item {
			height: 80px;
			border: 1px solid #e4e7ed;
			border-radius: 5px;
			margin: 10px 0;
			@include flex-start();
			i {
				width: 120px;
				display: block;
				padding-left: 50px;
			}

			.el-slider {
				width: 200px;
			}
		}
	}

	&-btn {
		padding: 20px;
		@include flex-center();
	}
}
</style>
