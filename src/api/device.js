import { options, axiosFn } from './config';

// 添加设备
export const setDevice = data => {
	options.method = 'post';
	options.url = '/api/device/setDevice';
	options.data = data;
	return axiosFn(options);
};

// 设置设备属性
export const setDesired = data => {
	options.method = 'post';
	options.url = '/api/device/setDesired';
	options.data = data;
	return axiosFn(options);
};

// 设置定时任务
export const setDeviceTimedTask = data => {
	options.method = 'post';
	options.url = '/api/device/setDeviceTimedTask';
	options.data = data;
	return axiosFn(options);
};

// 设置关联设备
export const setDeviceAssociate = data => {
	options.method = 'post';
	options.url = '/api/device/deviceAssociate';
	options.data = data;
	return axiosFn(options);
};

// 设置情景模式
export const setMode = data => {
	options.method = 'post';
	options.url = '/api/device/mode';
	options.data = data;
	return axiosFn(options);
};

// 设置情景模式任务
export const setModeTask = data => {
	options.method = 'post';
	options.url = '/api/device/mode/task';
	options.data = data;
	return axiosFn(options);
};

// 删除设备
export const deleteDevice = data => {
	const deleteOptions = {
		method: 'delete',
		url: '/api/device/deleteDevice',
		params: data,
	};
	return axiosFn(deleteOptions);
};

// 删除设备日志
export const deleteDeviceLog = data => {
	const getOptions = {
		method: 'delete',
		url: '/api/device/deleteDeviceLog',
		params: data,
	};
	return axiosFn(getOptions);
};

// 删除定时任务
export const deleteDeviceTimedTask = data => {
	const getOptions = {
		method: 'delete',
		url: '/api/device/deleteDeviceTimedTask',
		params: data,
	};
	return axiosFn(getOptions);
};

// 	// 删除设备关联
export const deleteDeviceAssociate = data => {
	const getOptions = {
		method: 'delete',
		url: '/api/device/deviceAssociate',
		params: data,
	};
	return axiosFn(getOptions);
};

// 删除情景模式
export const deleteMode = data => {
	const getOptions = {
		method: 'delete',
		url: '/api/device/mode',
		params: data,
	};
	return axiosFn(getOptions);
};

// 删除情景模式任务
export const deleteModeTask = data => {
	const getOptions = {
		method: 'delete',
		url: '/api/device/mode/task',
		params: data,
	};
	return axiosFn(getOptions);
};

// 更新设备参数
export const updateDevice = data => {
	options.method = 'put';
	options.url = '/api/device/updateDevice';
	options.data = data;
	return axiosFn(options);
};

// 取消定时
export const canclDeviceTimedTask = timedTaskId => {
	options.method = 'put';
	options.url = '/api/device/canclDeviceTimedTask';
	options.data = {
		timedTaskId: timedTaskId,
	};
	return axiosFn(options);
};

// 开始定时
export const startDeviceTimedTask = timedTaskId => {
	options.method = 'put';
	options.url = '/api/device/startDeviceTimedTask';
	options.data = {
		timedTaskId: timedTaskId,
	};
	return axiosFn(options);
};

// 重置定时任务
export const updateDeviceTimedTask = data => {
	options.method = 'put';
	options.url = '/api/device/updateDeviceTimedTask';
	options.data = data;
	return axiosFn(options);
};

// 更新关联设备
export const updateDeviceAssociate = data => {
	options.method = 'put';
	options.url = '/api/device/deviceAssociate';
	options.data = data;
	return axiosFn(options);
};

// 开启关闭关联设备
export const openDeviceAssociate = data => {
	options.method = 'put';
	options.url = '/api/device/open/deviceAssociate';
	options.data = data;
	return axiosFn(options);
};

// 更新情景模式
export const updateMode = data => {
	options.method = 'put';
	options.url = '/api/device/mode';
	options.data = data;
	return axiosFn(options);
};

// 更新情景模式任务
export const updateModeTask = data => {
	options.method = 'put';
	options.url = '/api/device/mode/task';
	options.data = data;
	return axiosFn(options);
};

// 开启关闭情景模式
export const updateModeSwitch = data => {
	options.method = 'put';
	options.url = '/api/device/mode/switch';
	options.data = data;
	return axiosFn(options);
};

// 获取设备信息
export const getDeviceInfo = data => {
	const getOptions = {
		method: 'get',
		url: '/api/device/getDeviceInfo',
		params: data,
	};
	return axiosFn(getOptions);
};

// 获取分类
export const getAllDeviceCategory = () => {
	options.method = 'get';
	options.url = '/api/device/getAllDeviceCategory';
	return axiosFn(options);
};

// 获取设备 Id
export const getDeviceId = () => {
	options.method = 'get';
	options.url = '/api/device/getDeviceId';
	return axiosFn(options);
};

// 获取设备参数与属性
export const getDeviceParamAndAttrById = categoryItemId => {
	const getOptions = {
		method: 'get',
		url: '/api/device/getDeviceParamAndAttrById',
		params: {
			categoryItemId: categoryItemId,
		},
	};
	return axiosFn(getOptions);
};

// 获取定时任务
export const getDeviceTimedTask = deviceId => {
	const getOptions = {
		method: 'get',
		url: '/api/device/getDeviceTimedTask',
		params: {
			deviceId: deviceId,
		},
	};
	return axiosFn(getOptions);
};

// 获取用户所有的设备信息
export const getAllDeviceInfo = groupId => {
	const getOptions = {
		method: 'get',
		url: '/api/device/getAllDeviceInfo',
		params: {
			groupId: groupId,
		},
	};
	return axiosFn(getOptions);
};

// 获取定时任务
export const getDeviceTimedTaskById = timedTaskId => {
	const getOptions = {
		method: 'get',
		url: '/api/device/getDeviceTimedTaskById',
		params: {
			timedTaskId: timedTaskId,
		},
	};
	return axiosFn(getOptions);
};

// 获取设备日志
export const getDeviceLogById = data => {
	const getOptions = {
		method: 'get',
		url: '/api/device/getDeviceLogById',
		params: data,
	};
	return axiosFn(getOptions);
};

// 获取设备关联
export const getDeviceAssociate = data => {
	const getOptions = {
		method: 'get',
		url: '/api/device/deviceAssociate',
		params: data,
	};
	return axiosFn(getOptions);
};

// 获取情景模式
export const getMode = data => {
	const getOptions = {
		method: 'get',
		url: '/api/device/mode',
		params: data,
	};
	return axiosFn(getOptions);
};
