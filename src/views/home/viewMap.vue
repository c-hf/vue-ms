<template>
    <el-card class="view-map"
             v-loading="loading">
        <div class="map"
             ref="map">
        </div>
    </el-card>
</template>

<script>
import 'echarts/map/js/china.js';
import 'echarts/lib/chart/map';

export default {
	name: 'ViewMap',
	data() {
		return {
			loading: false,
			echart: {},
		};
	},
	methods: {
		map() {
			this.echart = this.$echarts.init(this.$refs.map);
			this.echart.setOption({
				geo: {
					map: 'china', // 表示中国地图
					roam: true,
					center: null,
					zoom: 8,
					label: {
						normal: {
							show: true, // 是否显示对应地名
							textStyle: {
								color: 'rgba(0,0,0,0.4)',
							},
						},
					},
					itemStyle: {
						normal: {
							borderColor: 'rgba(0, 0, 0, 0.2)',
						},
						emphasis: {
							areaColor: null,
							shadowOffsetX: 0,
							shadowOffsetY: 0,
							shadowBlur: 20,
							borderWidth: 0,
							shadowColor: 'rgba(0, 0, 0, 0.5)',
						},
					},
				},
			});
		},
	},
	mounted() {
		this.map();
	},
};
</script>

<style lang="scss" scoped>
.view-map {
	margin-bottom: 20px;

	.map {
		width: 100%;
		height: 300px;
	}
}
</style>
