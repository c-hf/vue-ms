<template>
    <div class="view-user">
        <transition name="fade">
            <el-upload class="view-user-avatar"
                       :action="uploadImgUrl"
                       :show-file-list="false"
                       :on-success="setAvatarSuccess"
                       :before-upload="beforeAvatarUpload"
                       :class="{ 'view-user-avatar-active': data.avatar.length,'view-user-avatar-error': isAvatarError }">
                <img :src="data.avatar"
                     v-if="data.avatar.length"
                     alt="avatar">
                <i v-else
                   class="view-user-avatar-text">
                    上传头像
                </i>
                <i v-if="!data.avatar.length"
                   class="view-user-avatar-icon el-icon-plus">
                </i>
            </el-upload>
        </transition>
        <div class="view-user-sex">
            <span class="view-user-sex-text">
                选择性别
            </span>
            <span class="view-user-sex-icon">
                <i class="view-user-sex-icon-content"
                   :class="{'view-user-sex-icon-active': male}"
                   @click="changeSex(true)">
                    <svg-icon iconClass="icon-nan" />
                </i>
                <i>or</i>
                <i class="view-user-sex-icon-content"
                   :class="{'view-user-sex-icon-active': !male}"
                   @click="changeSex(false)">
                    <svg-icon iconClass="icon-nv" />
                </i>
            </span>
        </div>
        <div class="view-user-birthday">
            <span class="view-user-birthday-text">
                选择生日
            </span>
            <el-form :model="data"
                     :rules="rules"
                     ref="birthdayForm">
                <el-form-item prop="birthday">
                    <el-date-picker v-model="data.birthday"
                                    type="date"
                                    placeholder="年月日"
                                    align="center"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd"
                                    style="width: 200px">
                    </el-date-picker>
                </el-form-item>
            </el-form>
        </div>
        <div class="view-user-btn">
            <el-button type="success"
                       @click="next('birthdayForm')">
                下一步
                <i class="el-icon-arrow-right el-icon--right"></i>
            </el-button>
        </div>
    </div>
</template>

<script>
import { UPLOADIMGURL } from '@/config';

export default {
	name: 'ViewPersonal',
	data() {
		const validateBirthday = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请选择生日'));
			} else {
				const time = Math.floor(
					(Date.now() - new Date(this.data.birthday).getTime()) /
						(1000 * 60 * 60)
				);
				if (time > 24) {
					callback();
					return;
				}
				callback(new Error('请选择正确的日期'));
			}
		};
		return {
			uploadImgUrl: UPLOADIMGURL,
			imgUrl: '',
			data: this.userData,
			male: true,
			isAvatarError: false,
			rules: {
				birthday: {
					validator: validateBirthday,
					required: true,
				},
			},
		};
	},

	methods: {
		// 性别选择
		changeSex(value) {
			this.male = value;
			this.male ? (this.data.sex = '男') : (this.data.sex = '女');
		},

		// 头像上传回调
		setAvatarSuccess(resData, file) {
			this.isAvatarError = false;
			this.imgUrl = URL.createObjectURL(file.raw);
			this.data.avatar = resData.response.url;
		},

		// 上传限制
		beforeAvatarUpload(file) {
			const isLt2M = file.size / 1024 / 1024 < 2;
			if (!isLt2M) {
				this.$message.error('上传头像图片大小不能超过 2MB!');
			}
			return isLt2M;
		},

		// 下一步
		next(formName) {
			this.$refs[formName].validate(valid => {
				if (!this.data.avatar.length) {
					this.isAvatarError = true;
					if (this.isAvatarError) {
						this.isAvatarError = false;
						setTimeout(() => {
							this.isAvatarError = true;
						}, 100);
					}
				} else if (valid) {
					this.$emit('next', this.data);
				}
			});
		},

		// 选项初始化
		sexInit() {
			if (!this.userData.sex.length) {
				this.changeSex(true);
			} else {
				const sex = {
					男: true,
					女: false,
				};
				this.changeSex(sex[this.userData.sex]);
			}
		},
	},

	props: {
		userData: {
			type: Object,
		},
	},

	created() {
		this.sexInit();
	},
};
</script>

<style lang="scss">
.view-user {
	height: 100%;
	position: relative;

	@include flex-center(column);
	justify-content: flex-start;

	&-avatar {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		margin-top: 60px;
		background-color: #fff;
		border: 2px solid rgba(40, 160, 255, 0.8);
		box-shadow: 0 2px 10px 0 rgba(100, 100, 100, 0.2);
		transform: translate(0);
		transition: all 0.5s;

		.el-upload {
			width: 100%;
			height: 100%;
			position: relative;
			cursor: pointer;
			position: relative;

			@include flex-center();
		}

		&-active {
			border: 2px solid rgba(151, 140, 140, 0.4);
		}

		&-error {
			animation: error 0.5s;

			@keyframes error {
				0% {
					transform: translate(5px);
				}
				20% {
					transform: translate(-5px);
				}
				40% {
					transform: translate(5px);
				}
				60% {
					transform: translate(-5px);
				}
				80% {
					transform: translate(5px);
				}
				100% {
					transform: translate(-5px);
				}
			}
		}

		img {
			border-radius: 50%;
			position: absolute;
			top: 0;
			left: 0;
		}

		&-text {
			color: #409eff;
		}

		&-icon {
			display: block;
			font-size: 24px;
			position: absolute;
			top: 8px;
			right: 4px;
			color: rgba(40, 160, 255, 0.8);

			&::before {
				display: block;
				background-color: #fff;
				border-radius: 50%;
			}
		}
	}

	&-sex {
		margin-top: 40px;

		@include flex-center(column);

		span {
			display: flex;
		}

		&-text {
			margin-bottom: 20px;
			color: #909399;
		}

		&-icon {
			i {
				color: #909399;
				border-radius: 50%;
				margin: 0 10px;
				@include flex-center();
			}

			&-content {
				color: rgba($color: #909399, $alpha: 0.8);
				height: 50px;
				width: 50px;

				svg {
					font-size: 24px;
				}
			}

			.view-user-sex-icon-active {
				background-color: #409eff;
				color: #fff;
				box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.3);
			}
		}
	}

	&-birthday {
		margin-top: 30px;
		@include flex-center(column);

		&-text {
			margin-bottom: 20px;
			color: #909399;
		}
	}

	&-btn {
		position: absolute;
		bottom: 70px;

		.el-button {
			width: 220px;
			font-size: 16px;
		}
	}
}
</style>
