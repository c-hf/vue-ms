<template>
    <div class="associate">
        <associate-info />
        <associate-content @addAssociate="addAssociate" />
        <app-drawer :show.sync="drawerVisible"
                    :width="520">
            <drawer-associate />
        </app-drawer>
    </div>
</template>


<script>
import AppDrawer from '@/components/appDrawer';
import AssociateInfo from './components/info.vue';
import AssociateContent from './components/content.vue';
import DrawerAssociate from './components/drawerAssociate.vue';
// drawerAssociate

export default {
	name: 'Associate',
	data() {
		return {
			drawerVisible: false,
		};
	},

	computed: {},

	methods: {
		addAssociate() {
			this.drawerVisible = true;
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

