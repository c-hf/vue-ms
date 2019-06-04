// axios URL
const BASEURL = 'http://118.24.169.3/v1';
const SOCKETURL = 'http://118.24.169.3';

// 上传头像 URL
const UPLOADIMGURL = 'http://118.24.169.3/v1/api/user/setUserAvatar';
// 默认头像 URL
const IMGURL = 'http://118.24.169.3/v1/static/avatar/1.jpg';

// const BASEURL = ' http://10.10.72.11:3000';
// const SOCKETURL = 'ws://10.10.72.11:3000';

// // // // 上传头像 UPLOADIMGURL
// const UPLOADIMGURL = ' http://10.10.72.11:3000/api/user/setUserAvatar';
// // // // 默认头像 URL
// const IMGURL = ' http://10.10.72.11:3000/static/avatar/1.jpg';

// 操作日志
const DEVICESOURCE = {
	User: '控制台',
	WeChat: '小程序',
	Voice: '语音',
	Device: '设备',
	Schedule: '定时任务',
	DeviceAssociate: '关联设备',
};

// 添加设备验证规则
export const DEVICERULES = {
	groupId: [
		{
			required: true,
			message: 'groupID 为必填项',
		},
	],
	deviceId: [
		{
			required: true,
			message: 'DeviceID 为必填项',
		},
	],
	name: [
		{
			required: true,
			message: '请输入设备名称',
			trigger: 'blur',
		},
		{
			min: 2,
			max: 16,
			message: '长度在 2 到 16 个字符',
			trigger: 'blur',
		},
	],
	type: [
		{
			required: true,
			message: '请选择设备类型',
			trigger: 'change',
		},
	],
	roomId: [
		{
			required: true,
			message: '请选择设备所在房间',
			trigger: 'change',
		},
	],
	desc: [
		{
			required: true,
			message: '请输入设备描述',
			trigger: 'blur',
		},
		{
			min: 0,
			max: 128,
			message: '0 到 128 个字符',
			trigger: 'blur',
		},
	],
	os: [
		{
			required: true,
			message: '请选择操作系统',
			trigger: 'change',
		},
	],
	networking: [
		{
			required: true,
			message: '请选择联网方式',
			trigger: 'change',
		},
	],
	protocol: [
		{
			required: true,
			message: '请选择设备接入协议',
			trigger: 'change',
		},
	],
};

const DEVICEICON = {
	ceilingLamp: 'icon-light_lamp',
	tableLamp: 'icon-tableLamp',
	airConditioner: 'icon-airConditioner',
	LEDLamp: 'icon-light',
	alarm: 'icon-shengguangbaojingqi',
	airFan: 'icon-fengshan',
	flameSensor: 'icon-huoyantanceqi',
	humidityTemperatureSensor: 'icon-icon-temperature',
	lightIntensitySensor: 'icon-sensor-guangzhao',
	car: 'icon-chelianwang',
};

