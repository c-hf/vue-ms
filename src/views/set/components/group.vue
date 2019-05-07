<template>
    <div class="view-group"
         v-loading="loading">
        <el-form :model="group"
                 :rules="rules"
                 ref="groupForm"
                 class="view-group-form"
                 label-width="100px">
            <el-form-item label="名称"
                          prop="groupName">
                <el-input placeholder="名称"
                          v-model="group.groupName"
                          clearable>
                </el-input>
            </el-form-item>
            <el-form-item label="居住地"
                          prop="region">
                <el-cascader v-if="edit"
                             placeholder="居住地"
                             :options="regionOptions"
                             v-model="group.region"
                             @active-item-change="regionItemChange">
                </el-cascader>
                <span v-else-if="group.region">
                    {{group.region[0].name}},
                    {{group.region[1].name}},
                    {{group.region[2].name}}
                </span>
                <el-button class="edit-btn"
                           type="text"
                           v-show="!edit"
                           @click="setEditRegion">
                    修改
                </el-button>
            </el-form-item>
            <el-form-item class="view-group-form-btn bottom">
                <el-button type="primary"
                           @click="submit('groupForm')">
                    保存
                </el-button>
                <el-button @click="initalData">
                    重置
                </el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { getProvinceInfo, getCityInfo, getDistrictInfo } from '@/api/user';
import { getGroupInfo, updateGroupInfo } from '@/api/group';

import { RULES } from '../config.js';

export default {
	name: 'ViewGroup',
	data() {
		return {
			loading: false,
			data: {},
			group: {
				groupId: '',
				groupName: '',
				region: [{ name: '' }, { name: '' }, { name: '' }],
			},

			rules: RULES,
			edit: false,
			regionOptions: [],
			provinceindex: null,
			cityindex: null,
		};
	},

	methods: {
		// 提交
		submit(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return false;
				}
				if (
					this.$store.state.user.userId !==
					this.$store.state.group.ownerId
				) {
					// this.$notify({
					// 	title: '警告',
					// 	message: '没有权限修改群信息 ╮(╯﹏╰）╭',
					// 	type: 'warning',
					// });
					this.$message({
						showClose: true,
						center: true,
						type: 'warning',
						message: '没有修改群信息的权限 ╮(╯﹏╰）╭',
					});
					return false;
				}
				this.updateGroupInfoFn();
			});
		},

		// 初始化数据
		initalData() {
			this.edit = false;
			this.group.groupName = this.data.groupName;
			this.group.region = this.data.region;
		},

		// 修改所在地
		setEditRegion() {
			this.group.region = [];
			this.data.region.forEach(async el => {
				this.group.region.push(el.adcode);
			});
			Promise.all([this.getCityInfoFn([this.group.region[0]])]).then(
				() => {
					let region = [...this.group.region];
					region.pop();
					this.getDistrictInfoFn(region);
				}
			);

			this.edit = true;
		},

		// 选项变化
		regionItemChange(value) {
			if (value.length === 1) {
				this.getCityInfoFn(value);
			} else {
				this.getDistrictInfoFn(value);
			}
		},

		// 更新群信息封装
		updateGroupInfoFn() {
			this.loading = true;
			updateGroupInfo({
				groupId: this.data.groupId,
				groupName: this.group.groupName,
				region: this.getDataRegion(),
			})
				.then(resData => {
					if (resData.ok) {
						this.$message({
							showClose: true,
							center: true,
							message: '保存成功',
							type: 'success',
						});
					}
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				})
				.then(() => {
					this.loading = false;
				});
		},

		// 获取家庭组信息封装
		getGroupInfoFn(groupId) {
			this.loading = true;
			getGroupInfo(groupId)
				.then(resData => {
					if (!resData.groupId) {
						this.group = {
							groupId: '',
							groupName: '',
							region: [{ name: '' }, { name: '' }, { name: '' }],
						};
						return;
					}
					this.data = resData;
					this.group.groupName = resData.groupName;
					this.group.region = resData.region;
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				})
				.then(() => {
					this.loading = false;
				});
		},

		// 查找省封装
		getProvinceInfoFn() {
			getProvinceInfo({ type: 'province', adcode: '' }).then(resData => {
				this.regionOptions = resData;
			});
		},

		// 查找市封装
		async getCityInfoFn(value) {
			this.provinceindex = this.regionOptions.findIndex(el => {
				return el.value === value[0];
			});
			if (this.regionOptions[this.provinceindex].children.length) {
				return;
			}
			await getCityInfo({ adcode: value[0] }).then(resData => {
				this.regionOptions[this.provinceindex].children = resData;
			});
		},

		// 查找县/区封装
		getDistrictInfoFn(value) {
			this.provinceindex = this.regionOptions.findIndex(el => {
				return el.value === value[0];
			});
			this.cityindex = this.regionOptions[
				this.provinceindex
			].children.findIndex(el => {
				return el.value === value[1];
			});
			if (
				this.regionOptions[this.provinceindex].children[this.cityindex]
					.children.length
			) {
				return;
			}
			getDistrictInfo({ adcode: value[1] }).then(resData => {
				this.regionOptions[this.provinceindex].children[
					this.cityindex
				].children = resData;
			});
		},

		// 获取处理后 region
		getDataRegion() {
			if (!this.edit) {
				return this.data.region;
			}
			const districtIndex = this.regionOptions[
				this.provinceindex
			].children[this.cityindex].children.findIndex(el => {
				return el.value === this.group.region[2];
			});
			return [
				{
					adcode: this.group.region[0],
					name: this.regionOptions[this.provinceindex].label,
				},
				{
					adcode: this.group.region[1],
					name: this.regionOptions[this.provinceindex].children[
						this.cityindex
					].label,
				},
				{
					adcode: this.group.region[2],
					name: this.regionOptions[this.provinceindex].children[
						this.cityindex
					].children[districtIndex].label,
				},
			];
		},
	},

	created() {
		this.getGroupInfoFn(this.$store.state.user.groupId);
		this.getProvinceInfoFn();
	},
};
</script>

<style lang="scss" scoped>
.view-group {
	padding: 32px;
	padding-top: 40px;

	&-form {
		width: 460px;
		height: 100%;
		margin-top: 40px;

		.bottom {
			margin-top: 60px;
		}

		.edit-btn {
			margin-left: 20px;
		}
	}
}
</style>

