<template>
    <div class="associate"
         v-loading="loading">
        <associate-info />
        <associate-content ref="content"
                           @addAssociate="addAssociate"
                           @updateAssociate="updateAssociate"
                           @setLoading="setLoading" />
        <app-drawer :show.sync="drawerVisible"
                    :width="520">
            <drawer-associate v-if="drawerVisible"
                              :editData="editData"
                              :type="type"
                              @getDeviceAssociate="getDeviceAssociate" />
        </app-drawer>
    </div>
</template>


<script>
import AppDrawer from '@/components/appDrawer';
import AssociateInfo from './components/info.vue';
import AssociateContent from './components/content.vue';
import DrawerAssociate from './components/drawerAssociate.vue';

export default {
	name: 'Associate',
	data() {
		return {
			loading: false,
			drawerVisible: false,
			editData: {},
			type: 1,
		};
	},

	computed: {},

	methods: {
		addAssociate() {
			this.editData = {};
			this.type = 1;
			this.drawerVisible = true;
		},

		updateAssociate(associate, type) {
			this.editData = associate;
			this.type = type;
			this.drawerVisible = true;
		},

		getDeviceAssociate() {
			this.drawerVisible = false;
			this.$refs.content.getDeviceAssociateFn();
		},

		setLoading(value) {
			this.loading = value;
		},
	},

	components: {
		AppDrawer,
		AssociateInfo,
		AssociateContent,
		DrawerAssociate,
	},

	props: {},

	watch: {},

	created() {},

	mounted() {},
};
</script>

<style lang="scss" scoped>
.relevance {
	@include flex-direction();
}
</style>

