import Vue from 'vue';
import Vuex from 'vuex';
import storage from '@/assets/js/storage';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		token: storage.get('token') || '',
	},
	mutations: {
		setToken(state, val) {
			state.token = val;
		},
	},
	actions: {
		token({ commit }, obj) {
			commit('setToken', obj);
		},
	},
});
