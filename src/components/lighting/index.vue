<template>
    <el-col :span="10">
        <el-card class="lighting-card">
            <el-col :span="18"
                    class="lighting-card-left">
                <span class="lighting-card-left-item lighting-card-left-room">{{roomName}}</span>
                <span class="lighting-card-left-item lighting-card-left-name">{{device.name}}</span>
                <span class="lighting-card-left-item lighting-card-left-btn">

                    <el-button :class="{'lighting-card-left-btn-on':device.onLine}"
                               icon="fa fa-power-off"
                               circle></el-button>
                    <el-button icon="fa fa-power-off"
                               circle></el-button>
                    <el-button icon="fa fa-power-off"
                               circle></el-button>
                </span>
                <!-- <el-slider v-model="luminance"
                           :step="10">
                </el-slider> -->
            </el-col>
            <el-col :span="5"
                    :offset="1">
            </el-col>
        </el-card>
    </el-col>
</template>

<script>
export default {
	name: 'CeilingLamp',
	data() {
		return {
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
	},
	props: {
		device: {
			type: Object,
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.lighting-card {
	&-left {
		padding-bottom: 40px;
		@include flex-center(column);
		align-items: flex-start;
		&-item {
			margin-top: 10px;
		}
		&-room {
			margin-left: 10px;
		}
		&-name {
			margin-left: 10px;
		}
		&-btn {
			margin-top: 20px;

			&-on {
				color: #409eff;
				border-color: #409eff;
			}
		}
	}
}
</style>
