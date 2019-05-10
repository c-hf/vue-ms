<template>
    <div class="view-lighting"
         ref="details">
        <div class="left">
            <div class="left-top">

            </div>
            <div class="left-bottom">

            </div>
        </div>
        <div class="right">

        </div>
        <app-drawer :show.sync="drawerVisible">
            <app-drawer-log v-if="drawerVisible && drawerType === 'log'"
                            :deviceId="deviceId"
                            @deleteLogs="deleteLogs" />

            <app-drawer-task v-else-if="drawerVisible && drawerType === 'task'"
                             :categoryItemId="device.categoryItemId"
                             :deviceId="deviceId"
                             :status="status"
                             :taskType="taskType"
                             :timedTaskId="timedTaskId"
                             @setVisible="setVisible">
            </app-drawer-task>
        </app-drawer>
    </div>
</template>


<script>
export default {
	name: 'DetailContainer',
	data() {
		return {};
	},

	computed: {},

	methods: {},

	components: {},

	props: {},

	watch: {},

	created() {},

	mounted() {},
};
</script>

<style lang="scss" scoped>
</style>
