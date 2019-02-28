import { options, axiosFn } from './config';

// post
// 获取消息
export const getMessages = data => {
	options.method = 'post';
	options.url = '/api/message/getMessages';
	options.data = data;
	return axiosFn(options);
};

// 查找消息
export const getSearchMessages = data => {
	options.method = 'post';
	options.url = '/api/message/getSearchMessages';
	options.data = data;
	return axiosFn(options);
};

// 删除消息
export const deleteMessage = data => {
	options.method = 'post';
	options.url = '/api/message/deleteMessage';
	options.data = data;
	return axiosFn(options);
};

// put
// 设为已读
export const updateMessageStatus = data => {
	options.method = 'put';
	options.url = '/api/message/updateMessageStatus';
	options.data = data;
	return axiosFn(options);
};

// get
