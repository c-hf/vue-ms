<template>
    <div class="create-group"
         v-loading="loading">
        <div class="create-group-content"
             v-if="!group.groupId">
            <div class="create-group-title">
                <span class="create-group-title-icon">
                    <svg-icon iconClass="icon-house" />
                </span>
            </div>
            <el-form :model="group"
                     :rules="rules"
                     ref="groupForm"
                     class="create-group-form"
                     label-position="top"
                     label-width="0">
                <span class="create-group-form-text">
                    家庭名称
                </span>
                <el-form-item prop="groupName">
                    <el-input placeholder="名称"
                              v-model="group.groupName"
                              clearable
                              style="width: 240px;">
                    </el-input>
                </el-form-item>
                <span class="create-group-form-text">
                    选择居住地
                </span>
                <el-form-item prop="region">
                    <el-cascader placeholder="居住地"
                                 :options="regionOptions"
                                 v-model="group.region"
                                 @active-item-change="regionItemChange"
                                 style="width: 240px;">
                    </el-cascader>
                </el-form-item>
                <el-form-item class="create-group-form-btn">
                    <el-button type="info"
                               @click="reset('groupForm')">
                        重置
                    </el-button>
                    <el-button type="success"
                               @click="submit('groupForm')">
                        创建
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="create-group-content result"
             v-else>
            <svg-icon class="create-group-content-icon"
                      :iconClass="iconClass" />
            <span class="create-group-content-text">
                {{ text }}
            </span>
            <span class="create-group-content-info">
                名称
                <i>
                    {{ group.groupName }}
                </i>
            </span>
            <span class="create-group-content-info">
                家庭组 ID
                <i>
                    {{ group.groupId }}
                </i>
            </span>
            <span class="create-group-content-btn">
                <el-button type="success"
                           @click="routerHome">
                    开始使用
                </el-button>
            </span>
        </div>
    </div>
</template>

<script>
import storage from '@/assets/js/storage';
import { createGroup } from '@/api/group';
import { getProvinceInfo, getCityInfo, getDistrictInfo } from '@/api/user';

import { RULES } from './config.js';

export default {
	name: 'CreateGroup',
	data() {
		return {
			loading: false,
			group: {
				groupId: '',
				groupName: `${this.$store.state.user.nickName} 的家`,
				region: [],
			},
			rules: RULES,
			regionOptions: [],
			provinceindex: null,
			cityindex: null,
			text: '',
			iconClass: 'icon-success_info',
		};
	},

	methods: {
		// 提交
		submit(formName) {
			this.$refs[formName].validate(valid => {
				if (valid) {
					this.createGroupFn({
						groupName: this.group.groupName,
						region: this.getRegion(),
					});
				} else {
					return false;
				}
			});
		},

		// 重置
		reset(formName) {
			this.$refs[formName].resetFields();
		},

		// 返回主页
		routerHome() {
			this.$router.push({ name: 'home' });
		},

		// 选择变化
		regionItemChange(value) {
			if (value.length === 1) {
				this.getCityInfoFn(value);
			} else {
				this.getDistrictInfoFn(value);
			}
		},

		// 创建家庭组
		createGroupFn(data) {
			this.loading = true;
			createGroup(data)
				.then(resData => {
					storage.set('token', resData.token);
					this.$store.dispatch('token', resData.token);
					this.$store.dispatch('user', resData.userInfo);
					this.group.groupId = resData.userInfo.groupId;
					this.text = '创建成功！';
					this.iconClass = 'icon-success_info';
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					this.iconClass = 'icon-error';
					this.text = error.message;
				})
				.then(() => {
					this.loading = false;
				});
		},

		// 查找省
		getProvinceInfoFn() {
			getProvinceInfo({ type: 'province', adcode: '' })
				.then(resData => {
					this.regionOptions = resData;
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				});
		},

		// 查找市
		getCityInfoFn(value) {
			this.provinceindex = this.regionOptions.findIndex(el => {
				return el.value === value[0];
			});
			if (this.regionOptions[this.provinceindex].children.length) {
				return;
			}

			getCityInfo({ adcode: value[0] })
				.then(resData => {
					this.regionOptions[this.provinceindex].children = resData;
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				});
		},

		// 查找县/区
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
			getDistrictInfo({ adcode: value[1] })
				.then(resData => {
					this.regionOptions[this.provinceindex].children[
						this.cityindex
					].children = resData;
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
				});
		},

		// 获取 region
		getRegion() {
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
		this.getProvinceInfoFn();
	},
};
</script>

<style lang="scss" scoped>
.create-group {
	height: 100%;
	position: relative;

	@include flex-center(column);
	justify-content: flex-start;

	&-content {
		height: 580px;
		width: 500px;
		margin: auto;
		background-color: #fff;
		border-radius: 6px;
		box-shadow: 0 2px 24px 0 rgba(0, 0, 0, 0.2);
	}

	&-title {
		width: 100%;
		height: 120px;
		margin-top: 60px;

		@include flex-center(column);

		&-icon {
			display: block;
			width: 120px;
			height: 120px;
			border-radius: 50%;
			font-size: 80px;
			border: 2px solid rgba(151, 140, 140, 0.4);
			box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
			background-color: rgba($color: #d7dada, $alpha: 0.3);
			@include flex-center();
		}

		&-text {
			display: block;
			height: 20px;
			margin-top: 20px;
			color: #909399;
		}
	}

	&-form {
		width: 80%;
		height: 360px;
		display: flex;
		align-items: center;
		flex-direction: column;
		position: relative;
		margin: 0 auto;
		margin-top: 40px;

		&-text {
			color: #909399;
			margin-bottom: 20px;
		}

		&-btn {
			margin: 0;
			font-size: 16px;
			position: absolute;
			bottom: 70px;

			.el-button {
				width: 140px;
			}
		}
	}

	&-content {
		&-icon {
			display: block;
			width: 160px;
			height: 160px;
			background-size: 100% 100%;
			background-position: center center;
			background-repeat: no-repeat;
		}

		&-text {
			user-select: none;
			margin-top: 20px;
			color: #909399;
		}

		&-info {
			margin-top: 20px;
			user-select: none;
			color: #909399;
			margin-top: 15px;
			@include flex-center(column);

			i {
				user-select: text;
				color: #606266;
				margin-top: 15px;
			}
		}

		&-btn {
			margin-top: 50px;
			font-size: 16px;

			.el-button {
				width: 160px;
				font-size: 16px;
			}
		}
	}

	.result {
		@include flex-center(column);
	}
}
</style>
