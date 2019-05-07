<template>
    <el-card class="view-rooms-info"
             :body-style="{display: 'flex'}"
             v-loading="loading">
        <div ref="myEchart"
             class="view-rooms-info-echart">
        </div>
        <div class="view-rooms-info-tree">
            <el-tree :data="treeData"
                     :props="defaultProps"
                     :allow-drop="allowDrop"
                     :allow-drag="allowDrag"
                     draggable
                     @node-drop="handleDrop">
            </el-tree>
            <el-button class="view-rooms-info-tree-btn"
                       icon="el-icon-plus"
                       circle
                       size="small"
                       @click="addRoom">
            </el-button>
        </div>
    </el-card>
</template>

<script>
import 'echarts/lib/chart/graph';

import { DEVICECOLOR } from '../config.js';
import { updateDevice } from '@/api/device';

export default {
	name: 'ViewRoomsInfo',
	data() {
		return {
			loading: false,
			echart: {},
			deviceColor: DEVICECOLOR,
			defaultProps: {
				children: 'children',
				label: 'label',
			},
		};
	},

	computed: {
		rooms() {
			return this.$store.state.rooms;
		},

		device() {
			return this.$store.state.device;
		},

		treeData() {
			let [data, relation] = [[], {}];
			this.rooms.forEach((el, index) => {
				data.push({ roomId: el.roomId, label: el.name, children: [] });
				relation[el.roomId] = index;
			});
			this.device.forEach(el => {
				if (!data.length) {
					return;
				}
				data[relation[el.roomId]].children.push({
					deviceId: el.deviceId,
					roomId: el.roomId,
					label: el.name,
				});
			});
			return data;
		},

		category() {
			let category = {};
			this.rooms.forEach((el, index) => {
				category[el.roomId] = index;
			});
			return category;
		},

		graph() {
			let [nodes, links] = [[], []];
			this.device.forEach(el => {
				let [value, opacity] = ['', 1];
				el.onLine
					? ((value = '在线'), (opacity = 1))
					: ((value = '离线'), (opacity = 0.3));
				nodes.push({
					id: el.deviceId,
					name: el.name,
					symbolSize: 20,
					category: this.category[el.roomId],
					itemStyle: {
						normal: {
							color: this.deviceColor[el.categoryItemId],
							opacity: opacity,
						},
					},
					label: {
						normal: {
							show: true,
						},
					},
					value: [value],
					x: null,
					y: null,
				});
			});
			this.$store.state.rooms.forEach(el => {
				nodes.push({
					id: el.roomId,
					name: el.name,
					category: this.category[el.roomId],
					symbolSize: 50,
					label: {
						normal: {
							show: true,
						},
					},
					value: [`ID - ${el.roomId}`],
					x: this.randomNum(10),
					y: this.randomNum(10),
				});
			});
			this.device.forEach((el, index) => {
				links.push({
					id: index,
					source: el.deviceId,
					target: el.roomId,
				});
			});
			return { nodes, links };
		},
	},

	methods: {
		addRoom() {
			this.$emit('addRoom');
		},

		// 随机数坐标
		randomNum(max) {
			return Math.floor(Math.random() * (max + 1));
		},

		// 绘制关系图
		relationDiagram() {
			this.echart = this.$echarts.init(this.$refs.myEchart);
			// 绘制图表
			this.echart.setOption({
				title: {
					text: '房间设备关系',
					subtext: 'Default layout',
					top: 'bottom',
					left: 'right',
				},
				tooltip: {},
				legend: [
					{
						data: this.rooms.map(el => {
							return el.name;
						}),
					},
				],
				animationDuration: 1500,
				animationEasingUpdate: 'quinticInOut',
				series: [
					{
						type: 'graph',
						layout: 'force',
						data: this.graph.nodes,
						links: this.graph.links,
						categories: this.rooms,
						roam: true,
						focusNodeAdjacency: true,
						draggable: true,
						itemStyle: {
							normal: {
								borderColor: '#fff',
								borderWidth: 1,
								shadowBlur: 10,
								shadowColor: 'rgba(0, 0, 0, 0.5)',
							},
						},
						label: {
							position: 'right',
							formatter: '{b}',
						},
						lineStyle: {
							color: 'source',
						},
						emphasis: {
							lineStyle: {
								width: 5,
							},
						},
						force: {
							repulsion: 500,
						},
					},
				],
			});
		},

		// 更新数据
		updatedEchart() {
			this.echart.setOption({
				legend: [
					{
						data: this.rooms.map(el => {
							return el.name;
						}),
					},
				],
				series: [
					{
						data: this.graph.nodes,
						links: this.graph.links,
						categories: this.rooms,
					},
				],
			});
		},

		// 拖放相关方法
		allowDrop(draggingNode, dropNode, type) {
			if (dropNode.level === 1 && type === 'inner') {
				return true;
			} else if (dropNode.level === 2 && type !== 'inner') {
				return true;
			} else {
				return false;
			}
		},

		// 拖放相关方法
		allowDrag(draggingNode) {
			return draggingNode.level === 2;
		},

		// 拖放相关方法
		handleDrop(draggingNode, dropNode) {
			if (draggingNode.data.roomId === dropNode.data.roomId) {
				return;
			}
			const data = {
				roomId: dropNode.data.roomId,
			};
			this.updateDeviceFn(draggingNode.data.deviceId, data);
		},

		// 更新设备相关信息
		updateDeviceFn(deviceId, data) {
			this.loading = true;
			updateDevice({ deviceId: deviceId, data: data })
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							center: true,
							message: '修改成功',
							type: 'success',
						});
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
	},

	mounted() {
		this.relationDiagram();
		this.$watch('graph', newVal => {
			if (newVal.nodes.length && newVal.links.length) {
				this.updatedEchart();
			}
		});
	},
};
</script>

<style lang="scss" scoped>
.view-rooms-info {
	&-echart {
		width: 80%;
		height: calc(100vh - 400px);
		min-height: 408px;
	}

	&-tree {
		width: 20%;
		height: calc(100vh - 400px);
		min-height: 408px;
		position: relative;

		&-btn {
			position: absolute;
			bottom: 10px;
			right: 5px;
		}
	}
}
</style>
