import { options, axiosFn } from './config';

// post
// 验证码
export const signSendCode = data => {
	options.method = 'post';
	options.url = '/api/user/sendCode';
	options.data = data;
	return axiosFn(options);
};

// 注册
export const signUp = data => {
	options.method = 'post';
	options.url = '/api/user/signUp';
	options.data = data;
	return axiosFn(options);
};

// 登录
export const signIn = data => {
	options.method = 'post';
	options.url = '/api/user/signIn';
	options.data = data;
	return axiosFn(options);
};

// 完善信息
export const perfectInformation = data => {
	options.method = 'post';
	options.url = '/api/user/perfectInformation';
	options.data = data;
	return axiosFn(options);
};

// 添加 to-dolist
export const setTodoList = data => {
	options.method = 'post';
	options.url = '/api/user/TodoList';
	options.data = data;
	return axiosFn(options);
};

// delete
// 删除 to-dolist
export const deleteTodoList = data => {
	const deleteOptions = {
		method: 'delete',
		url: '/api/user/TodoList',
		params: data,
	};
	return axiosFn(deleteOptions);
};

// put
// 更新用户信息
export const updateUserInfo = data => {
	options.method = 'put';
	options.url = '/api/user/updateUserInfo';
	options.data = data;
	return axiosFn(options);
};

// 更新 to-dolist
export const updateTodoList = data => {
	options.method = 'put';
	options.url = '/api/user/TodoList';
	options.data = data;
	return axiosFn(options);
};

// 完成 to-dolist
export const finishTodoList = data => {
	options.method = 'put';
	options.url = '/api/user/finish/TodoList';
	options.data = data;
	return axiosFn(options);
};

// get
// 登出
export const signOut = () => {
	options.method = 'get';
	options.url = '/api/user/signOut';
	return axiosFn(options);
};

// 获取头像
export const getUserAvatar = data => {
	const getOptions = {
		method: 'get',
		url: '/api/user/getUserAvatar',
		params: data,
	};
	return axiosFn(getOptions);
};

// 获取用户信息
export const getUserInfo = () => {
	options.method = 'get';
	options.url = '/api/user/getUserInfo';
	return axiosFn(options);
};

// 查找用户
export const getUserById = data => {
	const getOptions = {
		method: 'get',
		url: '/api/user/getUserById',
		params: data,
	};
	return axiosFn(getOptions);
};

// 获取 Token
export const getUserToken = () => {
	const getOptions = {
		method: 'get',
		url: '/api/user/getUserToken',
	};
	return axiosFn(getOptions);
};

// 获取省
export const getProvinceInfo = () => {
	const getOptions = {
		method: 'get',
		url: '/api/user/getProvinceInfo',
	};
	return axiosFn(getOptions);
};

// 获取市
export const getCityInfo = data => {
	const getOptions = {
		method: 'get',
		url: '/api/user/getCityInfo',
		params: data,
	};
	return axiosFn(getOptions);
};

// 获取县/区
export const getDistrictInfo = data => {
	const getOptions = {
		method: 'get',
		url: '/api/user/getDistrictInfo',
		params: data,
	};
	return axiosFn(getOptions);
};

// 天气查询
export const getWeatherInfo = data => {
	const getOptions = {
		method: 'get',
		url: '/api/aMap/getWeatherInfo',
		params: data,
	};
	return axiosFn(getOptions);
};

// 获取 To-do List
export const getTodoList = data => {
	const getOptions = {
		method: 'get',
		url: '/api/user/TodoList',
		params: data,
	};
	return axiosFn(getOptions);
};
