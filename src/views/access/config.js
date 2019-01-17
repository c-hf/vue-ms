const suffix = 'key';
export const INFORMATION_DATA_KEY = `information-content-${suffix}`;
export const PARAM_DATA_KEY = `param-content-${suffix}`;
export const CATEGORY_CONTENT_UPDATE_TIME_INTERVAL = 1 * 24 * 60 * 60 * 1000; // 过期时间

// 验证规则
export const RULES = {
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

export const TABLEDATA = [
	{
		prop: 'id',
		label: '属性名称',
	},
	{
		prop: 'name',
		label: '显示名称',
	},
	{
		prop: 'attrType',
		label: '类型',
	},
	{
		prop: 'value',
		label: '值',
	},
	{
		prop: 'unit',
		label: '单位',
	},
];
