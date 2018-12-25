<template>
    <div class="header-content">
        <div class="left">
            <div class="left-logo"
                 :style="{width: `${width}px`}">Logo</div>
            <div class="left-menu">
                <el-button type="text"
                           :disabled="disabled"
                           class="left-menu-btn"
                           @click.stop="setCollapse">
                    <i class="fa fa-bars fa-fw"></i>
                </el-button>
            </div>
        </div>

        <div class="right">
            <header-search />
            <dir class="right-item">
                <el-badge :value="promptBadge"
                          class="right-prompt">
                    <i class="fa fa-bell-o"></i>
                </el-badge>
                <el-badge :value="emailBadge"
                          class="right-email">
                    <i class="fa fa-envelope-o"></i>
                </el-badge>
            </dir>
            <el-dropdown trigger="click"
                         @command='handleCommand'
                         placement="bottom">
                <div class="right-user el-dropdown-link">
                    <span class="right-user-avatar">
                        <img :src="user.avatar"
                             :alt="user.nickName">
                    </span>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item disabled>
                        Welcome!
                    </el-dropdown-item>
                    <el-dropdown-item command="userInfo">
                        <i class="fa fa-user fa-fw"></i>
                        &nbsp;我的账号
                    </el-dropdown-item>
                    <el-dropdown-item><i class="fa fa-gear fa-fw">
                        </i>&nbsp;设置
                    </el-dropdown-item>
                    <el-dropdown-item command="signOut">
                        <i class="fa fa-sign-out fa-fw">
                        </i>&nbsp;登出
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </div>
</template>

<script>
import HeaderSearch from './search';
import { getUserInfo, signOut } from '@/api/user';
import storage from '@/assets/js/storage';

export default {
	name: 'Header',
	data() {
		return {};
	},

	methods: {
		setCollapse() {
			this.$emit('setCollapse');
		},

		handleCommand(command) {
			if (command === 'signOut') {
				this.signOutFn();
			} else if (command === 'userInfo') {
				this.getUserInfoFn();
			}
		},

		// signOut 封装
		signOutFn() {
			signOut()
				.then(data => {
					if (data === 'ok') {
						this.$emit('signOut');
						storage.remove('token');
						this.$store.dispatch('token', '');
						this.$store.dispatch('user', {});
						this.$store.dispatch('device', []);
						this.$router.replace({
							name: 'sign',
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
				});
		},

		// getUserInfo 封装
		getUserInfoFn() {
			getUserInfo()
				.then(data => {
					if (data) {
						console.log(data);
					}
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
	},

	components: {
		HeaderSearch,
	},

	props: {
		user: {
			type: Object,
		},
		width: {
			type: Number,
		},
		promptBadge: {
			type: Number,
		},
		emailBadge: {
			type: Number,
		},
		disabled: {
			type: Boolean,
		},
	},
};
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/mixins';
.header-content {
	width: 100%;
	height: 100%;
	@include flex-between();

	.left,
	.right {
		height: 100%;
		display: flex;
		align-items: center;
		box-sizing: border-box;
	}

	.left {
		&-logo {
			height: 100%;
			transition: all 0.5s;
			@include flex-center();
		}

		&-menu {
			height: 100%;
			@include flex-center();

			&-btn {
				display: block;
				color: #000;
				margin: 0 20px;
				cursor: pointer;
			}
		}
	}

	.right {
		width: 500px;
		height: 100%;
		padding-right: 20px;

		.el-input {
			flex: 5;
			margin-right: 10px;
		}

		&-item {
			flex: 2;
			display: flex;
			justify-content: space-around;
			cursor: pointer;
		}

		.el-dropdown {
			flex: 1;
		}

		&-user {
			@include flex-around();
			cursor: pointer;

			&-avatar {
				display: block;
				width: 32px;
				height: 32px;
				border-radius: 50%;

				img {
					width: 100%;
					height: 100%;
					border-radius: 50%;
				}
			}

			&-name {
				width: 40%;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}
	}
}
</style>
