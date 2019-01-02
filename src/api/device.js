import { options, axiosFn } from './config';

// 获取分类
export const getDeviceCategoryInfo = () => {
	options.method = 'get';
	options.url = '/api/device/getDeviceCategoryInfo';
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

// 添加设备
export const setDevice = data => {
	options.method = 'post';
	options.url = '/api/device/setDevice';
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

// 更新设备属性
export const setDesired = data => {
	options.method = 'POST';
	options.url = '/api/device/setDesired';
	options.data = data;
	return axiosFn(options);
};

// 更新设备参数
export const updateDevice = data => {
	options.method = 'put';
	options.url = '/api/device/updateDevice';
	options.data = data;
	return axiosFn(options);
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
