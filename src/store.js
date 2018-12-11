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

		// 设置设备列表
		setDevice(state, val) {
			state.device = val;
		},
		// 添加
		addDevice(state, val) {
			state.device.push(val);
		},
		// 删除
		deleteDevice(state, val) {
			const index = findIndex(state, val);
			state.device.splice(index, 1);
		},

		// 设置设备列表
		updateOnline(state, val) {
			const index = findIndex(state, val.deviceId);
			state.device[index].onLine = val.onLine;
		},

		// 更新设备状态
		updateDeviceStatus(state, val) {
			const index = findIndex(state, val.deviceId);
			val.status.forEach(el => {
				const statusIndex = state.device[index].status.findIndex(
					value => {
						return value.id === el.id;
					}
				);
				state.device[index].status[statusIndex].value = el.value;
			});
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
		updateDeviceStatus({ commit }, obj) {
			commit('updateDeviceStatus', obj);
		},
	},
});
