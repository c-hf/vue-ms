module.exports = {
	// baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
	// baseUrl: '/smartHome/',
	// outputDir: 'dist',
	// outputDir: process.env.outputDir,
	// publicPath: '/smartHome/',
	// productionSourceMap: false,
	configureWebpack: {
		externals: {
			vue: 'Vue',
			'vue-router': 'VueRouter',
			vuex: 'Vuex',
			axios: 'axios',
			'element-ui': 'ELEMENT',
			TweenMax: 'TweenMax',
			Draggable: 'draggable',
		},
	},
};