// 天气图标
const WEATHERICON = {
	晴: 'icon-sun',
	少云: 'icon-cloud',
	晴间多云: 'icon-multi-cloud',
	多云: 'icon-multi-cloud',
	阴: 'icon-cloud',
	有风: 'icon-wind',
	平静: 'icon-wind',
	微风: 'icon-wind',
	和风: 'icon-wind',
	清风: 'icon-wind',
	'强风/劲风': 'icon-gale',
	疾风: 'icon-gale',
	大风: 'icon-gale',
	烈风: 'icon-gale',
	风暴: 'icon-hurricane',
	狂爆风: 'icon-hurricane',
	飓风: 'icon-hurricane',
	热带风暴: 'icon-hurricane',
	阵雨: 'icon-cloudburst',
	雷阵雨: 'icon-thundershower',
	雷阵雨并伴有冰雹: 'icon-rain-hail',
	小雨: 'icon-light-rain',
	中雨: 'icon-moderate-rain',
	大雨: 'icon-downpour',
	暴雨: 'icon-cloudburst',
	大暴雨: 'icon-extraordinary-rainstorm',
	特大暴雨: 'icon-extraordinary-rainstorm',
	强阵雨: 'icon-extraordinary-rainstorm',
	强雷阵雨: 'icon-thundershower',
	极端降雨: 'icon-extraordinary-rainstorm',
	'毛毛雨/细雨': 'icon-light-rain',
	雨: 'icon-light-rain',
	'小雨-中雨': 'icon-moderate-rain',
	'中雨-大雨': 'icon-downpour',
	'大雨-暴雨': 'icon-cloudburst',
	'暴雨-大暴雨': 'icon-extraordinary-rainstorm',
	'大暴雨-特大暴雨': 'icon-extraordinary-rainstorm',
	雨雪天气: 'icon-sleet',
	雨夹雪: 'icon-sleet',
	阵雨夹雪: 'icon-sleet',
	冻雨: 'icon-sleet',
	雪: 'icon-light-snow',
	阵雪: 'icon-heavy-snow',
	小雪: 'icon-light-snow',
	中雪: 'icon-moderate-snow',
	大雪: 'icon-heavy-snow',
	暴雪: 'icon-blizzard',
	'小雪-中雪': 'icon-moderate-snow',
	'中雪-大雪': 'icon-heavy-snow',
	'大雪-暴雪': 'icon-blizzard',
	浮尘: 'icon-aerial-dust',
	扬沙: 'icon-from-dust',
	沙尘暴: 'icon-from-dust',
	强沙尘暴: 'icon-from-dust',
	龙卷风: 'icon-tornado',
	雾: 'icon-fog',
	浓雾: 'icon-fog',
	强浓雾: 'icon-fog',
	轻雾: 'icon-fog',
	大雾: 'icon-fog',
	特强浓雾: 'icon-fog',
	霾: 'icon-haze',
	中度霾: 'icon-haze',
	重度霾: 'icon-haze',
	严重霾: 'icon-haze',
	热: 'icon-unknown',
	冷: 'icon-unknown',
	未知: 'icon-unknown',
};

const ROOMICONS = [
	'icon-keting',
	'icon-woshi',
	'icon-cangting-1',
	'icon-canting-2',
	'icon-weishengjian',
	'icon-yushi',
	'icon-chufang',
	'icon-yingerfang',
	'icon-children',
	'icon-diannaozhuo',
	'icon-shafa',
	'icon-shufang',
	'icon-work',
	'icon-yangtai',
];

const ATTRS = new Map([
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
			max: 100,
		},
	],
	[
		'color',
		{
			id: 'color',
			name: '颜色',
			type: 'Number',
			el: 'color',
			value: 0,
		},
	],
	[
		'speed',
		{
			id: 'speed',
			name: '速度',
			type: 'Number',
			el: 'slider',
			value: 1,
			step: 1,
			min: 1,
			max: 3,
		},
	],
	[
		'flame',
		{
			id: 'flame',
			name: '火焰',
			type: 'Boolean',
			el: 'flame',
			value: true,
		},
	],
	[
		'temp',
		{
			id: 'temp',
			name: '温度',
			type: 'Number',
			el: 'judge',
			judge: 1, // 1 大于 2 小于 3 等于
			value: 0,
			min: 0,
			max: 100,
			suffix: '&#8451;',
		},
	],
	[
		'humidity',
		{
			id: 'humidity',
			name: '湿度',
			type: 'Number',
			el: 'judge',
			judge: 1, // 1 大于 2 小于 3 等于
			value: 0,
			min: 0,
			max: 100,
			suffix: '%',
		},
	],
	[
		'light',
		{
			id: 'light',
			name: '光强度',
			type: 'Number',
			el: 'judge',
			judge: 1, // 1 大于 2 小于 3 等于
			value: 0,
			min: 0,
			max: 200,
			suffix: '',
		},
	],
	// judge
]);

export {
	BASEURL,
	SOCKETURL,
	UPLOADIMGURL,
	IMGURL,
	DEVICESOURCE,
	WEATHERICON,
	ROOMICONS,
	DEVICEICON,
	ATTRS,
};
