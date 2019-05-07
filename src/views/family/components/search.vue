<template>
    <div class="view-search">
        <div v-if="userList.length">
            <div class="view-search-user"
                 v-for="(item, index) in userList"
                 :key="index"
                 @click="displayMemberInfo(index)">
                <span class="view-search-user-avatar">
                    <img :src="item.avatar"
                         :alt="item.nickName">
                </span>
                <span class="view-search-user-info">
                    <i class="view-search-user-info-nickName">
                        {{ item.nickName }}
                    </i>
                    <i class="view-search-user-info-userId">
                        ({{ item.userId }})
                    </i>
                </span>
                <div class="view-search-user-mask-layer">
                </div>
            </div>
        </div>
        <div class="view-search-error"
             v-else>
            <span>
                wow~ ⊙o⊙
            </span>
            <span>
                没有符合条件的家庭成员
            </span>
        </div>
    </div>
</template>

<script>
export default {
	name: 'ViewSearch',
	data() {
		return {};
	},

	props: {
		userList: {
			type: Array,
		},
	},

	methods: {
		// 查看详细资料
		displayMemberInfo(index) {
			this.$emit('displayMemberInfo', index);
		},
	},
};
</script>

<style lang="scss" scoped>
.view-search {
	&-user {
		height: 60px;
		padding: 0 20px;
		position: relative;
		cursor: pointer;

		@include flex-start();

		// 遮罩
		&:hover .view-search-user-mask-layer {
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
			z-index: 15;

			img {
				height: 100%;
				width: 100%;
				border-radius: 50%;
			}
		}

		&-info {
			width: 50%;
			text-align: left;
			margin-left: 5%;
			position: relative;
			z-index: 15;

			&-nickName {
				font-size: 16px;
				color: #303133;
			}

			&-userId {
				font-size: 14px;
				color: #606266;
			}
		}
	}

	&-error {
		width: 100%;

		span {
			display: block;
			height: 30px;
			line-height: 200px;
			font-size: 16px;
			text-align: center;
			color: #606266;
		}
	}
}
</style>
