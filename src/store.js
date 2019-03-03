import Vue from 'vue';
import Vuex from 'vuex';

import storage from '@/assets/js/storage';

Vue.use(Vuex);

const findIndex = (state, deviceId) => {
	return state.device.findIndex(value => {
		return value.deviceId === deviceId;
	});
};

export default new Vuex.Store({
	state: {
		token: storage.get('token'),
		user: {},
		group: {},
		rooms: [],
		device: [],
		status: {},
		weather: {},
		socket: {},
		messageUnread: 0,
	},
	mutations: {
		// 设置 token
		setToken(state, val) {
			state.token = val;
		},

		// 设置账号信息
		setUser(state, val) {
			state.user = val;
		},

		// 设置 家庭组
		setGroup(state, val) {
			state.group = val;
		},

		// 设置 House
		setRooms(state, val) {
			state.rooms = val;
		},

		// 设置 weather
		setWeather(state, val) {
			state.weather = val;
		},

		// 设置 socket
		setSocket(state, val) {
			state.socket = val;
		},

		// 设置未读消息数
		setMessageUnread(state, val) {
			state.messageUnread = val;
		},

		// 设置设备列表
		setDevice(state, val) {
			state.device = [];
			state.status = {};
			val.forEach(el => {
				el.device.createTime = new Date(
					el.device.createTime
				).toLocaleString('zh-CN', { hour12: false });
				el.device.updateTime = new Date(
					el.device.updateTime
				).toLocaleString('zh-CN', { hour12: false });
				state.device.push(el.device);
				Vue.set(state.status, el.device.deviceId, el.status);
			});
		},

		// 更新房间
		updateRooms(state, val) {
			if (val.type === 'add') {
				state.rooms.push(val.data);
			} else if (val.type === 'delete') {
				const index = state.rooms.findIndex(el => {
					return el.roomId === val.data.roomId;
				});
				state.rooms.splice(index, 1);
			} else if (val.type === 'update') {
				const index = state.rooms.findIndex(el => {
					return el.roomId === val.data.roomId;
				});
				const item = state.rooms[index];
				item.name = val.data.name;
				item.icon = val.data.icon;
				state.rooms.splice(index, 1, item);
			}
		},

		// 更新在线/离线
		updateOnline(state, val) {
			const index = findIndex(state, val.deviceId);
			state.device[index].onLine = val.onLine;
		},

		// 设备增删改
		updateDevices(state, val) {
			if (val.type === 'add') {
				val.data.device.createTime = new Date(
					val.data.device.createTime
				).toLocaleString('zh-CN', { hour12: false });
				val.data.device.updateTime = new Date(
					val.data.device.updateTime
				).toLocaleString('zh-CN', { hour12: false });
				state.device.push(val.data.device);
				Vue.set(
					state.status,
					val.data.device.deviceId,
					val.data.status
				);
			} else if (val.type === 'delete') {
				const index = findIndex(state, val.deviceId);
				state.device.splice(index, 1);
				delete state.status[val.deviceId];
			} else if (val.type === 'update') {
				const index = findIndex(state, val.data.deviceId);
				const keys = Object.keys(val.data);
				let deviceItem = state.device[index];
				for (let key of keys) {
					deviceItem[key] = val.data[key];
				}
				state.device.splice(index, 1, deviceItem);
			}
		},

		// 更新设备状态
		updateDeviceStatus(state, val) {
			state.status[val.deviceId] = val.status;
		},

		// 群组添加删除成员
		modifyGroup(state, val) {
			if (!state.user.groupId) {
				return;
			}
			if (val.type === 'add') {
				state.group.member.push({ userId: val.userId });
			} else if (val.type === 'remove') {
				const index = state.group.member.findIndex(value => {
					return value.userId === val.userId;
				});
				state.group.member.splice(index, 1);
			}
		},
	},
	actions: {
		token({ commit }, obj) {
			commit('setToken', obj);
		},

		user({ commit }, obj) {
			commit('setUser', obj);
		},

		group({ commit }, obj) {
			commit('setGroup', obj);
		},

		devices({ commit }, obj) {
			commit('setDevice', obj);
		},

		rooms({ commit }, obj) {
			commit('setRooms', obj);
		},

		weather({ commit }, obj) {
			commit('setWeather', obj);
		},

		socket({ commit }, obj) {
			commit('setSocket', obj);
		},

		messageUnread({ commit }, obj) {
			commit('setMessageUnread', obj);
		},

		updateRooms({ commit }, obj) {
			commit('updateRooms', obj);
		},

		updateOnline({ commit }, obj) {
			commit('updateOnline', obj);
		},

		updateDevices({ commit }, obj) {
			commit('updateDevices', obj);
		},

		updateDeviceStatus({ commit }, obj) {
			commit('updateDeviceStatus', obj);
		},

		modifyGroup({ commit }, obj) {
			commit('modifyGroup', obj);
		},
	},
});
