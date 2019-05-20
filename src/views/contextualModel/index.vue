<template>
    <div v-loading="lodaing">
        <contextual-model-info @addMode="addMode" />
        <contextual-model-content ref="content"
                                  @editMode="editMode"
                                  @addModeTask="addModeTask"
                                  @onEditModeTask="onEditModeTask"
                                  @setLoading="setLoading" />
        <app-drawer :show.sync="drawerVisible"
                    :width="520">
            <component :is="drawer"
                       v-if="drawerVisible"
                       :modeData="modeData"
                       :data="data"
                       @getMode="getMode">
            </component>
        </app-drawer>
    </div>
</template>


<script>
import AppDrawer from '@/components/appDrawer';
import ContextualModelInfo from './components/info';
import ContextualModelContent from './components/content';
import DrawerMode from './components/drawerMode';
import DrawerTask from './components/drawerTask';

export default {
	name: 'ContextualModel',
	data() {
		return {
			lodaing: false,
			drawerVisible: false,
			drawer: 'DrawerMode',
			modeData: {},
			data: {
				modeId: '',
			},
		};
	},

	methods: {
		addMode() {
			this.modeData = {
				name: '情景模式',
				timeType: 0,
				date: '',
				time: '',
				week: [],
			};
			this.drawer = 'DrawerMode';
			this.drawerVisible = true;
		},

		editMode(data) {
			this.modeData = data;
			this.drawer = 'DrawerMode';
			this.drawerVisible = true;
		},

		addModeTask(modeId) {
			this.data = {
				modeId: modeId,
			};
			this.drawer = 'DrawerTask';
			this.drawerVisible = true;
		},

		onEditModeTask(data) {
			this.data = data;
			this.drawer = 'DrawerTask';
			this.drawerVisible = true;
		},

		getMode() {
			this.drawerVisible = false;
			this.$refs.content.getModeFn();
		},

		setLoading(value) {
			this.lodaing = value;
		},
	},

	components: {
		AppDrawer,
		ContextualModelInfo,
		ContextualModelContent,
		DrawerMode,
		DrawerTask,
	},
};
</script>

<style lang="scss" scoped>
</style>
