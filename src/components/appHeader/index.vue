<template>
    <div class="app-header-content">
        <div class="left">
            <div class="left-logo"
                 :style="{width: `${width}px`}">
                Logo
            </div>
            <div class="left-menu">
                <el-button type="text"
                           :disabled="disabled"
                           class="left-menu-btn"
                           @click.stop="setCollapse">
                    <svg-icon iconClass="icon-bars" />
                </el-button>
            </div>
        </div>
        <div class="right">
            <header-search />
            <div class="right-item">
                <el-tooltip effect="dark"
                            content="告警信息"
                            :open-delay="600"
                            placement="bottom">
                    <el-badge :value="promptBadge"
                              class="right-prompt">
                        <span>
                            <svg-icon iconClass="icon-remind" />
                        </span>
                    </el-badge>
                </el-tooltip>
                <el-tooltip effect="dark"
                            content="消息中心"
                            :open-delay="600"
                            placement="bottom">
                    <el-badge :value="emailBadge"
                              class="right-email">
                        <span @click="routerMessage">
                            <svg-icon iconClass="icon-message" />
                        </span>
                    </el-badge>
                </el-tooltip>
            </div>
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
                        <svg-icon iconClass="icon-people" />
                        我的账号
                    </el-dropdown-item>
                    <el-dropdown-item command="set">
                        <svg-icon iconClass="icon-setup" />
                        设置
                    </el-dropdown-item>
                    <el-dropdown-item command="signOut">
                        <svg-icon iconClass="icon-signout" />
                        登出
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <el-dialog :visible.sync="visible"
                   :modal-append-to-body="false"
                   width="360px"
                   class="app-user-info">
            <app-user-info :user="user"
                           type="own"
                           @setVisible="setVisible" />
        </el-dialog>
    </div>
</template>

<script>
import HeaderSearch from './search';
import AppUserInfo from '@/components/appUserInfo';

export default {
	name: 'AppHeader',
	data() {
		return {
			visible: false,
		};
	},

	methods: {
		// 设置折叠
		setCollapse() {
			this.$emit('setCollapse');
		},

		// 打开消息列表
		routerMessage() {
			this.$emit('routerMessage', true);
		},

		// 选择
		handleCommand(command) {
			if (command === 'signOut') {
				this.$emit('signOut');
			} else if (command === 'userInfo') {
				this.visible = true;
			} else if (command === 'set') {
				this.$router.push({ name: 'set' });
			}
		},

		setVisible(value) {
			this.visible = value;
		},

		// 获取用户信息封装
		// getUserInfoFn() {
		// 	getUserInfo()
		// 		.then(data => {
		// 			if (data) {
		// 				console.log(data);
		// 			}
		// 		})
		// 		.catch(error => {
		// 			this.$message({
		// 				showClose: true,
		// 				center: true,
		// 				message: error.message,
		// 				type: 'error',
		// 			});
		// 		});
		// },
	},

	components: {
		HeaderSearch,
		AppUserInfo,
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
.app-header-content {
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
				cursor: pointer;
				font-size: 18px;
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

		&-prompt,
		&-email {
			font-size: 20px;
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
