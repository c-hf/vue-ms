import Vue from 'vue';
import Vuex from 'vuex';

import storage from '@/assets/js/storage';
import { Object } from 'core-js';

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
		homeData: {},
		socket: {},
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

		// 设置 homeData
		setHomeData(state, val) {
			state.homeData = val;
		},

		// 设置 socket
		setSocket(state, val) {
			state.socket = val;
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

		// 添加
		addDevice(state, val) {
			val.device.createTime = new Date(
				val.device.createTime
			).toLocaleString('zh-CN', { hour12: false });
			val.device.updateTime = new Date(
				val.device.updateTime
			).toLocaleString('zh-CN', { hour12: false });
			state.device.push(val.device);
			Vue.set(state.status, val.device.deviceId, val.status);
		},

		// 删除
		deleteDevice(state, val) {
			const index = findIndex(state, val);
			state.device.splice(index, 1);
			delete state.status[val];
		},

		// 更新在线/离线
		updateOnline(state, val) {
			const index = findIndex(state, val.deviceId);
			state.device[index].onLine = val.onLine;
			// state.device
		},

		// 更新设备参数
		updateDevice(state, val) {
			const index = findIndex(state, val.deviceId);
			const keys = Object.keys(val);
			let deviceItem = state.device[index];
			for (let key of keys) {
				deviceItem[key] = val[key];
			}
			state.device.splice(index, 1, deviceItem);
		},

		// 更新设备状态
		updateDeviceStatus(state, val) {
			state.status[val.deviceId] = val.status;
		},

		// 群组添加删除成员
		modifyGroup(state, val) {
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

		rooms({ commit }, obj) {
			commit('setRooms', obj);
		},

		homeData({ commit }, obj) {
			commit('setHomeData', obj);
		},

		socket({ commit }, obj) {
			commit('setSocket', obj);
		},

		device({ commit }, obj) {
			commit('setDevice', obj);
		},

		addDevice({ commit }, obj) {
			commit('addDevice', obj);
		},

		deleteDevice({ commit }, obj) {
			commit('deleteDevice', obj);
		},

		updateOnline({ commit }, obj) {
			commit('updateOnline', obj);
		},

		updateDevice({ commit }, obj) {
			commit('updateDevice', obj);
		},

		updateDeviceStatus({ commit }, obj) {
			commit('updateDeviceStatus', obj);
		},

		modifyGroup({ commit }, obj) {
			commit('modifyGroup', obj);
		},
	},
});
