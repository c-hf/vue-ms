<template>
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
                <i v-if="deviceStatus.switch.value">
                    {{device.categoryItemName}}
                    开启
                    {{ deviceStatus.switch.value}}
                </i>
                <i v-else>
                    已关闭
                    {{ deviceStatus.switch.value}}
                </i>
            </span>
        </el-col>
        <el-col :span="12"
                class="lighting-card-right">
            <span class="lighting-card-right-icon">
                <svg-icon iconClass="icon-ceilingLamp" />
            </span>
            <span class="lighting-card-right-online"
                  :class="{on: isOn}">
            </span>
        </el-col>
    </el-card>
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
			this.device.status.forEach(el => {
				status[el.id] = {
					name: el.name,
					value: el.value,
					unit: el.unit,
				};
			});
			let value = true;
			console.log(status.switch.value);
			if (
				status.switch.value === 'true' ||
				status.switch.value === true
			) {
				value = true;
			} else {
				value = false;
			}
			status.switch.value = value;
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
			font-size: 100px;
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
