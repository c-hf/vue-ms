module.exports = {
	// baseUrl: process.env.NODE_ENV === 'production' ? './' : '/',
	outputDir: process.env.outputDir,
	configureWebpack: {
		externals: {
			TweenMax: 'TweenMax',
			Draggable: 'draggable',
		},
	},
};
