<template>
    <div>
        <el-row class="home"
                :gutter="24">
            <el-col :span="8">
                <el-card class="home-card home-card-on-line-device"
                         :body-style="{display: 'flex',
                     'align-items': 'center',
                     'justify-content':'space-around'}">
                    <div class="home-card-item ">
                        <span class="home-card-item-title">
                            在线设备
                        </span>
                        <span class="home-card-item-num">
                            {{ onLineDeviceNum }}
                            <i>台</i>
                        </span>
                    </div>
                    <div class="home-card-icon">
                        <svg-icon iconClass="icon-zaixian" />
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="home-card home-card-line-device"
                         :body-style="{display: 'flex',
                     'align-items': 'center',
                     'justify-content':'space-around'}">
                    <div class="home-card-item">
                        <span class="home-card-item-title">
                            离线设备
                        </span>
                        <span class="home-card-item-num">
                            {{ lineDeviceNum }}
                            <i>台</i>
                        </span>
                    </div>
                    <div class="home-card-icon">
                        <svg-icon iconClass="icon-lixian" />
                    </div>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card class="home-card home-card-device-info"
                         :body-style="{display: 'flex',
                     'align-items': 'center',
                     'justify-content':'space-around'}">
                    <div class="home-card-item">
                        <span class="home-card-item-title">
                            <svg-icon iconClass="icon-tools" />
                            信息概览
                        </span>
                        <span class="home-card-item-info device-info-num">
                            <svg-icon iconClass="icon-device" />
                            设备总数:
                            <i class="num">{{ totalNum }}</i>
                        </span>
                        <span class="home-card-item-info device-info-warning">
                            <svg-icon iconClass="icon-shebeigaojing" />
                            告警信息:
                            <i class="num">{{ warnNum }}</i>
                        </span>
                    </div>
                    <div class="home-card-icon">
                        <svg-icon iconClass="icon-document" />
                    </div>
                </el-card>
            </el-col>
            <el-col :span="14"
                    :lg="12">
                <view-weather />
                <view-map />
            </el-col>
            <el-col :span="10"
                    :lg="12">
                <view-todo-list ref="ToDoList"
                                @addTodoList="addTodoList"
                                @editTodoList="editTodoList" />
            </el-col>
        </el-row>
        <app-drawer :show.sync="drawerVisible"
                    :width="520">
            <drawer-to-do-list v-if="drawerVisible"
                               :todoData="todoData"
                               @getTodoList="getTodoList" />
        </app-drawer>
    </div>
</template>

<script>
import AppDrawer from '@/components/appDrawer';
import ViewWeather from './components/weather';
import ViewMap from './components/map';
import ViewTodoList from './components/TodoList';
import DrawerToDoList from './components/drawerToDoList';

export default {
	name: 'Home',
	data() {
		return {
			drawerVisible: false,
			warnNum: 0,
			data: {},
		};
	},

	computed: {
		// 总数
		totalNum() {
			return this.$store.state.device.length;
		},

		// 在线数
		onLineDeviceNum() {
			let num = 0;
			this.$store.state.device.forEach(el => {
				if (el.onLine) {
					num += 1;
				}
			});
			return num;
		},

		// 离线数
		lineDeviceNum() {
			return this.totalNum - this.onLineDeviceNum;
		},
	},

	methods: {
		// 添加
		addTodoList() {
			this.todoData = {
				todoId: '',
				todoType: '1',
				content: '',
				time: '',
			};
			this.drawerVisible = true;
		},

		// 获取
		getTodoList() {
			this.drawerVisible = false;
			this.$refs.ToDoList.getTodoListFn();
		},

		// 编辑
		editTodoList(data) {
			this.todoData = {
				todoId: data.todoId,
				todoType: data.todoType,
				content: data.content,
				time: data.time,
			};
			this.drawerVisible = true;
		},
	},

	components: {
		AppDrawer,
		ViewWeather,
		ViewMap,
		ViewTodoList,
		DrawerToDoList,
	},
};
</script>

<style lang="scss" scoped>
.home {
	background-color: inherit;

	&-card {
		margin-bottom: 20px;

		&-item {
			width: 50%;
			height: 100px;
			@include flex-center(column);
			align-items: flex-start;

			&-title {
				padding-left: 20px;
				font-size: 16px;
			}
		}

		&-icon {
			height: 80px;
			width: 80px;
			font-size: 36px;
			border-radius: 50%;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			@include flex-center();
		}

		&-on-line-device,
		&-line-device {
			.home-card-item-title {
				margin-left: 10px;
				position: relative;

				&::before {
					content: '';
					display: block;
					width: 10px;
					height: 10px;
					border-radius: 50%;
					background-color: rgba($color: #67c23a, $alpha: 1);
					position: absolute;
					left: 0px;
					top: 6.4px;
				}
			}

			.home-card-item-num {
				display: block;
				margin-top: 10px;
				font-size: 48px;
				padding-left: 40px;

				i {
					font-style: normal;
					font-size: 16px;
					margin-left: 5px;
				}
			}

			.home-card-icon {
				background-color: rgba($color: #409eff, $alpha: 0.8);
				color: #fff;
			}
		}

		&-line-device {
			.home-card-item-title {
				&::before {
					background-color: rgba($color: #f56c6c, $alpha: 1);
				}
			}
			.home-card-icon {
				background-color: rgba($color: #f56c6c, $alpha: 0.8);
				color: #fff;
			}
		}
		&-device-info {
			.home-card-item-info {
				font-size: 14px;
				margin-top: 10px;
				margin-left: 40px;
				color: rgba(48, 49, 51, 0.6);

				i {
					margin-left: 10px;
					color: rgba(48, 49, 51, 1);
				}
			}

			.home-card-icon {
				background-color: rgba($color: #909399, $alpha: 0.8);
				color: #fff;
			}
		}
	}
}
</style>
