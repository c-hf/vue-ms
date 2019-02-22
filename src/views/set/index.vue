<template>
    <div>
        <el-tabs class="set"
                 type="border-card"
                 v-model="activeName"
                 @tab-click="tabClick">
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

	methods: {
		tabClick() {
			if (this.activeName !== 'group') {
				return;
			}
			if (
				this.$store.state.user.userId !==
				this.$store.state.group.ownerId
			) {
				console.log(this.activeName);
				this.$notify({
					title: '警告',
					message: '这是一条警告的提示消息',
					type: 'warning',
				});
			}
		},
	},

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
	// min-height: calc(100% - 60px);
}
</style>
