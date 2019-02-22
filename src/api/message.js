import { options, axiosFn } from './config';

// post
// 删除消息
export const deleteMessage = data => {
	options.method = 'post';
	options.url = '/api/user/deleteMessage';
	options.data = data;
	return axiosFn(options);
};

// put
// 设为已读
export const updateMessageStatus = data => {
	options.method = 'put';
	options.url = '/api/user/updateMessageStatus';
	options.data = data;
	return axiosFn(options);
};

// get
// 获取消息
export const getMessages = data => {
	const getOptions = {
		method: 'get',
		url: '/api/user/getMessages',
		params: data,
	};
	return axiosFn(getOptions);
};
