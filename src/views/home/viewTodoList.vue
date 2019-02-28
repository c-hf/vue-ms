<template>
    <el-card class="view-todo-list"
             v-loading="loading">
        <div slot="header"
             class="clearfix">
            <span class="view-todo-list-title">
                待办事项
            </span>
            <el-button style="float: right; padding: 3px 0"
                       type="text">
                <!-- 操作按钮 -->
                <i class="el-icon-plus"></i>
            </el-button>
        </div>
        <div class="view-todo-list-content">

        </div>
    </el-card>
</template>

<script>
export default {
	name: 'ViewTodoList',
	data() {
		return {
			loading: false,
		};
	},
};
</script>

<style lang="scss" scoped>
.view-todo-list {
	margin-bottom: 20px;

	&-title {
		display: inline-block;
		height: 23px;
	}
	&-content {
		height: 542px;
	}
}
</style>
