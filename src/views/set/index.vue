<template>
    <section class="set">
        <el-tabs class="set-content"
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
            <el-tab-pane label="房间管理"
                         name="room"
                         :disabled="disabled">
                <view-room />
            </el-tab-pane>
        </el-tabs>
    </section>
</template>

<script>
import ViewUser from './components/user';
import ViewGroup from './components/group';
import ViewRoom from './components/room';

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

	components: {
		ViewUser,
		ViewGroup,
		ViewRoom,
	},
};
</script>

<style lang="scss" scoped>
.set {
	@include flex-direction();

	&-content {
		@include flex-direction();
		flex: 1;
	}
}
</style>

<style lang="scss">
.set {
	.el-tabs__content {
		flex: 1;
	}
}
</style>

