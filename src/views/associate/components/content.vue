<template>
    <el-row class="associate-content"
            :gutter="24">
        <el-col class="item"
                :sm="8"
                :md="6"
                :lg="6"
                :xl="6"
                v-for="(item, index) in list"
                :key="index">
        </el-col>
        <el-col class="item"
                :sm="8"
                :md="6"
                :lg="6"
                :xl="6">
            <div class="add-item"
                 @click="addAssociate">
                <i class="el-icon-plus"></i>
            </div>
        </el-col>
    </el-row>
</template>


<script>
// import {  } from '@/api/';
export default {
	name: 'AssociateContent',
	data() {
		return {
			list: [],
		};
	},

	computed: {},

	methods: {
		addAssociate() {
			this.$emit('addAssociate');
		},
	},

	components: {},

	props: {},

	watch: {},

	created() {},

	mounted() {},
};
</script>

<style lang="scss" scoped>
.associate-content {
	flex: 1;

	.add-item {
		height: 400px;
		line-height: 400px;
		text-align: center;
		font-size: 64px;
		cursor: pointer;

		@include info-card();
		color: #909399;

		&:hover {
			color: #606266;
		}
	}
}
</style>
