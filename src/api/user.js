import axios from 'axios';

import { TIMEOUT } from './config';

let options = {
	method: 'post', //方法
	url: '', //地址
	data: null,
	timeout: TIMEOUT,
};

const axiosFn = options => {
	return axios(options).then(response => {
		if (!response.data.code) {
			return response.data;
		}
		throw new Error(response.data.message);
	});
};

export const signSendCode = data => {
	options.method = 'post';
	options.url = '/api/user/sendCode';
	options.data = data;
	return axiosFn(options);
};

export const signUp = data => {
	options.method = 'post';
	options.url = '/api/user/signUp';
	options.data = data;
	return axiosFn(options);
};

export const signIn = data => {
	options.method = 'post';
	options.url = '/api/user/signIn';
	options.data = data;
	return axiosFn(options);
};

export const signOut = () => {
	options.method = 'get';
	options.url = '/api/user/signOut';
	return axiosFn(options);
};

export const userAvatar = data => {
	options.method = 'post';
	options.data = data;
	options.url = '/api/user/userAvatar';
	return axiosFn(options);
};

export const userInfo = () => {
	options.method = 'get';
	options.url = '/api/user/userInfo';
	return axiosFn(options);
};
