// axios URL
// const baseURL = 'http://localhost:3000';
const baseURL = 'http://localhost:3000/';

// 上传头像 URL
const uploadImgUrl = 'http://localhost:3000/api/user/setUserAvatar';

const defaultImgUrl = 'http://localhost:3000/static/avatar/1.jpg';

const source = {
	User: '控制台',
	WeChat: '小程序',
	Voice: '语音',
	Device: '设备',
	Schedule: '定时任务',
};

export { baseURL, uploadImgUrl, defaultImgUrl, source };
