export const ATTRS = new Map([
	[
		'switch',
		{
			id: 'switch',
			name: '开关',
			type: 'Boolean',
			value: false,
			el: 'switch',
		},
	],
	[
		'luminance',
		{
			id: 'luminance',
			name: '亮度',
			type: 'Number',
			el: 'slider',
			value: 100,
			step: 10,
			min: 10,
		},
	],
]);
