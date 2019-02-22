module.exports = {
	// baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
	outputDir: process.env.outputDir,
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
