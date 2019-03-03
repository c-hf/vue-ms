<template>
    <el-card class="view-todo-list"
             v-loading="loading">
        <div slot="header"
             class="view-todo-list-header">
            <span class="view-todo-list-title">
                待办事项
            </span>
            <el-button circle
                       icon="el-icon-plus"
                       size="mini">
                <!-- 操作按钮 -->
                <!-- <i class="el-icon-plus"></i> -->
            </el-button>
        </div>
        <div class="view-todo-list-content"
             v-if="data.length">
        </div>
        <div class="view-todo-list-error"
             v-else>
            <svg-icon iconClass="icon-meiyoushuju1" />
            <span>
                没有待办事项
            </span>
        </div>
    </el-card>
</template>

<script>
export default {
	name: 'ViewTodoList',
	data() {
		return {
			loading: false,
			data: [],
		};
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.view-todo-list {
	margin-bottom: 20px;

	&-header {
		height: 23px;
		@include flex-between();
	}

	&-title {
		display: inline-block;
		height: 23px;
	}

	&-content {
		height: 542px;
	}

	&-error {
		height: 542px;
		box-sizing: border-box;
		font-size: 48px;
		@include flex-center(column);
		span {
			font-size: 16px;
			color: #909399;
			margin: 20px;
		}
	}
}
</style>
