export const WEEKS = [
	{ value: 1, label: '周一' },
	{ value: 2, label: '周二' },
	{ value: 3, label: '周三' },
	{ value: 4, label: '周四' },
	{ value: 5, label: '周五' },
	{ value: 6, label: '周六' },
	{ value: 7, label: '周日' },
];

export const RULES = {
	name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
	timeType: [{ required: true, message: '请模式类型', trigger: 'change' }],
	date: [
		{
			type: 'date',
			required: true,
			message: '请选择日期时间',
			trigger: 'change',
		},
	],
	time: [
		{
			type: 'date',
			required: true,
			message: '请选择时间',
			trigger: 'change',
		},
	],
};
