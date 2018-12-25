<template>
    <el-card class="home-map"
             v-loading="loading">
        <div id="map"
             ref="map"
             :style="{width: '300px', height: '300px'}"></div>
    </el-card>
</template>

<script>
export default {
	name: 'HomeMap',
	data() {
		return {
			loading: false,
		};
	},
};
</script>

<style lang="scss" scoped>
</style>
