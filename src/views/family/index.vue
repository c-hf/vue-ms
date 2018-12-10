<template>
    <el-row class="family"
            :gutter="24">
        <el-col :span="18"
                class="family-left">
            <el-col :span="12">
                <el-card class="family-right-card">
                    家庭成员数：
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="family-right-card">
                    家庭成员数：
                </el-card>
            </el-col>
            <el-col :span="24">
            </el-col>
        </el-col>
        <el-col :span="6"
                class="family-right">
            <member-list @addMember="addMember" />
        </el-col>

        <el-dialog title="查找"
                   width="500px"
                   :modal="false"
                   :visible.sync="dialogVisible">
            <el-form :model="userData"
                     :rules="rules"
                     ref="addMemberForm">
                <el-form-item prop="id">
                    <el-input v-model="userData.id"
                              placeholder=" ID / 邮箱"
                              autocomplete="off">
                        <i slot="prefix"
                           class="el-input__icon el-icon-search"></i>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary"
                               @click="findUser('addMemberForm')">查找</el-button>
                </el-form-item>
            </el-form>
            <div class="search-result"
                 v-if="member.info">
                <span class="search-result-title">
                    查找结果
                </span>
                <div class="member">
                    <span class="member-avatar">
                        <img :src="member.avatar"
                             :alt="member.nickName">
                    </span>
                    <span class="member-info">
                        <i class="member-info-nickName">{{ member.nickName }}</i>
                        <i class="member-info-id">({{member.id}}) </i>
                    </span>
                    <span class="member-btn">
                        <el-button icon="el-icon-circle-plus-outline"
                                   type="text"
                                   @click="addGroupMemberFn"></el-button>
                    </span>
                    <div class="member-mask-layer">
                    </div>
                </div>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
import { addGroupMember, getUserById } from '@/api/user';

import MemberList from './memberList';
export default {
	name: 'Family',
	data() {
		const validateId = (rule, value, callback) => {
			const [userIdRegExp, emailRegExp] = [
				/^[0-9]{8}$/,
				/^[a-z0-9]+(?:[._-][a-z0-9]+)*@[a-z0-9]+(?:[._-][a-z0-9]+)*\.[a-z]{2,4}$/i,
			];
			if (!value) {
				callback(new Error('请输入ID/邮箱'));
			} else {
				if (userIdRegExp.test(this.userData.id)) {
					this.userData.type = 'userId';
					callback();
				} else if (emailRegExp.test(this.userData.id)) {
					this.userData.type = 'email';
					callback();
				}
				callback(new Error('请输入正确的ID/邮箱'));
			}
		};
		return {
			userData: {
				type: '',
				id: '',
			},
			rules: {
				id: [
					{
						validator: validateId,
						required: true,
						trigger: 'blur',
					},
				],
			},
			dialogVisible: false,
			member: {},
		};
	},

	methods: {
		// 添加家庭成员
		addMember() {
			this.dialogVisible = true;
		},

		// 查找
		findUser(formName) {
			this.$refs[formName].validate(valid => {
				if (!valid) {
					return false;
				}
				this.getUserByIdFn();
			});
		},

		// 添加成员
		addGroupMemberFn() {
			addGroupMember({
				userId: this.member.userId,
				groupId: this.user.groupId,
			}).then(resData => {
				console.log(resData);
			});
		},

		// getUserById 封装
		getUserByIdFn() {
			this.member.info = '';
			getUserById(this.userData)
				.then(resData => {
					this.member = resData;
					this.member.info = '成功！';
					this.member.id = this.userData.id;
				})
				.catch(error => {
					this.$message({
						showClose: true,
						center: true,
						message: error.message,
						type: 'error',
					});
					this.member.info = '没有找到符合搜索条件的用户';
				});
		},
	},

	components: {
		MemberList,
	},
};
</script>

<style lang="scss" scoped>
.family {
	&-left {
		&-card {
			margin-bottom: 20px;
		}
	}

	.el-form {
		display: flex;
		padding: 0 20px;

		&-item:nth-of-type(1) {
			width: 400px;
		}

		&-item:nth-of-type(2) {
			width: 80px;
			margin-left: 20px;
		}
	}

	.search-result {
		padding: 0 20px;

		&-title {
			display: block;
			width: 100%;
			padding-bottom: 20px;
		}
	}

	.member {
		height: 60px;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: start;
		position: relative;
		cursor: pointer;

		// 遮罩
		&:hover .member-mask-layer {
			width: 100%;
			height: 100%;
			background: #000;
			opacity: 0.1;
			position: absolute;
			top: 0;
			left: 0;
			z-index: 12;
		}
		&-avatar {
			width: 40px;
			height: 40px;
			border-radius: 50%;
			display: block;
			position: relative;
			z-index: 15;

			img {
				border-radius: 50%;
			}
		}

		&-info {
			width: 60%;
			text-align: left;
			margin-left: 5%;
			position: relative;
			z-index: 15;

			&-nickName {
				font-size: 16px;
			}
			&-id {
				margin-left: 10px;
				color: #99a9bf;
			}
		}
		&-btn {
			position: absolute;
			right: 20px;
			z-index: 15;
		}
	}
}
</style>
