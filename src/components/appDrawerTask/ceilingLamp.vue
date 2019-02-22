<template>
    <el-scrollbar class="app-drawer-task-task"
                  style="height:80%">
        <span v-if="!dataTasks.length"
              class="app-drawer-task-task-error">
            <svg-icon class="error-icon"
                      iconClass="icon-File-Error" />
            未设置任务
        </span>
        <span class="app-drawer-task-task-item"
              v-for="(item, index) in dataTasks"
              :key="index">
            <i class="name">{{ item.name }}</i>
            <el-switch v-if="item.el === 'switch'"
                       v-model="item.value"
                       active-color="#13ce66"
                       inactive-color="#ff4949">
            </el-switch>
            <el-slider v-else-if="item.el === 'slider'"
                       v-model="item.value"
                       :step="item.step"
                       :min="item.min">
            </el-slider>
            <el-button class="app-drawer-task-task-item-delete"
                       icon="el-icon-close"
                       size="mini"
                       circle
                       @click="deleteTask(index)">
            </el-button>
        </span>
    </el-scrollbar>
</template>

<script>
export default {
	name: 'CeilingLamp',
	data() {
		return {};
	},

	methods: {
		deleteTask(index) {
			this.$emit('deleteTask', index);
		},
	},

	props: {
		dataTasks: {
			type: Array,
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';

.el-slider {
	width: 180px;
}

.button {
	text-align: center;
	line-height: 100%;
}
</style>
