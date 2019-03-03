import { options, axiosFn } from './config';

// post
// 创建群
export const createGroup = data => {
	options.method = 'post';
	options.url = '/api/group/createGroup';
	options.data = data;
	return axiosFn(options);
};

// 添加成员
export const addGroupMemberMsg = data => {
	options.method = 'post';
	options.url = '/api/group/addGroupMemberMsg';
	options.data = data;
	return axiosFn(options);
};

// 添加成员处理
export const addGroupMemberHandle = data => {
	options.method = 'post';
	options.url = '/api/group/addGroupMemberHandle';
	options.data = data;
	return axiosFn(options);
};

// 加入群组申请
export const applyMembershipMsg = data => {
	options.method = 'post';
	options.url = '/api/group/applyMembershipMsg';
	options.data = data;
	return axiosFn(options);
};

// 入群申请处理
export const applyMembershipHandle = data => {
	options.method = 'post';
	options.url = '/api/group/applyMembershipHandle';
	options.data = data;
	return axiosFn(options);
};

// 添加房间
export const addRoom = data => {
	options.method = 'post';
	options.url = '/api/group/addRoom';
	options.data = data;
	return axiosFn(options);
};

// delete
// 删除成员
export const deleteGroupMember = data => {
	const deleteOptions = {
		method: 'delete',
		url: '/api/group/deleteGroupMember',
		params: data,
	};
	return axiosFn(deleteOptions);
};

// 删除房间
export const deleteHouse = data => {
	const deleteOptions = {
		method: 'delete',
		url: '/api/group/deleteHouse',
		params: data,
	};
	return axiosFn(deleteOptions);
};

// put
// 更新群信息
export const updateGroupInfo = data => {
	options.method = 'put';
	options.url = '/api/group/updateGroupInfo';
	options.data = data;
	return axiosFn(options);
};

// 更新房间
export const updateHouse = data => {
	options.method = 'put';
	options.url = '/api/group/updateHouse';
	options.data = data;
	return axiosFn(options);
};

// get
// 获取群组（包括成员信息）
export const getGroupById = groupId => {
	const getOptions = {
		method: 'get',
		url: '/api/group/getGroupById',
		params: {
			groupId: groupId,
		},
	};
	return axiosFn(getOptions);
};

// 获取群组信息（成员仅获取ID）
export const getGroupInfo = groupId => {
	const getOptions = {
		method: 'get',
		url: '/api/group/getGroupInfo',
		params: {
			groupId: groupId,
		},
	};
	return axiosFn(getOptions);
};

// 获取房间信息
export const getHouse = data => {
	const getOptions = {
		method: 'get',
		url: '/api/group/getHouse',
		params: data,
	};
	return axiosFn(getOptions);
};

// 退出群组
export const exitGroup = data => {
	const getOptions = {
		method: 'get',
		url: '/api/group/exitGroup',
		params: data,
	};
	return axiosFn(getOptions);
};

// 解散群组
// 'GET /api/group/unGroup': unGroup,
export const unGroup = data => {
	const getOptions = {
		method: 'get',
		url: '/api/group/unGroup',
		params: data,
	};
	return axiosFn(getOptions);
};
