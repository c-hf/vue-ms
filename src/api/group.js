import { options, axiosFn } from './config';

// post
// 创建 group
export const setGroup = data => {
	options.method = 'post';
	options.url = '/api/user/setGroup';
	options.data = data;
	return axiosFn(options);
};

// 添加 group 成员
export const addGroupMember = data => {
	options.method = 'post';
	options.url = '/api/user/addGroupMember';
	options.data = data;
	return axiosFn(options);
};

// delete
// 删除 group 成员
export const deleteGroupMember = data => {
	const deleteOptions = {
		method: 'delete',
		url: '/api/user/deleteGroupMember',
		params: data,
	};
	return axiosFn(deleteOptions);
};

// put
// 更新群信息
export const updateGroupInfo = data => {
	options.method = 'put';
	options.url = '/api/user/updateGroupInfo';
	options.data = data;
	return axiosFn(options);
};

// get
// 获取群组
export const getGroupById = groupId => {
	const getOptions = {
		method: 'get',
		url: '/api/user/getGroupById',
		params: {
			groupId: groupId,
		},
	};
	return axiosFn(getOptions);
};

// 获取群组信息
export const getGroupInfo = groupId => {
	const getOptions = {
		method: 'get',
		url: '/api/user/getGroupInfo',
		params: {
			groupId: groupId,
		},
	};
	return axiosFn(getOptions);
};
