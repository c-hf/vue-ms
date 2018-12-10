import Vue from 'vue';
import Vuex from 'vuex';

import storage from '@/assets/js/storage';

Vue.use(Vuex);

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
			const index = state.device.findIndex(value => {
				return value.deviceId === val;
			});
			state.device.splice(index, 1);
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
	},
});
