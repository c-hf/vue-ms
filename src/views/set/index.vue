<template>
    <div>
        <el-tabs class="set"
                 type="border-card"
                 v-model="activeName">
            <el-tab-pane label="个人资料"
                         name="user">
                <view-user />
            </el-tab-pane>
            <el-tab-pane label="家庭组"
                         name="group"
                         :disabled="disabled">
                <view-group />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import ViewUser from './viewUser';
import ViewGroup from './viewGroup';

export default {
	name: 'Set',
	data() {
		return {
			activeName: 'user',
		};
	},

	computed: {
		disabled() {
			if (!this.$store.state.user.groupId) {
				return true;
			}
			return false;
		},
	},

	methods: {},

	components: {
		ViewUser,
		ViewGroup,
	},

	created() {},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.set {
	width: 100%;
}
</style>
