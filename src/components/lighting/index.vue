<template>
    <!-- <el-col :span="8"> -->
    <el-card class="lighting-card">
        <el-col :span="12"
                class="lighting-card-left">
            <span class="lighting-card-left-item lighting-card-left-room">
                {{roomName}}
            </span>
            <span class="lighting-card-left-item lighting-card-left-name">
                {{roomName}} - {{device.name}}
            </span>
            <span class="lighting-card-left-item lighting-card-left-info">
                <i v-if="deviceStatus.switch.value === 'true'">已关闭</i>
                <i v-else>{{device.categoryItemName}}开启</i>
                <!-- <i>
                    亮度:
                    <el-progress :text-inside="true"
                                 :stroke-width="18"
                                 :percentage="deviceStatus.luminance.value"
                                 status="success"></el-progress>
                </i> -->
            </span>
        </el-col>
        <el-col :span="12"
                class="lighting-card-right">
            <span class="lighting-card-right-icon"><img src="../../assets/img/device/4.png"
                     alt=""></span>
            <span class="lighting-card-right-online"
                  :class="{on: isOn}"></span>
        </el-col>
    </el-card>
    <!-- </el-col> -->
</template>

<script>
export default {
	name: 'CeilingLamp',
	data() {
		return {
			isOn: false,
			luminance: 0,
		};
	},
	computed: {
		roomName() {
			const index = this.$store.state.rooms.findIndex(value => {
				return value.roomId === this.device.roomId;
			});
			return this.$store.state.rooms[index].name;
		},
		deviceStatus() {
			let status = {};
			// console.log(this.device.status);
			this.device.status.forEach(el => {
				status[el.id] = {
					name: el.name,
					value: el.value,
					unit: el.unit,
				};
			});
			return status;
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
@import '~@/assets/scss/mixins';

.lighting-card {
	margin-bottom: 20px;
	height: 180px;
	user-select: none;
	cursor: pointer;

	.el-card__body {
		padding: 0;
	}
	.el-col {
		height: 180px;
	}

	&-left {
		padding: 20px 0;
		@include flex-center(column);
		align-items: flex-start;
		justify-content: flex-start;

		&-item {
			margin-top: 10px;
			margin-left: 20px;
		}

		// &-room {
		// }
		// &-name {
		// 	margin-left: 10px;
		// }
		&-info {
			width: 100%;
			margin-top: 20px;
			@include flex-center(column);

			i {
				width: 100%;
				margin: 5px 0;

				.el-progress {
					margin-top: 10px;
				}
			}
		}
	}

	&-right {
		@include flex-center(column);

		&-icon {
			display: block;
			width: 100px;
			height: 100px;
			border-radius: 50%;
			// background-image: url(~@/assets/img/device/1.png);
			// background-color: rgba($color: #d7dada, $alpha: 0.3);
			// background-size: 120% 120%;
			// background-position: center center;
			// background-repeat: no-repeat;
		}

		&-switch {
			width: 20px;
			height: 4px;
			border-radius: 2px;
			background-color: #909399;
		}
	}

	.on {
		background-color: #67c23a;
	}
}
</style>
