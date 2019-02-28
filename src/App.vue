<template>
    <div id="app"
         ref="app">
        <router-view />
    </div>
</template>
<script>
export default {
	data() {
		return {};
	},

	methods: {},

	created() {
		setTimeout(() => {
			const loading = document.querySelector('#loading');
			if (loading) {
				document.body.removeChild(loading);
			}
		}, 0);
	},
};
</script>

<style lang="scss" scoped>
#app {
	width: 100%;
	height: 100%;
	position: relative;
}
</style>
