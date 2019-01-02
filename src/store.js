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
		device: new Map(),
		status: new Map(),
		homeData: {},
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

		setHomeData(state, val) {
			state.homeData = val;
		},

		// 设置设备列表
		setDevice(state, val) {
			val.forEach(el => {
				// state.device.push(el.device);
				// state.status[el.deviceId] = el.status;
				state.device.set(el.deviceId, el.device);
				state.status.set(el.deviceId, el.status);
			});
		},

		// 添加
		addDevice(state, val) {
			state.device.set(val.deviceId, val.device);
			state.status.set(val.deviceId, val.status);
			// state.device.push(val.device);
			// state.status[val.deviceId] = val.status;
			// Vue.set(state.status, val.deviceId, val.status);
		},

		// 删除
		deleteDevice(state, val) {
			state.device.delete(val);
			state.status.delete(val);
			// const index = findIndex(state, val);
			// state.device.splice(index, 1);
			// delete state.status[val];
		},

		// 设置设备列表
		updateOnline(state, val) {
			let el = state.device.get(val.deviceId);
			el.onLine = val.onLine;
			state.device.set(el);
			// const index = findIndex(state, val.deviceId);
			// state.device[index].onLine = val.onLine;
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
			const index = findIndex(state, val.deviceId);
			let deviceItem = state.device[index];
			val.status.forEach(el => {
				const statusIndex = state.device[index].status.findIndex(
					value => {
						return value.id === el.id;
					}
				);
				deviceItem.status[statusIndex].value = el.value;
			});
			state.device.splice(index, 1, deviceItem);
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
	},
});
